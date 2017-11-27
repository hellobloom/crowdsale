import { advanceBlock } from "./helpers/advanceToBlock";
import { latestBlockTime } from "./helpers/latestBlockNumber";

import * as BigNumber from "bignumber.js";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

const chaiBignumber = require("chai-bignumber");

chai
  .use(chaiAsPromised)
  .use(chaiBignumber(web3.BigNumber))
  .should();

const BloomTokenSale = artifacts.require("BloomTokenSale");
const BLT = artifacts.require("BLT");

function dust() {
  return new BigNumber(web3.toWei(1, "finney"));
}

contract("BloomTokenSale", function([_, buyer, wallet, purchaser]) {
  const createSaleWithToken = async function(
    startTime: number,
    endTime: number,
    cap = new BigNumber("1.66667e23")
  ) {
    const sale = await BloomTokenSale.new(
      startTime,
      endTime,
      new BigNumber(1000),
      wallet,
      cap
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await sale.finishPresale(30000, 0);

    return { sale, token };
  };

  // timer for tests specific to testrpc
  const timer = async (s: any) => {
    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync(
        {
          jsonrpc: "2.0",
          method: "evm_increaseTime",
          params: [s], // 60 seaconds, may need to be hex, I forget
          id: Math.floor(Math.random() * 10000000) // Id of the request; anything works, really
        },
        function(err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  };

  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  it("allocates initial supply of tokens to controller's address", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 5,
      3000000000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    const token = await BLT.new();
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
    controllerBalanceAfter.should.be.bignumber.equal("8.25e25");
  });

  it("does not allow setting the token during the sale", async () => {
    const { sale } = await createSaleWithToken(
      // The early payment attempt is the eighth transaction in this test
      // so we start the sale nine blocks ahead
      latestBlockTime() + 5,
      latestBlockTime() + 100
    );

    await timer(10);

    sale.setToken("0x0").should.be.rejectedWith("invalid opcode");
  });

  it("only allows the owner to allocate supply", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 5,
      3000000000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);

    sale
      .allocateSupply({ from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    sale.allocateSupply().should.be.fulfilled;
  });

  it("only allows the owner to set the token", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 5,
      latestBlockTime() + 1000,
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
    const latestTime = latestBlockTime();

    const { sale } = await createSaleWithToken(
      // The early payment attempt is the eighth transaction in this test
      // so we start the sale nine blocks ahead
      latestTime + 10,
      latestTime + 100
    );

    await sale
      .sendTransaction({
        value: dust(),
        from: purchaser
      })
      .should.be.rejectedWith("invalid opcode");

    await advanceBlock();
    timer(10);

    await await sale.sendTransaction({
      value: new BigNumber(web3.toWei(1, "finney")),
      from: purchaser
    }).should.be.fulfilled;
  });

  it("rejects payments that come after the ending block", async function() {
    const latestTime = latestBlockTime();

    const { sale } = await createSaleWithToken(latestTime + 5, latestTime + 15);

    await timer(7);

    await await sale.sendTransaction({
      value: dust(),
      from: purchaser
    }).should.be.fulfilled;

    await timer(20);

    await sale
      .sendTransaction({ value: dust(), from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("transfers tokens from controller to sender on purchase", async function() {
    const latestTime = latestBlockTime();

    const { sale, token } = await createSaleWithToken(
      latestTime + 5,
      latestTime + 1000
    );

    timer(5);

    const purchaserTokenAllocationBefore = await token.balanceOf(purchaser);
    const walletBalanceBefore = web3.eth.getBalance(wallet);

    await await sale.sendTransaction({ value: dust(), from: purchaser });

    const purchaserTokenAllocationAfter = await token.balanceOf(purchaser);
    const walletBalanceAfter = web3.eth.getBalance(wallet);

    purchaserTokenAllocationBefore.should.be.bignumber.equal(0);

    purchaserTokenAllocationAfter.should.be.bignumber.equal(
      "450270167503744301"
    );
    walletBalanceAfter.should.be.bignumber.equal(
      walletBalanceBefore.plus("1000000000000000")
    );
  });

  it("supports buying tokens on behalf of other addresses", async function() {
    const latestTime = latestBlockTime();

    const { sale, token } = await createSaleWithToken(
      latestTime + 5,
      latestTime + 1000
    );

    timer(5);

    const purchaserTokenAllocationBefore = await token.balanceOf(purchaser);
    const buyerTokenAllocationBefore = await token.balanceOf(buyer);

    await sale.proxyPayment(buyer, { value: dust(), from: purchaser });

    const purchaserTokenAllocationAfter = await token.balanceOf(purchaser);
    const buyerTokenAllocationAfter = await token.balanceOf(buyer);

    purchaserTokenAllocationBefore.should.be.bignumber.equal(0);
    purchaserTokenAllocationAfter.should.be.bignumber.equal(0);
    buyerTokenAllocationBefore.should.be.bignumber.equal(0);
    buyerTokenAllocationAfter.should.be.bignumber.equal("450270170206987301");
  });

  it("rejects proxy payments for a null address", async function() {
    const latestTime = latestBlockTime();

    const { sale } = await createSaleWithToken(
      latestTime + 5,
      latestTime + 1000
    );

    sale
      .proxyPayment("0x0", { value: dust(), from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("does not support transfering tokens unless it is from the controller", async function() {
    const latestTime = latestBlockTime();

    const { sale, token } = await createSaleWithToken(
      latestTime + 5,
      latestTime + 1000
    );

    timer(5);

    await await sale.sendTransaction({ value: dust(), from: purchaser });

    token
      .transfer(buyer, 5, { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    token.transfer(buyer, 5, { from: sale }).should.be.fulfilled;
  });

  it("does not allow anyone to spend other account's tokens", async function() {
    const latestTime = latestBlockTime();

    const { sale, token } = await createSaleWithToken(
      latestTime + 5,
      latestTime + 1000
    );

    timer(5);

    await sale.sendTransaction({
      value: dust(),
      from: purchaser
    });

    token
      .approve(buyer, 5, { from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    token
      .approve(buyer, 5, { from: sale })
      .should.be.rejectedWith("invalid opcode");
  });

  it("provides a helper method for checking if the sale has ended", async function() {
    const latestTime = latestBlockTime();

    const sale = await BloomTokenSale.new(
      latestTime + 2,
      latestTime + 5,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    );

    let ended = await sale.hasEnded();
    ended.should.equal(false);

    await timer(10);
    await advanceBlock();

    ended = await sale.hasEnded();
    ended.should.equal(true);
  });

  it("rejects a sale with an endTime before the startDate", async function() {
    const latestTime = latestBlockTime();

    BloomTokenSale.new(
      latestTime + 2,
      latestTime + 1,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("rejects a sale with a startDate before the current block", async function() {
    const latestTime = latestBlockTime();

    BloomTokenSale.new(
      latestTime - 1,
      latestTime + 10,
      new BigNumber(1000),
      wallet,
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("requires a positive rate", async function() {
    const latestTime = latestBlockTime();

    BloomTokenSale.new(
      latestTime + 10,
      latestTime + 10,
      new BigNumber(0),
      wallet,
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("rejects a null wallet", async function() {
    const latestTime = latestBlockTime();

    BloomTokenSale.new(
      latestTime + 10,
      latestTime + 10,
      new BigNumber(1000),
      "0x0",
      new BigNumber("1.66667e23")
    ).should.be.rejectedWith("invalid opcode");
  });

  it("rejects payments when the sale is paused", async function() {
    const latestTime = latestBlockTime();

    const sale = await BloomTokenSale.new(
      latestTime + 10,
      latestTime + 1000,
      new BigNumber(1000),
      wallet,
      new BigNumber("1000")
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await advanceBlock();

    await timer(10);

    await sale
      .sendTransaction({
        value: 1,
        from: purchaser
      })
      .should.be.rejectedWith("invalid opcode");
  });

  it("enforces that the cap is greater than zero", async function() {
    const latestTime = latestBlockTime();

    await BloomTokenSale.new(
      latestTime + 5,
      latestTime + 5,
      new BigNumber(1000),
      wallet,
      0
    ).should.be.rejectedWith("invalid opcode");
  });

  it("updates the max raise based on the USD/ETH price", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 10,
      latestBlockTime() + 500,
      new BigNumber(1000),
      wallet,
      1
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await sale.finishPresale(40000, 0);

    await timer(10);

    const weiCap = await sale.cap();
    weiCap.should.be.bignumber.equal(web3.toWei(125000, "ether"));
  });

  it("does not let non-owners finish the presale and set the price", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 50,
      latestBlockTime() + 100,
      new BigNumber(1000),
      wallet,
      1
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

    await sale
      .finishPresale(40000, 0, { from: buyer })
      .should.be.rejectedWith("invalid opcode");

    await sale.finishPresale(40000, 0).should.be.fulfilled;
  });

  it("updates the price of one BLT based on the USD/ETH price", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 5,
      latestBlockTime() + 10,
      new BigNumber(1000),
      wallet,
      1
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await sale.finishPresale(40000, 0);

    await timer(5);

    await await sale.sendTransaction({
      value: new BigNumber("1525000000000000"), // $0.61 worth of ETH at $400/ETH rate
      from: buyer
    });

    const buyerBalance = await token.balanceOf(buyer);
    buyerBalance.should.be.bignumber.equal("915732630059213613");
  });

  it("supports syncing weiRaised with wallet for presale purchases", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 5,
      latestBlockTime() + 10,
      new BigNumber(1000),
      wallet,
      1
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

    const beforeSync = await sale.weiRaised();
    await sale.finishPresale(40000, 0);
    const afterSync = await sale.weiRaised();

    beforeSync.should.be.bignumber.equal(0);
    afterSync.should.be.bignumber.equal(web3.eth.getBalance(wallet));
  });

  it("supports specifying wei raised outside of wallet too", async function() {
    const sale = await BloomTokenSale.new(
      latestBlockTime() + 5,
      latestBlockTime() + 10,
      new BigNumber(1000),
      wallet,
      1
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

    const beforeSync = await sale.weiRaised();
    await sale.finishPresale(40000, new BigNumber("5000e18"));
    const afterSync = await sale.weiRaised();

    beforeSync.should.be.bignumber.equal(0);
    afterSync.should.be.bignumber.equal(
      web3.eth.getBalance(wallet).add(new BigNumber("5000e18"))
    );
  });

  it("allocates vested tokens for presale purchases", async () => {
    const latestTime = latestBlockTime();

    const sale = await BloomTokenSale.new(
      latestTime + 50,
      latestTime + 100,
      new BigNumber(1000),
      wallet,
      1234
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

    await token.setCanCreateGrants(sale.address, true);

    await sale.allocatePresaleTokens(
      buyer,
      5000,
      latestBlockTime() + 10000,
      latestBlockTime() + 100000
    ).should.be.fulfilled;

    const buyerBalance = await token.balanceOf(buyer);
    const spendableBalance = await token.spendableBalanceOf(buyer);

    buyerBalance.should.be.bignumber.equal(5000);
    spendableBalance.should.be.bignumber.equal(0);
  });

  it("does not allow presale allocates after sale has started", async () => {
    const latestTime = latestBlockTime();

    const sale = await BloomTokenSale.new(
      latestTime + 50,
      latestTime + 100,
      new BigNumber(1000),
      wallet,
      1234
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

    await token.setCanCreateGrants(sale.address, true);

    await sale.allocatePresaleTokens(
      buyer,
      1,
      latestBlockTime() + 10000,
      latestBlockTime() + 100000
    ).should.be.fulfilled;

    await timer(50);

    await sale
      .allocatePresaleTokens(
        buyer,
        1,
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      )
      .should.be.rejectedWith("invalid opcode");
  });

  it("allows owner to revoke token grants", async () => {
    const latestTime = latestBlockTime();

    const sale = await BloomTokenSale.new(
      latestTime + 50,
      latestTime + 100,
      new BigNumber(1000),
      wallet,
      1234
    );

    const token = await BLT.new();
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();

    await token.changeVestingWhitelister(sale.address);

    await sale.allocatePresaleTokens(
      buyer,
      5000,
      latestTime + 75,
      latestTime + 125
    );

    await sale.finishPresale(30000, 0);

    const walletTokensBefore = await token.balanceOf(wallet);
    await timer(101);
    await sale.revokeGrant(buyer, 0);

    const walletTokensAfter = await token.balanceOf(wallet);
    // Timing of revoke makes it tough to get the exact amount revoked
    walletTokensBefore.should.be.bignumber.equal("7.5e25");
    walletTokensAfter
      .sub(walletTokensBefore)
      .should.be.bignumber.greaterThan(850);
  });

  describe("allocating tokens to advisors", async () => {
    let sale: any;
    let token: any;

    beforeEach(async () => {
      sale = await BloomTokenSale.new(
        latestBlockTime() + 5,
        latestBlockTime() + 10,
        new BigNumber(1000),
        wallet,
        new BigNumber("1.6e23")
      );

      token = await BLT.new();
      await token.changeController(sale.address);
      await sale.setToken(token.address);
      await sale.allocateSupply();
      await token.setCanCreateGrants(sale.address, true);
    });

    it("updates the advisorPool when granting advisor tokens", async () => {
      const advisorPoolBefore = await sale.advisorPool();

      await sale.allocateAdvisorTokens(
        buyer,
        new BigNumber("1e24"),
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      );

      const advisorPoolAfter = await sale.advisorPool();
      const buyerBalance = await token.balanceOf(buyer);

      advisorPoolBefore.should.be.bignumber.equal("7.5e24");
      buyerBalance.should.be.bignumber.equal("1e24");
      advisorPoolAfter.should.be.bignumber.equal("6.5e24");
    });

    it("rejects advisor allocations once the pool has been emptied", async () => {
      await sale.allocateAdvisorTokens(
        buyer,
        new BigNumber("3.75e24"),
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      ).should.be.fulfilled;

      await sale.allocateAdvisorTokens(
        buyer,
        new BigNumber("3.75e24"),
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      ).should.be.fulfilled;

      await sale
        .allocateAdvisorTokens(
          buyer,
          1,
          latestBlockTime() + 10000,
          latestBlockTime() + 100000
        )
        .should.be.rejectedWith("invalid opcode");
    });

    it("rejects advisor allocations if the pool does not have enough funds left", async () => {
      await sale.allocateAdvisorTokens(
        buyer,
        new BigNumber("3e24"),
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      ).should.be.fulfilled;

      await sale.allocateAdvisorTokens(
        buyer,
        new BigNumber("3e24"),
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      ).should.be.fulfilled;

      await sale
        .allocateAdvisorTokens(
          buyer,
          new BigNumber("3e24"),
          latestBlockTime() + 10000,
          latestBlockTime() + 100000
        )
        .should.be.rejectedWith("invalid opcode");
    });

    it("transfers unallocated advisor tokens to the wallet", async () => {
      await sale.allocateAdvisorTokens(
        buyer,
        new BigNumber("3e24"),
        latestBlockTime() + 10000,
        latestBlockTime() + 100000
      );

      const walletTokensBefore = await token.balanceOf(wallet);
      await sale.finishPresale(40000, 0);
      const walletTokensAfter = await token.balanceOf(wallet);

      walletTokensAfter
        .sub(walletTokensBefore)
        .should.be.bignumber.equal("4.5e24");
    });
  });

  describe("changing controller after sale", () => {
    let sale: any;
    let token: any;

    beforeEach(async () => {
      const latestTime = latestBlockTime();

      const creation = await createSaleWithToken(
        latestTime + 50,
        latestTime + 100
      );

      sale = creation.sale;
      token = creation.token;

      await timer(150);
    });

    it("supports changing the controller when the sale has been finalized", async () => {
      await sale.finalize();

      await sale.changeTokenController("0x0");

      const newController = await token.controller();
      newController.should.be.equal(
        "0x0000000000000000000000000000000000000000"
      );
    });

    it("must be changed by the owner", async () => {
      await sale.finalize();

      await sale
        .changeTokenController("0x0", { from: buyer })
        .should.be.rejectedWith("invalid opcode");
    });

    it("must be changed after finalization", async () => {
      await sale
        .changeTokenController("0x0")
        .should.be.rejectedWith("invalid opcode");
    });
  });

  it("transfers leftover BLT to our wallet", async () => {
    const latestTime = latestBlockTime();

    const { sale, token } = await createSaleWithToken(
      latestTime + 10,
      latestTime + 1000
    );

    await timer(10);

    await sale.sendTransaction({
      from: buyer,
      value: new BigNumber(web3.toWei(1, "ether"))
    });

    await timer(1000);
    const balanceBefore = await token.balanceOf(wallet);
    const controllerBalanceBefore = await token.balanceOf(sale.address);
    await sale.finalize();
    const balanceAfter = await token.balanceOf(wallet);
    const controllerBalanceAfter = await token.balanceOf(sale.address);

    balanceBefore.should.be.bignumber.equal("75000000e18");
    balanceAfter.should.be.bignumber.equal(
      balanceBefore.add(controllerBalanceBefore)
    );
    controllerBalanceAfter.should.be.bignumber.equal("0");
  });
});
