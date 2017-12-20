import * as Web3 from "web3";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as _ from "lodash";
const walletGenerator = require("ethereumjs-wallet");
import { MockBLTInstance } from "../truffle";
import {
  BloomPriceAdjustmentControllerInstance,
  Transaction
} from "../contracts";

const chaiBignumber = require("chai-bignumber");

chai
  .use(chaiAsPromised)
  .use(chaiBignumber(web3.BigNumber))
  .should();

const BloomPriceAdjustmentController = artifacts.require(
  "BloomPriceAdjustmentController"
);
const TokenVesting = artifacts.require("TokenVesting");
const MockBLT = artifacts.require("./helpers/MockBLT");

contract("BloomPriceAdjustmentController", function([alice, bob, wallet]) {
  let blt: MockBLTInstance;
  let controller: BloomPriceAdjustmentControllerInstance;

  beforeEach(async () => {
    blt = await MockBLT.new();
    controller = await BloomPriceAdjustmentController.new(blt.address, wallet);
    await blt.gift(alice);
    await blt.gift(controller.address);
    await blt.gift(wallet);
    await blt.changeController(controller.address);
  });

  it("gives a contributor more BLT based on their balance", async () => {
    (await blt.balanceOf(alice)).should.be.bignumber.equal("1e18");

    await controller.grantAdditionalTokensToBuyer(alice);

    (await blt.balanceOf.call(alice)).should.be.bignumber.equal(
      "1068381926722368730"
    );
  });

  it("prevents me from granting additional tokens to someone twice", async () => {
    await controller.grantAdditionalTokensToBuyer(alice).should.be.fulfilled;
    await controller
      .grantAdditionalTokensToBuyer(alice)
      .should.be.rejectedWith("invalid opcode");
  });

  it("doesn't allow purchasing BLT", async () => {
    await controller
      .sendTransaction({
        value: new web3.BigNumber(web3.toWei(0.01, "ether")),
        from: alice
      })
      .should.be.rejectedWith("invalid opcode");
  });

  it("doesn't allow purchasing BLT via the proxyPurchase function", async () => {
    await controller
      .proxyPayment(alice, {
        value: new web3.BigNumber(web3.toWei(0.01, "ether")),
        from: alice
      })
      .should.be.rejectedWith("invalid opcode");
  });

  it("doesn't allow transfering BLT", async () => {
    await blt
      .transfer(bob, new web3.BigNumber("1e17"), { from: alice })
      .should.be.rejectedWith("invalid opcode");
  });

  it("lets us transfer BLT from our wallet to the controller", async () => {
    await blt.transfer(controller.address, new web3.BigNumber("1e17"), {
      from: wallet
    }).should.be.fulfilled;
  });

  it("only lets the wallet make a transfer if it is to the controller", async () => {
    await blt
      .transfer(alice, new web3.BigNumber("1e17"), { from: wallet })
      .should.be.rejectedWith("invalid opcode");
  });

  it("supports changing the controller when we are done", async () => {
    await controller.changeTokenController("0x0").should.be.fulfilled;
  });

  it("transfers the remaining token balance to the wallet when the token controller is changed out", async () => {
    (await blt.balanceOf(controller.address)).should.be.bignumber.equal("1e18");
    (await blt.balanceOf(wallet)).should.be.bignumber.equal("1e18");

    await controller.changeTokenController("0x0");

    (await blt.balanceOf(controller.address)).should.be.bignumber.equal("0");
    (await blt.balanceOf(wallet)).should.be.bignumber.equal("2e18");
  });

  it("only lets the owner call the grantAdditionalTokensToBuyer function", async () => {
    await controller
      .grantAdditionalTokensToBuyer(alice, { from: bob })
      .should.be.rejectedWith("invalid opcode");
  });

  describe("batching adjustments to reduce gas costs", async () => {
    const generateBLTOwners = async (count: number) => {
      const owners = _.times(count, () =>
        walletGenerator.generate().getChecksumAddressString()
      );
      await Promise.all(owners.map(user => blt.gift(user)));
      return owners;
    };

    it("supports batching additional token grants", async () => {
      const owners = await generateBLTOwners(10);
      await blt.bigGift(controller.address);

      await controller.grantAdditionalTokensToBatch(owners).should.be.fulfilled;
    });

    it("requires way less gas than doing each transaction individually", async () => {
      const owners = await generateBLTOwners(50);
      await blt.bigGift(controller.address);

      const batchedGasTotal = await (controller.grantAdditionalTokensToBatch as any).estimateGas(
        owners
      );
      const singleGasTotal = await (controller.grantAdditionalTokensToBuyer as any).estimateGas(
        owners[0]
      );
      const cumulativeSingleGasTotal = singleGasTotal * 50;

      batchedGasTotal.should.be.below(4200000);
      cumulativeSingleGasTotal.should.be.above(5100000);
    });
  });

  describe("presale token grants", async () => {
    type TPresaleTokenFunction = {
      (
        recipient: string,
        amount: number | BigNumber.BigNumber,
        options?: Partial<Transaction> | undefined
      ): Promise<
        Web3.TransactionReceipt<{ [key: string]: string | BigNumber.BigNumber }>
      >;
      call(
        recipient: string,
        amount: number | BigNumber.BigNumber,
        options?: Partial<Transaction> | undefined
      ): Promise<string>;
    };

    const assertPresaleTokenFunction = async (
      presaleFunction: TPresaleTokenFunction,
      expectedVestingEnd: string
    ) => {
      const vehicle = await presaleFunction.call(
        alice,
        new web3.BigNumber("1e18")
      );

      await presaleFunction(alice, new web3.BigNumber("1e18"));

      (await blt.balanceOf(vehicle)).should.be.bignumber.equal("1e18");

      const duration = await TokenVesting.at(vehicle).duration.call();
      const vestingStart = await TokenVesting.at(vehicle).start.call();

      vestingStart.add(duration).should.be.bignumber.equal(expectedVestingEnd);
    };

    it("creates a token vesting contract and transfers tokens to it", async () => {
      await assertPresaleTokenFunction(
        controller.grantNoLockupPresaleTokens,
        "1511974800"
      );
    });

    it("creates a 3 month lockup contract and transfers tokens to it", async () => {
      await assertPresaleTokenFunction(
        controller.grantThreeMonthLockupTokens,
        "1519750800"
      );
    });

    it("creates a 6 month lockup contract and transfers tokens to it", async () => {
      await assertPresaleTokenFunction(
        controller.grantSixMonthLockupTokens,
        "1527699600"
      );
    });

    it("creates a 6 month lockup contract and transfers tokens to it", async () => {
      await assertPresaleTokenFunction(
        controller.grantOneYearLockupTokens,
        "1543510800"
      );
    });
  });
});
