import { advanceBlock } from "./helpers/advanceToBlock";

const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const BloomTokenSale = artifacts.require("BloomTokenSale");
const Bloom = artifacts.require("Bloom");

contract("BloomTokenSale", function([_, investor, wallet, purchaser]) {
  const createSaleWithToken = async function(startBlock, endBlock) {
    const sale = await BloomTokenSale.new(
      startBlock,
      endBlock,
      new BigNumber(1000),
      wallet
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

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
      wallet
    );

    const token = await Bloom.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);

    const supplyBefore = await token.totalSupply();
    const controllerBalanceBefore = await token.balanceOf(sale.address);

    await sale.allocateSupply();

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
      wallet
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
      wallet
    );

    sale
      .setToken("0x0", { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    sale.setToken("0x0").should.be.fulfilled;
  });

  it("rejects payments that come before the starting block", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;
    const { sale, token } = await createSaleWithToken(
      // The early payment attempt is the sixth transaction in this test
      // so we start the sale seven blocks ahead
      latestBlock + 7,
      latestBlock + 1000
    );

    await sale
      .sendTransaction({ value: 1000, from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    await advanceBlock();

    await sale.sendTransaction({
      value: 1000,
      from: purchaser
    }).should.be.fulfilled;
  });

  it("rejects payments that come after the ending block", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    const { sale } = await createSaleWithToken(
      latestBlock + 1,
      // The late payment attempt is the seventh transaction in this test
      // so we end the sale seven blocks ahead
      latestBlock + 6
    );

    await sale.sendTransaction({
      value: 1000,
      from: purchaser
    }).should.be.fulfilled;

    await sale
      .sendTransaction({ value: 1000, from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("transfers tokens from controller to sender on purchase", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );
    const purchaserTokenAllocationBefore = await token.balanceOf(purchaser);
    const walletBalanceBefore = web3.eth.getBalance(wallet);

    await sale.sendTransaction({ value: 5, from: purchaser });

    const purchaserTokenAllocationAfter = await token.balanceOf(purchaser);
    const walletBalanceAfter = web3.eth.getBalance(wallet);

    purchaserTokenAllocationBefore.should.be.bignumber.equal(0);

    purchaserTokenAllocationAfter.should.be.bignumber.equal(5000);
    walletBalanceAfter.should.be.bignumber.equal(walletBalanceBefore.plus(5));
  });

  it("supports buying tokens on behalf of other addresses", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

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
    investorTokenAllocationAfter.should.be.bignumber.equal(5000);
  });

  it("does not support transfering tokens unless it is from the controller", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );

    await sale.sendTransaction({ value: 5, from: purchaser });

    token
      .transfer(investor, 5, { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    token.transfer(investor, 5, { from: sale }).should.be.fulfilled;
  });

  it("does not allow anyone to spend other account's tokens", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    const { sale, token } = await createSaleWithToken(
      latestBlock + 1,
      latestBlock + 1000
    );

    await sale.sendTransaction({ value: 5, from: purchaser });

    token
      .approve(investor, 5, { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    token
      .approve(investor, 5, { from: sale })
      .should.be.rejectedWith("invalid opcode");
  });
});
