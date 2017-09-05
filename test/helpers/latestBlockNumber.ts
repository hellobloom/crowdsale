export function latestBlockNumber(): number {
  const latestBlock = web3.eth.getBlock("latest");

  if (latestBlock && latestBlock.number) {
    return latestBlock.number;
  } else {
    throw `Expected web3.eth.getBlock to return a block object but got ${latestBlock}`;
  }
}
