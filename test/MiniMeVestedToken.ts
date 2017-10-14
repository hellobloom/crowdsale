import { advanceBlock } from "./helpers/advanceToBlock";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

const chaiBignumber = require("chai-bignumber");

chai
  .use(chaiAsPromised)
  .use(chaiBignumber(web3.BigNumber))
  .should();

// const MiniMeVestedToken = artifacts.require(
//   "MiniMeVestedToken"
// );
const MockSale = artifacts.require("./helpers/MockSale");
const MockToken = artifacts.require("./helpers/MockToken");

// timer for tests specific to testrpc
const timer = (s: any) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [s], // 60 seaconds, may need to be hex, I forget
        id: new Date().getTime() // Id of the request; anything works, really
      },
      function(err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

contract("MiniMeVestedToken", function(
  [granter, receiver, secondGranter, user]
) {
  let token: any;
  let sale: any;
  let now = 0;

  beforeEach(async () => {
    await advanceBlock();

    sale = await MockSale.new();
    token = await MockToken.new();
    await sale.setToken(token.address);
    await token.changeController(sale.address);

    await sale.allocateSupply();
    await sale.finishConfiguration();
    await token.addGranter(sale.address);
    await sale.grantInstantlyVestedTokens(granter, 100);

    now = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
  });

  it("granter can grant tokens that don't require vesting", async () => {
    await token.transfer(receiver, 50);

    const balance = await token.balanceOf(receiver);
    const transferableBalance = await token.transferableTokens(receiver, now);
    balance.should.be.bignumber.equal(50);
    transferableBalance.should.be.bignumber.equal(50);
  });

  it("cannot create token grants after losing whitelisting ability", async () => {
    // Demonstrate we can grant vested tokens before the change
    await token.grantVestedTokens(
      receiver,
      50,
      now,
      now + 10000,
      now + 20000,
      false,
      false
    ).should.be.fulfilled;

    await token.changeVestingWhitelister(secondGranter).should.be.fulfilled;

    await token
      .grantVestedTokens(
        receiver,
        50,
        now,
        now + 10000,
        now + 20000,
        false,
        false
      )
      .should.be.rejectedWith("invalid opcode");
  });

  it("can create token grants after being whitelisted", async () => {
    await token.changeVestingWhitelister(secondGranter);
    await token.setCanCreateGrants(granter, true, { from: secondGranter });
    await token.grantVestedTokens(
      receiver,
      50,
      now,
      now + 10000,
      now + 20000,
      false,
      false,
      {
        from: granter
      }
    );
    (await token.balanceOf(receiver)).should.be.bignumber.equal(50);
  });

  it("cannot whitelist ppl after losing vesting whitelisting ability", async () => {
    await token.changeVestingWhitelister(secondGranter);
    await token
      .setCanCreateGrants(secondGranter, true, { from: granter })
      .should.be.rejectedWith("invalid opcode");
  });

  describe("getting a token grant", async () => {
    const cliff = 10000;
    const vesting = 20000; // seconds

    beforeEach(async () => {
      await token.grantVestedTokens(
        receiver,
        50,
        now,
        now + cliff,
        now + vesting,
        false,
        false,
        { from: granter }
      );
    });

    it("tokens are received", async () => {
      assert.equal(await token.balanceOf(receiver), 50);
    });

    it("has 0 transferable tokens before cliff", async () => {
      assert.equal(await token.transferableTokens(receiver, now), 0);
    });

    it("all tokens are transferable after vesting", async () => {
      assert.equal(await token.transferableTokens(receiver, now + vesting), 50);
    });

    it("throws when trying to transfer non vested tokens", async () => {
      await token
        .transfer(user, 1, { from: receiver })
        .should.be.rejectedWith("invalid opcode");
    });

    it("throws when trying to transfer from non vested tokens", async () => {
      await token.approve(user, 1, { from: receiver });
      await token
        .transferFrom(receiver, user, 50, {
          from: user
        })
        .should.be.rejectedWith("invalid opcode");
    });

    it("cannot be revoked", async () => {
      await token
        .revokeTokenGrant(receiver, user, 0, { from: granter })
        .should.be.rejectedWith("invalid opcode");
    });

    it("can transfer all tokens after vesting ends", async () => {
      await timer(vesting);
      await token.transfer(user, 50, { from: receiver });
      assert.equal(await token.balanceOf(user), 50);
    });

    it("can approve and transferFrom all tokens after vesting ends", async () => {
      await timer(vesting);
      await token.approve(user, 50, { from: receiver });
      await token.transferFrom(receiver, user, 50, {
        from: user
      });
      assert.equal(await token.balanceOf(user), 50);
    });

    it("can handle composed vesting schedules", async () => {
      await timer(cliff);
      await token.transfer(user, 12, { from: receiver });
      assert.equal(await token.balanceOf(user), 12);

      let newNow = web3.eth.getBlock(web3.eth.blockNumber).timestamp;

      await token.grantVestedTokens(
        receiver,
        50,
        newNow,
        newNow + cliff,
        newNow + vesting,
        false,
        false,
        { from: granter }
      );
      await token.transfer(user, 13, { from: receiver });
      assert.equal(await token.balanceOf(user), 50 / 2);

      assert.equal(await token.balanceOf(receiver), 3 * 50 / 2);
      assert.equal(await token.transferableTokens(receiver, newNow), 0);
      await timer(vesting);
      await token.transfer(user, 3 * 50 / 2, {
        from: receiver
      });
      assert.equal(await token.balanceOf(user), 50 * 2);
    });
  });

  describe("revoking a token grant", async () => {
    const cliff = 10000;
    const vesting = 20000; // seconds

    beforeEach(async () => {
      await token.grantVestedTokens(
        receiver,
        50,
        now,
        now + cliff,
        now + vesting,
        true,
        false,
        { from: granter }
      );
    });

    it("revokes remaining tokens", async () => {
      const granterBalanceBefore = await token.spendableBalanceOf(granter);

      await timer(15000);

      await token.revokeTokenGrant(receiver, granter, 0);

      const granterBalance = await token.spendableBalanceOf(granter);
      const receiverBalance = await token.spendableBalanceOf(receiver);

      (granterBalance - granterBalanceBefore).should.be.bignumber.equal(13);
      receiverBalance.should.be.bignumber.equal(37);
    });
  });
});
