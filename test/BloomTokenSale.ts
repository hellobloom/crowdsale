import { advanceBlock, advanceToBlock } from "./helpers/advanceToBlock";
import { latestBlockNumber } from "./helpers/latestBlockNumber";

import * as BigNumber from "bignumber.js";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

const chaiBignumber = require("chai-bignumber");

chai.use(chaiAsPromised).use(chaiBignumber(web3.BigNumber)).should();

const BloomTokenSale = artifacts.require("BloomTokenSale");
const Bloom = artifacts.require("Bloom");

contract("BloomTokenSale", function([_, investor, wallet, purchaser]) {
  const createSaleWithToken = async function(
    startBlock: number,
    endBlock: number,
    cap = new BigNumber("1.66667e23")
  ) {
    const sale = await BloomTokenSale.new(
      startBlock,
      endBlock,
      new BigNumber(1000),
      wallet,
      cap
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await sale.unpause();
    await sale.finishConfiguration();

    return { sale, token };
  };

  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  it("allocates initial supply of tokens to controller's address", async function() {
    const sale = await BloomTokenSale.new(
      10000,
      20000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);

    const supplyBefore = await token.totalSupply();
    const controllerBalanceBefore = await token.balanceOf(sale.address);

    await sale.allocateSupply();
    await sale.unpause();

    const supplyAfter = await token.totalSupply();
    const controllerBalanceAfter = await token.balanceOf(sale.address);

    supplyBefore.should.be.bignumber.equal(0);
    controllerBalanceBefore.should.be.bignumber.equal(0);

    supplyAfter.should.be.bignumber.equal("15e25");
    controllerBalanceAfter.should.be.bignumber.equal("15e25");
  });

  it("only allows the owner to allocate supply", async function() {
    const sale = await BloomTokenSale.new(
      1000,
      2000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);

    sale
      .allocateSupply({ from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    sale.allocateSupply().should.be.fulfilled;
  });

  it("only allows the owner to set the token", async function() {
    const sale = await BloomTokenSale.new(
      1000,
      2000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    sale
      .setToken("0x0", { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    sale.setToken("0x0").should.be.fulfilled;
  });

  it("rejects payments that come before the starting block", async function() {
    const latestBlock = latestBlockNumber();

    const { sale } = await createSaleWithToken(
      // The early payment attempt is the eighth transaction in this test
      // so we start the sale nine blocks ahead
      latestBlock + 10,
      latestBlock + 1000
    );

    await sale
      .sendTransaction({ value: 1000, from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    await advanceBlock();

    await await sale.sendTransaction({
      value: 1000,
      from: purchaser
    }).should.be.fulfilled;
  });

  it("rejects payments that come after the ending block", async function() {
    const latestBlock = latestBlockNumber();

    const { sale } = await createSaleWithToken(
      latestBlock + 1,
      // The late payment attempt is the ninth transaction in this test
      // so we end the sale eight blocks ahead
      latestBlock + 8
    );

    await await sale.sendTransaction({
      value: 1000,
      from: purchaser
    }).should.be.fulfilled;

    await sale
      .sendTransaction({ value: 1000, from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("transfers tokens from controller to sender on purchase", async function() {
    const latestBlock = latestBlockNumber();

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );
    const purchaserTokenAllocationBefore = await token.balanceOf(purchaser);
    const walletBalanceBefore = web3.eth.getBalance(wallet);

    await await sale.sendTransaction({ value: 5, from: purchaser });

    const purchaserTokenAllocationAfter = await token.balanceOf(purchaser);
    const walletBalanceAfter = web3.eth.getBalance(wallet);

    purchaserTokenAllocationBefore.should.be.bignumber.equal(0);

    purchaserTokenAllocationAfter.should.be.bignumber.equal(5000000000000000);
    walletBalanceAfter.should.be.bignumber.equal(walletBalanceBefore.plus(5));
  });

  it("supports buying tokens on behalf of other addresses", async function() {
    const latestBlock = latestBlockNumber();

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );

    const purchaserTokenAllocationBefore = await token.balanceOf(purchaser);
    const investorTokenAllocationBefore = await token.balanceOf(investor);

    await sale.proxyPayment(investor, { value: 5, from: purchaser });

    const purchaserTokenAllocationAfter = await token.balanceOf(purchaser);
    const investorTokenAllocationAfter = await token.balanceOf(investor);

    purchaserTokenAllocationBefore.should.be.bignumber.equal(0);
    purchaserTokenAllocationAfter.should.be.bignumber.equal(0);
    investorTokenAllocationBefore.should.be.bignumber.equal(0);
    investorTokenAllocationAfter.should.be.bignumber.equal(5000000000000000);
  });

  it("rejects proxy payments for a null address", async function() {
    const latestBlock = latestBlockNumber();

    const { sale } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );

    sale
      .proxyPayment("0x0", { value: 5, from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("does not support transfering tokens unless it is from the controller", async function() {
    const latestBlock = latestBlockNumber();

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );

    await await sale.sendTransaction({ value: 5, from: purchaser });

    token
      .transfer(investor, 5, { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    token.transfer(investor, 5, { from: sale }).should.be.fulfilled;
  });

  it("does not allow anyone to spend other account's tokens", async function() {
    const latestBlock = latestBlockNumber();

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );

    await await sale.sendTransaction({ value: 5, from: purchaser });

    token
      .approve(investor, 5, { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    token
      .approve(investor, 5, { from: sale })
      .should.be.rejectedWith("invalid opcode");
  });

  it("provides a helper method for checking if the sale has ended", async function() {
    const latestBlock = latestBlockNumber();

    const sale = await BloomTokenSale.new(
      latestBlock + 2,
      latestBlock + 2,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    const hasEnded1 = await sale.hasEnded();
    await advanceToBlock(latestBlock + 3);
    const hasEnded2 = await sale.hasEnded();

    hasEnded1.should.equal(false);
    hasEnded2.should.equal(true);
  });

  it("rejects a sale with an endBlock before the startDate", async function() {
    const latestBlock = latestBlockNumber();

    BloomTokenSale.new(
      latestBlock + 2,
      latestBlock + 1,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("rejects a sale with a startDate before the current block", async function() {
    const latestBlock = latestBlockNumber();

    BloomTokenSale.new(
      latestBlock - 1,
      latestBlock,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("requires a positive rate", async function() {
    const latestBlock = latestBlockNumber();

    BloomTokenSale.new(
      latestBlock + 1,
      latestBlock + 1,
      new BigNumber(0),
      wallet,
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("rejects a null wallet", async function() {
    const latestBlock = latestBlockNumber();

    BloomTokenSale.new(
      latestBlock + 1,
      latestBlock + 1,
      new BigNumber(1000),
      "0x0",
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("accepts payments up until the hard cap", async function() {
    const latestBlock = latestBlockNumber();

    const { sale } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000,
      new BigNumber("1000")
    );

    await sale.sendTransaction({
      value: 995,
      from: purchaser
    }).should.be.fulfilled;

    await sale.sendTransaction({
      value: 5,
      from: purchaser
    }).should.be.fulfilled;

    await sale
      .sendTransaction({ value: 5, from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("rejects payments when the sale is paused", async function() {
    const latestBlock = latestBlockNumber();

    const sale = await BloomTokenSale.new(
      latestBlock + 1,
      latestBlock + 1000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1000")
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await advanceBlock();

    await sale
      .sendTransaction({
        value: 1,
        from: purchaser
      })
      .should.be.rejectedWith("invalid opcode");
  });

  it("enforces that the cap is greater than zero", async function() {
    const latestBlock = latestBlockNumber();

    await BloomTokenSale.new(
      latestBlock + 1,
      latestBlock + 1,
      new BigNumber(1000),
      wallet,
      0
    ).should.be.rejectedWith("invalid opcode");
  });

  it("updates the max raise based on the USD/ETH price", async function() {
    const sale = await BloomTokenSale.new(
      1000,
      2000,
      new BigNumber(1000),
      wallet,
      1
    );

    await sale.setEtherPriceInCents(40000);

    const weiCap = await sale.cap();
    weiCap.should.be.bignumber.equal(web3.toWei(125000, "ether"));
  });

  it("does not let non-owners set the USD/ETH price", async function() {
    const sale = await BloomTokenSale.new(
      1000,
      2000,
      new BigNumber(1000),
      wallet,
      1
    );

    await sale
      .setEtherPriceInCents(40000, { from: investor })
      .should.be.rejectedWith("invalid opcode");
  });

  it("updates the price of one BLT based on the USD/ETH price", async function() {
    const latestBlock = latestBlockNumber();

    const sale = await BloomTokenSale.new(
      latestBlock + 1,
      2000,
      new BigNumber(1000),
      wallet,
      1
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.setEtherPriceInCents(40000);
    await sale.allocateSupply();
    await sale.unpause();
    await sale.finishConfiguration();

    await await sale.sendTransaction({
      value: new BigNumber("8.325e15"), // $3.33 ETH at $400/ETH rate
      from: investor
    });

    const investorBalance = await token.balanceOf(investor);
    investorBalance.should.be.bignumber.equal("1e18");
  });
});
