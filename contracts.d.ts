import * as Web3 from "web3";
import * as BigNumber from "bignumber.js";

type Address = string;
type TransactionOptions = Partial<Transaction>;
type UInt = number | BigNumber.BigNumber;

interface Transaction {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: Address | ContractInstance;
  to: string | null;
  value: UInt;
  gasPrice: UInt;
  gas: number;
  input: string;
}

interface ContractInstance {
  address: string;
  sendTransaction(options?: TransactionOptions): Promise<void>;
}

export interface ApproveAndCallFallBackInstance extends ContractInstance {
  receiveApproval: {
    (
      from: Address,
      amount: UInt,
      token: Address,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      amount: UInt,
      token: Address,
      data: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface ApproveAndCallFallBackContract {
  new: () => Promise<ApproveAndCallFallBackInstance>;
  deployed(): Promise<ApproveAndCallFallBackInstance>;
  at(address: string): ApproveAndCallFallBackInstance;
}

export interface BloomTokenSaleInstance extends ContractInstance {
  advisorPool: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  setToken: {
    (token: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      token: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  rate: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  endTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  revokeGrant: {
    (holder: Address, grantId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  cap: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  unpause: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  weiRaised: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  onTransfer: {
    (
      from: Address,
      to: Address,
      unnamed0: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      unnamed0: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  finalize: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  wallet: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  paused: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  finishConfiguration: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  startTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  pause: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  configured: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  isFinalized: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  TOTAL_SUPPLY: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  allocatePresaleTokens: {
    (
      receiver: Address,
      amount: UInt,
      cliffDate: UInt,
      vestingDate: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      receiver: Address,
      amount: UInt,
      cliffDate: UInt,
      vestingDate: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  changeTokenController: {
    (newController: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newController: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  onApprove: {
    (
      unnamed1: Address,
      unnamed2: Address,
      unnamed3: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      unnamed1: Address,
      unnamed2: Address,
      unnamed3: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  allocateSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  finishPresale: {
    (
      cents: UInt,
      weiRaisedOffChain: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      cents: UInt,
      weiRaisedOffChain: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  allocateAdvisorTokens: {
    (
      receiver: Address,
      amount: UInt,
      cliffDate: UInt,
      vestingDate: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      receiver: Address,
      amount: UInt,
      cliffDate: UInt,
      vestingDate: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  hasEnded: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  proxyPayment: {
    (beneficiary: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(beneficiary: Address, options?: TransactionOptions): Promise<boolean>;
  };
  token: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
}

export interface BloomTokenSaleContract {
  new: (
    startTime: UInt,
    endTime: UInt,
    rate: UInt,
    wallet: Address,
    cap: UInt
  ) => Promise<BloomTokenSaleInstance>;
  deployed(): Promise<BloomTokenSaleInstance>;
  at(address: string): BloomTokenSaleInstance;
}

export interface BLTInstance extends ContractInstance {
  tokenGrantsCount: {
    (holder: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  approve: {
    (spender: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      spender: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  spendableBalanceOf: {
    (holder: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  creationBlock: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  canCreateGrants: {
    (unnamed4: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(unnamed4: Address, options?: TransactionOptions): Promise<boolean>;
  };
  setCanCreateGrants: {
    (addr: Address, allowed: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      addr: Address,
      allowed: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      value: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      value: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  grants: {
    (unnamed5: Address, unnamed6: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed5: Address,
      unnamed6: UInt,
      options?: TransactionOptions
    ): Promise<
      [
        Address,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        boolean,
        boolean
      ]
    >;
  };
  decimals: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  changeController: {
    (newController: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newController: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  balanceOfAt: {
    (owner: Address, blockNumber: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      blockNumber: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  version: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  tokenGrant: {
    (holder: Address, grantId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<
      [
        Address,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        boolean,
        boolean
      ]
    >;
  };
  createCloneToken: {
    (
      cloneTokenName: string,
      cloneDecimalUnits: UInt,
      cloneTokenSymbol: string,
      snapshotBlock: UInt,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      cloneTokenName: string,
      cloneDecimalUnits: UInt,
      cloneTokenSymbol: string,
      snapshotBlock: UInt,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Address>;
  };
  lastTokenIsTransferableDate: {
    (holder: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  parentToken: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  generateTokens: {
    (owner: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  grantVestedTokens: {
    (
      to: Address,
      value: UInt,
      start: UInt,
      cliff: UInt,
      vesting: UInt,
      revokable: boolean,
      burnsOnRevoke: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      to: Address,
      value: UInt,
      start: UInt,
      cliff: UInt,
      vesting: UInt,
      revokable: boolean,
      burnsOnRevoke: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupplyAt: {
    (blockNumber: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      blockNumber: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  transfer: {
    (to: Address, value: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      value: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  revokeTokenGrant: {
    (
      holder: Address,
      receiver: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      holder: Address,
      receiver: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transfersEnabled: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  parentSnapShotBlock: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  approveAndCall: {
    (
      spender: Address,
      amount: UInt,
      extraData: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      spender: Address,
      amount: UInt,
      extraData: string,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transferableTokens: {
    (holder: Address, time: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      time: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  destroyTokens: {
    (owner: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  allowance: {
    (owner: Address, spender: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      spender: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  claimTokens: {
    (token: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      token: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  vestingWhitelister: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  tokenFactory: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  enableTransfers: {
    (transfersEnabled: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  controller: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  changeVestingWhitelister: {
    (newWhitelister: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newWhitelister: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface BLTContract {
  new: (tokenFactory: Address) => Promise<BLTInstance>;
  deployed(): Promise<BLTInstance>;
  at(address: string): BLTInstance;
}

export interface CappedCrowdsaleInstance extends ContractInstance {
  rate: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  endTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  cap: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  weiRaised: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  wallet: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  startTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  hasEnded: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  proxyPayment: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(owner: Address, options?: TransactionOptions): Promise<boolean>;
  };
}

export interface CappedCrowdsaleContract {
  new: (cap: UInt) => Promise<CappedCrowdsaleInstance>;
  deployed(): Promise<CappedCrowdsaleInstance>;
  at(address: string): CappedCrowdsaleInstance;
}

export interface ConfigurableInstance extends ContractInstance {
  finishConfiguration: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  configured: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface ConfigurableContract {
  new: () => Promise<ConfigurableInstance>;
  deployed(): Promise<ConfigurableInstance>;
  at(address: string): ConfigurableInstance;
}

export interface ControlledInstance extends ContractInstance {
  changeController: {
    (newController: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newController: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  controller: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
}

export interface ControlledContract {
  new: () => Promise<ControlledInstance>;
  deployed(): Promise<ControlledInstance>;
  at(address: string): ControlledInstance;
}

export interface CrowdsaleInstance extends ContractInstance {
  rate: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  endTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  weiRaised: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  wallet: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  startTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  hasEnded: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  proxyPayment: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(owner: Address, options?: TransactionOptions): Promise<boolean>;
  };
}

export interface CrowdsaleContract {
  new: (
    startTime: UInt,
    endTime: UInt,
    rate: UInt,
    wallet: Address
  ) => Promise<CrowdsaleInstance>;
  deployed(): Promise<CrowdsaleInstance>;
  at(address: string): CrowdsaleInstance;
}

export interface FinalizableCrowdsaleInstance extends ContractInstance {
  rate: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  endTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  weiRaised: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  finalize: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  wallet: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  startTime: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  isFinalized: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  hasEnded: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  proxyPayment: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(owner: Address, options?: TransactionOptions): Promise<boolean>;
  };
}

export interface FinalizableCrowdsaleContract {
  new: () => Promise<FinalizableCrowdsaleInstance>;
  deployed(): Promise<FinalizableCrowdsaleInstance>;
  at(address: string): FinalizableCrowdsaleInstance;
}

export interface MathInstance extends ContractInstance {}

export interface MathContract {
  new: () => Promise<MathInstance>;
  deployed(): Promise<MathInstance>;
  at(address: string): MathInstance;
}

export interface MigrationsInstance extends ContractInstance {
  upgrade: {
    (newAddress: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newAddress: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  lastCompletedMigration: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  setCompleted: {
    (completed: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      completed: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface MigrationsContract {
  new: () => Promise<MigrationsInstance>;
  deployed(): Promise<MigrationsInstance>;
  at(address: string): MigrationsInstance;
}

export interface MiniMeTokenInstance extends ContractInstance {
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  approve: {
    (spender: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      spender: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  creationBlock: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  decimals: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  changeController: {
    (newController: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newController: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  balanceOfAt: {
    (owner: Address, blockNumber: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      blockNumber: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  version: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  createCloneToken: {
    (
      cloneTokenName: string,
      cloneDecimalUnits: UInt,
      cloneTokenSymbol: string,
      snapshotBlock: UInt,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      cloneTokenName: string,
      cloneDecimalUnits: UInt,
      cloneTokenSymbol: string,
      snapshotBlock: UInt,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Address>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  parentToken: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  generateTokens: {
    (owner: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  totalSupplyAt: {
    (blockNumber: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      blockNumber: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  transfer: {
    (to: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transfersEnabled: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  parentSnapShotBlock: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  approveAndCall: {
    (
      spender: Address,
      amount: UInt,
      extraData: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      spender: Address,
      amount: UInt,
      extraData: string,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  destroyTokens: {
    (owner: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  allowance: {
    (owner: Address, spender: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      spender: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  claimTokens: {
    (token: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      token: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  tokenFactory: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  enableTransfers: {
    (transfersEnabled: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  controller: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
}

export interface MiniMeTokenContract {
  new: (
    tokenFactory: Address,
    parentToken: Address,
    parentSnapShotBlock: UInt,
    tokenName: string,
    decimalUnits: UInt,
    tokenSymbol: string,
    transfersEnabled: boolean
  ) => Promise<MiniMeTokenInstance>;
  deployed(): Promise<MiniMeTokenInstance>;
  at(address: string): MiniMeTokenInstance;
}

export interface MiniMeTokenFactoryInstance extends ContractInstance {
  createCloneToken: {
    (
      parentToken: Address,
      snapshotBlock: UInt,
      tokenName: string,
      decimalUnits: UInt,
      tokenSymbol: string,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      parentToken: Address,
      snapshotBlock: UInt,
      tokenName: string,
      decimalUnits: UInt,
      tokenSymbol: string,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Address>;
  };
}

export interface MiniMeTokenFactoryContract {
  new: () => Promise<MiniMeTokenFactoryInstance>;
  deployed(): Promise<MiniMeTokenFactoryInstance>;
  at(address: string): MiniMeTokenFactoryInstance;
}

export interface MiniMeVestedTokenInstance extends ContractInstance {
  tokenGrantsCount: {
    (holder: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  name: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  approve: {
    (spender: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      spender: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  spendableBalanceOf: {
    (holder: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  creationBlock: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  totalSupply: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  canCreateGrants: {
    (unnamed7: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(unnamed7: Address, options?: TransactionOptions): Promise<boolean>;
  };
  setCanCreateGrants: {
    (addr: Address, allowed: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      addr: Address,
      allowed: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transferFrom: {
    (
      from: Address,
      to: Address,
      value: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      value: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  grants: {
    (unnamed8: Address, unnamed9: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      unnamed8: Address,
      unnamed9: UInt,
      options?: TransactionOptions
    ): Promise<
      [
        Address,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        boolean,
        boolean
      ]
    >;
  };
  decimals: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  changeController: {
    (newController: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newController: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  balanceOfAt: {
    (owner: Address, blockNumber: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      blockNumber: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  version: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  tokenGrant: {
    (holder: Address, grantId: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<
      [
        Address,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        BigNumber.BigNumber,
        boolean,
        boolean
      ]
    >;
  };
  createCloneToken: {
    (
      cloneTokenName: string,
      cloneDecimalUnits: UInt,
      cloneTokenSymbol: string,
      snapshotBlock: UInt,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      cloneTokenName: string,
      cloneDecimalUnits: UInt,
      cloneTokenSymbol: string,
      snapshotBlock: UInt,
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Address>;
  };
  lastTokenIsTransferableDate: {
    (holder: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  balanceOf: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  parentToken: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  generateTokens: {
    (owner: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  symbol: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<string>;
  };
  grantVestedTokens: {
    (
      to: Address,
      value: UInt,
      start: UInt,
      cliff: UInt,
      vesting: UInt,
      revokable: boolean,
      burnsOnRevoke: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      to: Address,
      value: UInt,
      start: UInt,
      cliff: UInt,
      vesting: UInt,
      revokable: boolean,
      burnsOnRevoke: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  totalSupplyAt: {
    (blockNumber: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      blockNumber: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  transfer: {
    (to: Address, value: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      to: Address,
      value: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  revokeTokenGrant: {
    (
      holder: Address,
      receiver: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      holder: Address,
      receiver: Address,
      grantId: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  transfersEnabled: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  parentSnapShotBlock: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<BigNumber.BigNumber>;
  };
  approveAndCall: {
    (
      spender: Address,
      amount: UInt,
      extraData: string,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      spender: Address,
      amount: UInt,
      extraData: string,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transferableTokens: {
    (holder: Address, time: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      holder: Address,
      time: UInt,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  destroyTokens: {
    (owner: Address, amount: UInt, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  allowance: {
    (owner: Address, spender: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      owner: Address,
      spender: Address,
      options?: TransactionOptions
    ): Promise<BigNumber.BigNumber>;
  };
  claimTokens: {
    (token: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      token: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  vestingWhitelister: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  tokenFactory: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  enableTransfers: {
    (transfersEnabled: boolean, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      transfersEnabled: boolean,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  controller: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  changeVestingWhitelister: {
    (newWhitelister: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newWhitelister: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface MiniMeVestedTokenContract {
  new: (
    tokenFactory: Address,
    parentToken: Address,
    parentSnapShotBlock: UInt,
    tokenName: string,
    decimalUnits: UInt,
    tokenSymbol: string,
    transfersEnabled: boolean
  ) => Promise<MiniMeVestedTokenInstance>;
  deployed(): Promise<MiniMeVestedTokenInstance>;
  at(address: string): MiniMeVestedTokenInstance;
}

export interface OwnableInstance extends ContractInstance {
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface OwnableContract {
  new: () => Promise<OwnableInstance>;
  deployed(): Promise<OwnableInstance>;
  at(address: string): OwnableInstance;
}

export interface PausableInstance extends ContractInstance {
  unpause: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  paused: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<boolean>;
  };
  pause: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
}

export interface PausableContract {
  new: () => Promise<PausableInstance>;
  deployed(): Promise<PausableInstance>;
  at(address: string): PausableInstance;
}

export interface PlaceholderControllerInstance extends ContractInstance {
  onTransfer: {
    (
      unnamed10: Address,
      unnamed11: Address,
      unnamed12: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      unnamed10: Address,
      unnamed11: Address,
      unnamed12: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  owner: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
  changeTokenController: {
    (newController: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newController: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  onApprove: {
    (
      unnamed13: Address,
      unnamed14: Address,
      unnamed15: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      unnamed13: Address,
      unnamed14: Address,
      unnamed15: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  transferOwnership: {
    (newOwner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(
      newOwner: Address,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
  };
  proxyPayment: {
    (unnamed16: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(unnamed16: Address, options?: TransactionOptions): Promise<boolean>;
  };
  token: {
    (options?: TransactionOptions): Promise<Web3.TransactionReceipt>;
    call(options?: TransactionOptions): Promise<Address>;
  };
}

export interface PlaceholderControllerContract {
  new: (blt: Address) => Promise<PlaceholderControllerInstance>;
  deployed(): Promise<PlaceholderControllerInstance>;
  at(address: string): PlaceholderControllerInstance;
}

export interface SafeMathInstance extends ContractInstance {}

export interface SafeMathContract {
  new: () => Promise<SafeMathInstance>;
  deployed(): Promise<SafeMathInstance>;
  at(address: string): SafeMathInstance;
}

export interface TokenControllerInstance extends ContractInstance {
  onTransfer: {
    (
      from: Address,
      to: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      from: Address,
      to: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  onApprove: {
    (
      owner: Address,
      spender: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<Web3.TransactionReceipt>;
    call(
      owner: Address,
      spender: Address,
      amount: UInt,
      options?: TransactionOptions
    ): Promise<boolean>;
  };
  proxyPayment: {
    (owner: Address, options?: TransactionOptions): Promise<
      Web3.TransactionReceipt
    >;
    call(owner: Address, options?: TransactionOptions): Promise<boolean>;
  };
}

export interface TokenControllerContract {
  new: () => Promise<TokenControllerInstance>;
  deployed(): Promise<TokenControllerInstance>;
  at(address: string): TokenControllerInstance;
}
