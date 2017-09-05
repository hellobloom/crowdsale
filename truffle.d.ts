import * as Web3 from "web3";

declare global {
  function contract(name: string, test: ContractTest): void;
  var artifacts: Artifacts;
  var web3: Web3;
}

declare type ContractTest = (accounts: string[]) => void;

interface TransactionMeta {
  from: string;
}

interface Contract<T> {
  "new"(...args: any[]): Promise<T>;
  deployed(): Promise<T>;
  at(address: string): T;
}

interface MetaCoinInstance {
  getBalance(account: string): number;
  getBalanceInEth(account: string): number;
  sendCoin(
    account: string,
    amount: number,
    meta?: TransactionMeta
  ): Promise<void>;
}

type TransactionOptions = Partial<Web3.Transaction>

interface Ownable {
  owner(): string;
  transferOwnership(newOwner: string, options?: TransactionOptions): any;
}

interface BloomTokenSaleInstance extends Ownable {
  address(...args: any[]): any;
  allocateSupply(...args: any[]): any;
  allowance(...args: any[]): any;
  approve(...args: any[]): any;
  approveAndCall(...args: any[]): any;
  balanceOf(...args: any[]): any;
  balanceOf(...args: any[]): any;
  balanceOfAt(...args: any[]): any;
  cap(...args: any[]): any;
  changeController(...args: any[]): any;
  claimTokens(...args: any[]): any;
  controller(...args: any[]): any;
  createCloneToken(...args: any[]): any;
  creationBlock(...args: any[]): any;
  decimals(...args: any[]): any;
  destroyTokens(...args: any[]): any;
  enableTransfers(...args: any[]): any;
  finishConfiguration(...args: any[]): any;
  generateTokens(...args: any[]): any;
  hasEnded(...args: any[]): any;
  name(...args: any[]): any;
  parentSnapShotBlock(...args: any[]): any;
  parentToken(...args: any[]): any;
  proxyPayment(...args: any[]): any;
  sendTransaction(...args: any[]): any;
  setEtherPriceInCents(...args: any[]): any;
  setToken(...args: any[]): any;
  symbol(...args: any[]): any;
  tokenFactory(...args: any[]): any;
  totalSupply(...args: any[]): any;
  totalSupplyAt(...args: any[]): any;
  transfer(...args: any[]): any;
  transferFrom(...args: any[]): any;
  transfersEnabled(...args: any[]): any;
  unpause(...args: any[]): any;
  version(...args: any[]): any;
}

interface BloomInstance extends Ownable {
  address(...args: any[]): any;
  allocateSupply(...args: any[]): any;
  approve(...args: any[]): any;
  balanceOf(...args: any[]): any;
  cap(...args: any[]): any;
  changeController(...args: any[]): any;
  endBlock(...args: any[]): any;
  hasEnded(...args: any[]): any;
  onApprove(...args: any[]): any;
  onTransfer(...args: any[]): any;
  pause(...args: any[]): any;
  paused(...args: any[]): any;
  proxyPayment(...args: any[]): any;
  rate(...args: any[]): any;
  setToken(...args: any[]): any;
  startBlock(...args: any[]): any;
  token(...args: any[]): any;
  total_supply(...args: any[]): any;
  totalSupply(...args: any[]): any;
  transfer(...args: any[]): any;
  unpause(...args: any[]): any;
  wallet(...args: any[]): any;
  weiRaised(...args: any[]): any;
}

interface ConfigurableMockInstance extends Ownable {
  count(...args: any[]): any;
  finishConfiguration(...args: any[]): any;
  increment(...args: any[]): any;
}

interface Artifacts {
  require(name: "BloomTokenSale"): Contract<BloomTokenSaleInstance>;
  require(name: "Bloom"): Contract<BloomInstance>;
  require(name: "./helpers/ConfigurableMock"): Contract<ConfigurableMockInstance>;
}
