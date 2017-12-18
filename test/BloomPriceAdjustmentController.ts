import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { MockBLTInstance } from "../truffle";
import { BloomPriceAdjustmentControllerInstance } from "../contracts";

const chaiBignumber = require("chai-bignumber");

chai
  .use(chaiAsPromised)
  .use(chaiBignumber(web3.BigNumber))
  .should();

const BloomPriceAdjustmentController = artifacts.require(
  "BloomPriceAdjustmentController"
);
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

    await controller.grantAdditionalTokens(alice);

    (await blt.balanceOf.call(alice)).should.be.bignumber.equal(
      "1068381926722368730"
    );
  });

  it("prevents me from granting additional tokens to someone twice", async () => {
    await controller.grantAdditionalTokens(alice).should.be.fulfilled;
    await controller
      .grantAdditionalTokens(alice)
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

  it("only lets the owner call the grantAdditionalTokens function", async () => {
    await controller
      .grantAdditionalTokens(alice, { from: bob })
      .should.be.rejectedWith("invalid opcode");
  });
});
