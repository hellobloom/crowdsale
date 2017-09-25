import * as Web3 from "web3";
import * as BigNumber from "bignumber.js";

type Address = string;
type TransactionOptions = Partial<Transaction>;
type UInt = number | BigNumber.BigNumber;

interface Transaction {
  hash: string,
  nonce: number,
  blockHash: string | null,
  blockNumber: number | null,
  transactionIndex: number | null,
  from: Address | ContractInstance,
  to: string | null,
  value: UInt,
  gasPrice: UInt,
  gas: number,
  input: string
}

interface ContractInstance {
  address: string,
  sendTransaction(options?: TransactionOptions): Promise<void>
}

export interface ApproveAndCallFallBackInstance extends ContractInstance {
  receiveApproval(
    from: Address,
    amount: UInt,
    token: Address,
    data: string,
    options?: TransactionOptions
  ): Promise<void>
}

export interface BloomTokenSaleInstance extends ContractInstance {
  setToken(token: Address, options?: TransactionOptions): Promise<void>,
  rate(options?: TransactionOptions): Promise<UInt>,
  endTime(options?: TransactionOptions): Promise<UInt>,
  cap(options?: TransactionOptions): Promise<UInt>,
  unpause(options?: TransactionOptions): Promise<void>,
  weiRaised(options?: TransactionOptions): Promise<UInt>,
  onTransfer(
    from: Address,
    unnamed0: Address,
    unnamed1: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  finalize(options?: TransactionOptions): Promise<void>,
  wallet(options?: TransactionOptions): Promise<Address>,
  paused(options?: TransactionOptions): Promise<boolean>,
  finishConfiguration(options?: TransactionOptions): Promise<boolean>,
  startTime(options?: TransactionOptions): Promise<UInt>,
  setEtherPriceInCents(
    cents: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  pause(options?: TransactionOptions): Promise<void>,
  configured(options?: TransactionOptions): Promise<boolean>,
  isFinalized(options?: TransactionOptions): Promise<boolean>,
  owner(options?: TransactionOptions): Promise<Address>,
  TOTAL_SUPPLY(options?: TransactionOptions): Promise<UInt>,
  allocatePresaleTokens(
    receiver: Address,
    amount: UInt,
    cliffDate: UInt,
    vestingDate: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  changeTokenController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  onApprove(
    unnamed2: Address,
    unnamed3: Address,
    unnamed4: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allocateSupply(options?: TransactionOptions): Promise<void>,
  hasEnded(options?: TransactionOptions): Promise<boolean>,
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>,
  proxyPayment(
    beneficiary: Address,
    options?: TransactionOptions
  ): Promise<boolean>,
  token(options?: TransactionOptions): Promise<Address>
}

export interface BLTInstance extends ContractInstance {
  tokenGrantsCount(
    holder: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  name(options?: TransactionOptions): Promise<string>,
  approve(
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  spendableBalanceOf(
    holder: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  creationBlock(options?: TransactionOptions): Promise<UInt>,
  totalSupply(options?: TransactionOptions): Promise<UInt>,
  setCanCreateGrants(
    addr: Address,
    allowed: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  transferFrom(
    from: Address,
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  grants(
    unnamed5: Address,
    unnamed6: UInt,
    options?: TransactionOptions
  ): Promise<[Address, UInt, UInt, UInt, UInt, boolean, boolean]>,
  decimals(options?: TransactionOptions): Promise<UInt>,
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  balanceOfAt(
    owner: Address,
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<UInt>,
  version(options?: TransactionOptions): Promise<string>,
  tokenGrant(
    holder: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<[Address, UInt, UInt, UInt, UInt, UInt, boolean, boolean]>,
  createCloneToken(
    cloneTokenName: string,
    cloneDecimalUnits: UInt,
    cloneTokenSymbol: string,
    snapshotBlock: UInt,
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<Address>,
  lastTokenIsTransferableDate(
    holder: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  balanceOf(owner: Address, options?: TransactionOptions): Promise<UInt>,
  parentToken(options?: TransactionOptions): Promise<Address>,
  generateTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  symbol(options?: TransactionOptions): Promise<string>,
  grantVestedTokens(
    to: Address,
    value: UInt,
    start: UInt,
    cliff: UInt,
    vesting: UInt,
    revokable: boolean,
    burnsOnRevoke: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  totalSupplyAt(blockNumber: UInt, options?: TransactionOptions): Promise<UInt>,
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  transfersEnabled(options?: TransactionOptions): Promise<boolean>,
  parentSnapShotBlock(options?: TransactionOptions): Promise<UInt>,
  approveAndCall(
    spender: Address,
    amount: UInt,
    extraData: string,
    options?: TransactionOptions
  ): Promise<boolean>,
  transferableTokens(
    holder: Address,
    time: UInt,
    options?: TransactionOptions
  ): Promise<UInt>,
  destroyTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  claimTokens(token: Address, options?: TransactionOptions): Promise<void>,
  tokenFactory(options?: TransactionOptions): Promise<Address>,
  revokeTokenGrant(
    holder: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  enableTransfers(
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  controller(options?: TransactionOptions): Promise<Address>,
  changeVestingWhitelister(
    newWhitelister: Address,
    options?: TransactionOptions
  ): Promise<void>
}

export interface CappedCrowdsaleInstance extends ContractInstance {
  rate(options?: TransactionOptions): Promise<UInt>,
  endTime(options?: TransactionOptions): Promise<UInt>,
  cap(options?: TransactionOptions): Promise<UInt>,
  weiRaised(options?: TransactionOptions): Promise<UInt>,
  wallet(options?: TransactionOptions): Promise<Address>,
  startTime(options?: TransactionOptions): Promise<UInt>,
  hasEnded(options?: TransactionOptions): Promise<boolean>,
  proxyPayment(owner: Address, options?: TransactionOptions): Promise<boolean>
}

export interface ConfigurableInstance extends ContractInstance {
  finishConfiguration(options?: TransactionOptions): Promise<boolean>,
  configured(options?: TransactionOptions): Promise<boolean>,
  owner(options?: TransactionOptions): Promise<Address>,
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>
}

export interface ControlledInstance extends ContractInstance {
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  controller(options?: TransactionOptions): Promise<Address>
}

export interface CrowdsaleInstance extends ContractInstance {
  rate(options?: TransactionOptions): Promise<UInt>,
  endTime(options?: TransactionOptions): Promise<UInt>,
  weiRaised(options?: TransactionOptions): Promise<UInt>,
  wallet(options?: TransactionOptions): Promise<Address>,
  startTime(options?: TransactionOptions): Promise<UInt>,
  hasEnded(options?: TransactionOptions): Promise<boolean>,
  proxyPayment(owner: Address, options?: TransactionOptions): Promise<boolean>
}

export interface FinalizableCrowdsaleInstance extends ContractInstance {
  rate(options?: TransactionOptions): Promise<UInt>,
  endTime(options?: TransactionOptions): Promise<UInt>,
  weiRaised(options?: TransactionOptions): Promise<UInt>,
  finalize(options?: TransactionOptions): Promise<void>,
  wallet(options?: TransactionOptions): Promise<Address>,
  startTime(options?: TransactionOptions): Promise<UInt>,
  isFinalized(options?: TransactionOptions): Promise<boolean>,
  owner(options?: TransactionOptions): Promise<Address>,
  hasEnded(options?: TransactionOptions): Promise<boolean>,
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>,
  proxyPayment(owner: Address, options?: TransactionOptions): Promise<boolean>
}

export interface MathInstance extends ContractInstance {}

export interface MigrationsInstance extends ContractInstance {
  upgrade(new_address: Address, options?: TransactionOptions): Promise<void>,
  last_completed_migration(options?: TransactionOptions): Promise<UInt>,
  owner(options?: TransactionOptions): Promise<Address>,
  setCompleted(completed: UInt, options?: TransactionOptions): Promise<void>
}

export interface MiniMeTokenInstance extends ContractInstance {
  name(options?: TransactionOptions): Promise<string>,
  approve(
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  creationBlock(options?: TransactionOptions): Promise<UInt>,
  totalSupply(options?: TransactionOptions): Promise<UInt>,
  transferFrom(
    from: Address,
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  decimals(options?: TransactionOptions): Promise<UInt>,
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  balanceOfAt(
    owner: Address,
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<UInt>,
  version(options?: TransactionOptions): Promise<string>,
  createCloneToken(
    cloneTokenName: string,
    cloneDecimalUnits: UInt,
    cloneTokenSymbol: string,
    snapshotBlock: UInt,
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<Address>,
  balanceOf(owner: Address, options?: TransactionOptions): Promise<UInt>,
  parentToken(options?: TransactionOptions): Promise<Address>,
  generateTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  symbol(options?: TransactionOptions): Promise<string>,
  totalSupplyAt(blockNumber: UInt, options?: TransactionOptions): Promise<UInt>,
  transfer(
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  transfersEnabled(options?: TransactionOptions): Promise<boolean>,
  parentSnapShotBlock(options?: TransactionOptions): Promise<UInt>,
  approveAndCall(
    spender: Address,
    amount: UInt,
    extraData: string,
    options?: TransactionOptions
  ): Promise<boolean>,
  destroyTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  claimTokens(token: Address, options?: TransactionOptions): Promise<void>,
  tokenFactory(options?: TransactionOptions): Promise<Address>,
  enableTransfers(
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  controller(options?: TransactionOptions): Promise<Address>
}

export interface MiniMeTokenFactoryInstance extends ContractInstance {
  createCloneToken(
    parentToken: Address,
    snapshotBlock: UInt,
    tokenName: string,
    decimalUnits: UInt,
    tokenSymbol: string,
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<Address>
}

export interface MiniMeVestedTokenInstance extends ContractInstance {
  tokenGrantsCount(
    holder: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  name(options?: TransactionOptions): Promise<string>,
  approve(
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  spendableBalanceOf(
    holder: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  creationBlock(options?: TransactionOptions): Promise<UInt>,
  totalSupply(options?: TransactionOptions): Promise<UInt>,
  setCanCreateGrants(
    addr: Address,
    allowed: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  transferFrom(
    from: Address,
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  grants(
    unnamed7: Address,
    unnamed8: UInt,
    options?: TransactionOptions
  ): Promise<[Address, UInt, UInt, UInt, UInt, boolean, boolean]>,
  decimals(options?: TransactionOptions): Promise<UInt>,
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  balanceOfAt(
    owner: Address,
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<UInt>,
  version(options?: TransactionOptions): Promise<string>,
  tokenGrant(
    holder: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<[Address, UInt, UInt, UInt, UInt, UInt, boolean, boolean]>,
  createCloneToken(
    cloneTokenName: string,
    cloneDecimalUnits: UInt,
    cloneTokenSymbol: string,
    snapshotBlock: UInt,
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<Address>,
  lastTokenIsTransferableDate(
    holder: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  balanceOf(owner: Address, options?: TransactionOptions): Promise<UInt>,
  parentToken(options?: TransactionOptions): Promise<Address>,
  generateTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  symbol(options?: TransactionOptions): Promise<string>,
  grantVestedTokens(
    to: Address,
    value: UInt,
    start: UInt,
    cliff: UInt,
    vesting: UInt,
    revokable: boolean,
    burnsOnRevoke: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  totalSupplyAt(blockNumber: UInt, options?: TransactionOptions): Promise<UInt>,
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  transfersEnabled(options?: TransactionOptions): Promise<boolean>,
  parentSnapShotBlock(options?: TransactionOptions): Promise<UInt>,
  approveAndCall(
    spender: Address,
    amount: UInt,
    extraData: string,
    options?: TransactionOptions
  ): Promise<boolean>,
  transferableTokens(
    holder: Address,
    time: UInt,
    options?: TransactionOptions
  ): Promise<UInt>,
  destroyTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<UInt>,
  claimTokens(token: Address, options?: TransactionOptions): Promise<void>,
  tokenFactory(options?: TransactionOptions): Promise<Address>,
  revokeTokenGrant(
    holder: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  enableTransfers(
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<void>,
  controller(options?: TransactionOptions): Promise<Address>,
  changeVestingWhitelister(
    newWhitelister: Address,
    options?: TransactionOptions
  ): Promise<void>
}

export interface OwnableInstance extends ContractInstance {
  owner(options?: TransactionOptions): Promise<Address>,
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>
}

export interface PausableInstance extends ContractInstance {
  unpause(options?: TransactionOptions): Promise<void>,
  paused(options?: TransactionOptions): Promise<boolean>,
  pause(options?: TransactionOptions): Promise<void>,
  owner(options?: TransactionOptions): Promise<Address>,
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>
}

export interface SafeMathInstance extends ContractInstance {}

export interface TokenControllerInstance extends ContractInstance {
  onTransfer(
    from: Address,
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  onApprove(
    owner: Address,
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  proxyPayment(owner: Address, options?: TransactionOptions): Promise<boolean>
}
