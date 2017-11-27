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
const PlaceholderController = artifacts.require("PlaceholderController");
const BLT = artifacts.require("BLT");

contract("PlaceholderController", function([_, buyer, wallet, recipient]) {
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

  it("allows transfers when the placeholder is the controller", async function() {
    const latestTime = latestBlockTime();

    const sale = await BloomTokenSale.new(
      latestTime + 5,
      latestTime + 20,
      new BigNumber(1000),
      wallet,
      web3.eth.getBalance(wallet).add(1000)
    );

    const token = await BLT.new();
    const placeholder = await PlaceholderController.new(token.address);
    await token.changeController(sale.address);
    await sale.setToken(token.address);
    await sale.allocateSupply();
    await sale.finishPresale(40000, 0);

    await timer(5);

    await sale.sendTransaction({
      value: new BigNumber(web3.toWei(1, "finney")),
      from: buyer
    });
    await token
      .transfer(recipient, 500, { from: buyer })
      .should.be.rejectedWith("invalid opcode");

    await timer(25);

    await sale.finalize();
    await sale.changeTokenController(placeholder.address);
    await token.transfer(recipient, 500, {
      from: buyer
    }).should.be.fulfilled;
  });
});
