const Bloom = artifacts.require("./../contracts/Bloom.sol");

contract("Bloom", function(accounts) {
  let token;

  beforeEach(async function() {
    token = await Bloom.new();
  });

  it("allocates a supply of 150 million BLT", async function() {
    let totalSupply = await token.totalSupply();

    assert.equal(totalSupply, 150000000);
  });
});
