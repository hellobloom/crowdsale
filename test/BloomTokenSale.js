import { advanceBlock } from "./helpers/advanceToBlock";

const BigNumber = web3.BigNumber;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const BloomTokenSale = artifacts.require("BloomTokenSale");
const Bloom = artifacts.require("Bloom");

contract("BloomTokenSale", function([_, investor, wallet, purchaser]) {
  const createSale = async function(startBlock, endBlock) {
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

  it("rejects payments that come before the starting block", async function() {
    const latestBlock = web3.eth.getBlock("latest").number;
    const { sale, token } = await createSale(
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

    const { sale } = await createSale(
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
});
