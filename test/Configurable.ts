import { advanceBlock } from "./helpers/advanceToBlock";
const ConfigurableMock = artifacts.require("./helpers/ConfigurableMock");

import * as Web3 from "web3";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as chaiBignumber from "chai-bignumber";

const should = chai
  .use(chaiAsPromised)
  .use(chaiBignumber(web3.BigNumber))
  .should();

contract("Configurable", function([_, _buyer, _wallet, purchaser]) {
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  it("allows the owner to configure the contract", async function() {
    const counter = await ConfigurableMock.new();
    const count1 = await counter.count();
    await counter.increment();
    const count2 = await counter.count();

    count1.should.be.bignumber.equal(1);
    count2.should.be.bignumber.equal(2);
  });

  it("forbids non-owners from configuring the contract", async function() {
    const counter = await ConfigurableMock.new();

    counter.increment().should.be.fulfilled;
    counter
      .increment({ from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });

  it("does not allow configuration after finalization", async function() {
    const counter = await ConfigurableMock.new();
    await counter.finishConfiguration();

    counter.increment().should.be.rejectedWith("invalid opcode");
  });

  it("triggers a Configured event upon finalization", async function() {
    const counter = await ConfigurableMock.new();
    const { logs } = await counter.finishConfiguration();

    const event = logs.find(
      (log: Web3.SolidityEvent<never>) => log.event === "Configured"
    );

    should.exist(event);
  });

  it("only allows calling decrement after contract has been configured", async function() {
    const counter = await ConfigurableMock.new();
    const count1 = await counter.count();
    await counter.decrement().should.be.rejectedWith("invalid opcode");
    await counter.finishConfiguration();
    await counter.decrement().should.be.fulfilled;
    const count0 = await counter.count();

    count1.should.be.bignumber.equal(1);
    count0.should.be.bignumber.equal(0);
  });
});
