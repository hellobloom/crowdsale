import { advanceBlock } from "./helpers/advanceToBlock";
const ConfigurableMock = artifacts.require("./helpers/ConfigurableMock");

const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("Configurable", function([_, investor, wallet, purchaser]) {
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  it("allows the owner to configure the contract", async function() {
    const counter = await ConfigurableMock.new();
    const count0 = await counter.count();
    await counter.increment();
    const count1 = await counter.count();

    count0.should.be.bignumber.equal(0);
    count1.should.be.bignumber.equal(1);
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

    const event = logs.find(log => log.event === "Configured");

    should.exist(event);
  });
});
