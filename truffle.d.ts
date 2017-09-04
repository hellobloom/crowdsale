import * as Web3 from "web3";

declare global {
  function contract(name: string, test: ContractTest): void;
  var artifacts: Artifacts;
  var web3: Web3;
  var assert: Chai.AssertStatic;
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

interface Transaction {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: ContractInstance | string;
  to: string | null;
  value: BigNumber.BigNumber;
  gasPrice: BigNumber.BigNumber;
  gas: number;
  input: string;
}

type TransactionOptions = Partial<Transaction>;

interface Ownable {
  owner(): string;
  transferOwnership(newOwner: string, options?: TransactionOptions): any;
}

type Address = string;

interface ContractInstance {
  address: Address;
}

interface BloomTokenSaleInstance extends ContractInstance, Ownable {
  allocateSupply(options?: TransactionOptions): Promise<void>;
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
  setToken(token: Address, options?: TransactionOptions): Promise<void>;
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

interface BloomInstance extends MiniMeIrrevocableVestedTokenInstance {
  allocateSupply(...args: any[]): any;
  cap(...args: any[]): any;
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
  unpause(...args: any[]): any;
  wallet(...args: any[]): any;
  weiRaised(...args: any[]): any;
}

interface MiniMeIrrevocableVestedTokenInstance extends ContractInstance {
  grantVestedTokens(
    to: string,
    value: number,
    start: number,
    cliff: number,
    vesting: number
  ): never;
  tokenGrantsCount(holder: string): never;
  name(): never;
  approve(
    spender: string,
    amount: number,
    options?: TransactionOptions
  ): Promise<void>;
  spendableBalanceOf(
    address: string,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>;
  creationBlock(): never;
  totalSupply(): Promise<BigNumber.BigNumber>;
  setCanCreateGrants(addr: string, allowed: boolean): never;
  transferFrom(from: string, to: string, value: number): never;
  grants(string: number): never;
  decimals(): never;
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>;
  balanceOfAt(owner: string, blockNumber: number): never;
  version(): never;
  tokenGrant(holder: string, grantId: number): never;
  createCloneToken(
    cloneTokenName: string,
    cloneDecimalUnits: number,
    cloneTokenSymbol: string,
    snapshotBlock: number,
    transfersEnabled: boolean
  ): never;
  lastTokenIsTransferableDate(older: string): never;
  balanceOf(owner: Address): Promise<BigNumber.BigNumber>;
  parentToken(): never;
  generateTokens(owner: string, amount: number): never;
  symbol(): never;
  totalSupplyAt(blockNumber: number): never;
  transfer(
    to: string,
    value: number,
    options?: TransactionOptions
  ): Promise<boolean>;
  transfersEnabled(): never;
  parentSnapShotBlock(): never;
  approveAndCall(spender: string, amount: number, extraData: never): never; // extraData is BYTES. Not sure how to represent
  transferableTokens(older: string, time: number): never;
  destroyTokens(owner: string, amount: number): never;
  allowance(owner: string, spender: string): never;
  claimTokens(token: string): never;
  tokenFactory(): never;
  revokeTokenGrant(holder: string, grantId: number): never;
  enableTransfers(transfersEnabled: boolean): never;
  controller(): never;
  changeVestingWhitelister(newWhitelister: string): never;
}

interface MockSaleInstance extends BloomTokenSaleInstance {
  grantInstantlyVestedTokens(
    recipient: Address,
    amount: number,
    options?: TransactionOptions
  ): Promise<void>;
}
interface MockTokenInstance extends BloomInstance {
  canCreateGrants(subject: Address): any;
  addGranter(subject: Address): Promise<void>;
}

interface ConfigurableMockInstance extends ContractInstance, Ownable {
  count(...args: any[]): any;
  finishConfiguration(...args: any[]): any;
  increment(...args: any[]): any;
}

interface Artifacts {
  require(
    name: "MiniMeIrrevocableVestedToken"
  ): Contract<MiniMeIrrevocableVestedTokenInstance>;
  require(name: "BloomTokenSale"): Contract<BloomTokenSaleInstance>;
  require(name: "Bloom"): Contract<BloomInstance>;
  require(
    name: "./helpers/ConfigurableMock"
  ): Contract<ConfigurableMockInstance>;
  require(name: "./helpers/MockSale"): Contract<MockSaleInstance>;
  require(name: "./helpers/MockToken"): Contract<MockTokenInstance>;
}
