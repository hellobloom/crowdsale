import * as Web3 from "web3";
import {
  BLTInstance,
  BloomTokenSaleInstance,
  MiniMeTokenInstance,
  MiniMeVestedTokenInstance,
  PlaceholderControllerInstance
} from "./contracts";

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

interface MockSaleInstance extends BloomTokenSaleInstance {
  grantInstantlyVestedTokens(
    recipient: Address,
    amount: number,
    options?: TransactionOptions
  ): Promise<void>;
}
interface MockTokenInstance extends BLTInstance {
  canCreateGrants(subject: Address): any;
  addGranter(subject: Address): Promise<void>;
}

interface ConfigurableMockInstance extends ContractInstance, Ownable {
  count(...args: any[]): any;
  finishConfiguration(...args: any[]): any;
  increment(...args: any[]): any;
  decrement(...args: any[]): any;
}

interface Artifacts {
  require(name: "MiniMeVestedToken"): Contract<MiniMeVestedTokenInstance>;
  require(name: "BloomTokenSale"): Contract<BloomTokenSaleInstance>;
  require(
    name: "PlaceholderController"
  ): Contract<PlaceholderControllerInstance>;
  require(name: "BLT"): Contract<BLTInstance>;
  require(
    name: "./helpers/ConfigurableMock"
  ): Contract<ConfigurableMockInstance>;
  require(name: "./helpers/MockSale"): Contract<MockSaleInstance>;
  require(name: "./helpers/MockToken"): Contract<MockTokenInstance>;
}
