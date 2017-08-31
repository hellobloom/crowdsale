import { advanceBlock } from "./helpers/advanceToBlock";

const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const BloomTokenSale = artifacts.require("BloomTokenSale");
const Bloom = artifacts.require("Bloom");

contract("BloomTokenSale", function([_, investor, wallet, purchaser]) {
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  it("should allow creator to change the controller", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    this.sale = await BloomTokenSale.new(
      latestBlock + 1,
      latestBlock + 10,
      new BigNumber(1000),
      wallet
    );

    this.token = await Bloom.new();
    await this.token.changeController(this.sale.address);

    const owner = await this.token.controller();
    owner.should.equal(this.sale.address);
  });

  it("rejects payments that come before the starting block", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    this.sale = await BloomTokenSale.new(
      // Each transaction that follows is a new block and the early payment
      // attempt is the sixth transaction so we start seven blocks ahead
      latestBlock + 7,
      latestBlock + 1000,
      new BigNumber(1000),
      wallet
    );

    this.token = await Bloom.new();
    await this.token.changeController(this.sale.address);
    await this.sale.setToken(this.token.address);
    await this.sale.allocateSupply();

    await this.sale
      .sendTransaction({ value: 1000, from: purchaser })
      .should.be.rejectedWith("invalid opcode");

    await advanceBlock();

    await this.sale.sendTransaction({
      value: 1000,
      from: purchaser
    }).should.be.fulfilled;
  });

  it("rejects payments that come after the ending block", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;

    this.sale = await BloomTokenSale.new(
      // Each transaction that follows is a new block and the late payment
      // attempt is the seventh transaction so we start seven blocks ahead
      latestBlock + 1,
      latestBlock + 6,
      new BigNumber(1000),
      wallet
    );

    this.token = await Bloom.new();
    await this.token.changeController(this.sale.address);
    await this.sale.setToken(this.token.address);
    await this.sale.allocateSupply();

    await this.sale.sendTransaction({
      value: 1000,
      from: purchaser
    }).should.be.fulfilled;

    await this.sale
      .sendTransaction({ value: 1000, from: purchaser })
      .should.be.rejectedWith("invalid opcode");
  });
});
