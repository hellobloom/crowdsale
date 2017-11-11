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
  advisorPool(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  setToken(token: Address, options?: TransactionOptions): Promise<void>,
  rate(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  endTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  revokeGrant(
    holder: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  cap(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  unpause(options?: TransactionOptions): Promise<void>,
  weiRaised(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  onTransfer(
    from: Address,
    to: Address,
    unnamed0: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  finalize(options?: TransactionOptions): Promise<void>,
  wallet(options?: TransactionOptions): Promise<Address>,
  paused(options?: TransactionOptions): Promise<boolean>,
  finishConfiguration(options?: TransactionOptions): Promise<boolean>,
  startTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  pause(options?: TransactionOptions): Promise<void>,
  configured(options?: TransactionOptions): Promise<boolean>,
  isFinalized(options?: TransactionOptions): Promise<boolean>,
  owner(options?: TransactionOptions): Promise<Address>,
  TOTAL_SUPPLY(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
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
    unnamed1: Address,
    unnamed2: Address,
    unnamed3: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allocateSupply(options?: TransactionOptions): Promise<void>,
  finishPresale(
    cents: UInt,
    weiRaisedOffChain: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allocateAdvisorTokens(
    receiver: Address,
    amount: UInt,
    cliffDate: UInt,
    vestingDate: UInt,
    options?: TransactionOptions
  ): Promise<void>,
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
  ): Promise<BigNumber.BigNumber>,
  name(options?: TransactionOptions): Promise<string>,
  approve(
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  spendableBalanceOf(
    holder: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  creationBlock(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  canCreateGrants(
    unnamed4: Address,
    options?: TransactionOptions
  ): Promise<boolean>,
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
  >,
  decimals(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  balanceOfAt(
    owner: Address,
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  version(options?: TransactionOptions): Promise<string>,
  tokenGrant(
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
  >,
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
  ): Promise<BigNumber.BigNumber>,
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
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
  totalSupplyAt(
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  revokeTokenGrant(
    holder: Address,
    receiver: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  transfersEnabled(options?: TransactionOptions): Promise<boolean>,
  parentSnapShotBlock(
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
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
  ): Promise<BigNumber.BigNumber>,
  destroyTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  claimTokens(token: Address, options?: TransactionOptions): Promise<void>,
  vestingWhitelister(options?: TransactionOptions): Promise<Address>,
  tokenFactory(options?: TransactionOptions): Promise<Address>,
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
  rate(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  endTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  cap(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  weiRaised(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  wallet(options?: TransactionOptions): Promise<Address>,
  startTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
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
  rate(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  endTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  weiRaised(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  wallet(options?: TransactionOptions): Promise<Address>,
  startTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  hasEnded(options?: TransactionOptions): Promise<boolean>,
  proxyPayment(owner: Address, options?: TransactionOptions): Promise<boolean>
}

export interface FinalizableCrowdsaleInstance extends ContractInstance {
  rate(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  endTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  weiRaised(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  finalize(options?: TransactionOptions): Promise<void>,
  wallet(options?: TransactionOptions): Promise<Address>,
  startTime(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
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
  upgrade(newAddress: Address, options?: TransactionOptions): Promise<void>,
  owner(options?: TransactionOptions): Promise<Address>,
  lastCompletedMigration(
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  setCompleted(completed: UInt, options?: TransactionOptions): Promise<void>
}

export interface MiniMeTokenInstance extends ContractInstance {
  name(options?: TransactionOptions): Promise<string>,
  approve(
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  creationBlock(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  transferFrom(
    from: Address,
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  decimals(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  balanceOfAt(
    owner: Address,
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  version(options?: TransactionOptions): Promise<string>,
  createCloneToken(
    cloneTokenName: string,
    cloneDecimalUnits: UInt,
    cloneTokenSymbol: string,
    snapshotBlock: UInt,
    transfersEnabled: boolean,
    options?: TransactionOptions
  ): Promise<Address>,
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  parentToken(options?: TransactionOptions): Promise<Address>,
  generateTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  symbol(options?: TransactionOptions): Promise<string>,
  totalSupplyAt(
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  transfer(
    to: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  transfersEnabled(options?: TransactionOptions): Promise<boolean>,
  parentSnapShotBlock(
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
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
  ): Promise<BigNumber.BigNumber>,
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
  ): Promise<BigNumber.BigNumber>,
  name(options?: TransactionOptions): Promise<string>,
  approve(
    spender: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  spendableBalanceOf(
    holder: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  creationBlock(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  totalSupply(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  canCreateGrants(
    unnamed7: Address,
    options?: TransactionOptions
  ): Promise<boolean>,
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
  >,
  decimals(options?: TransactionOptions): Promise<BigNumber.BigNumber>,
  changeController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  balanceOfAt(
    owner: Address,
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  version(options?: TransactionOptions): Promise<string>,
  tokenGrant(
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
  >,
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
  ): Promise<BigNumber.BigNumber>,
  balanceOf(
    owner: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
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
  totalSupplyAt(
    blockNumber: UInt,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  transfer(
    to: Address,
    value: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  revokeTokenGrant(
    holder: Address,
    receiver: Address,
    grantId: UInt,
    options?: TransactionOptions
  ): Promise<void>,
  transfersEnabled(options?: TransactionOptions): Promise<boolean>,
  parentSnapShotBlock(
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
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
  ): Promise<BigNumber.BigNumber>,
  destroyTokens(
    owner: Address,
    amount: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  allowance(
    owner: Address,
    spender: Address,
    options?: TransactionOptions
  ): Promise<BigNumber.BigNumber>,
  claimTokens(token: Address, options?: TransactionOptions): Promise<void>,
  vestingWhitelister(options?: TransactionOptions): Promise<Address>,
  tokenFactory(options?: TransactionOptions): Promise<Address>,
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

export interface PlaceholderControllerInstance extends ContractInstance {
  onTransfer(
    unnamed10: Address,
    unnamed11: Address,
    unnamed12: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  owner(options?: TransactionOptions): Promise<Address>,
  changeTokenController(
    newController: Address,
    options?: TransactionOptions
  ): Promise<void>,
  onApprove(
    unnamed13: Address,
    unnamed14: Address,
    unnamed15: UInt,
    options?: TransactionOptions
  ): Promise<boolean>,
  transferOwnership(
    newOwner: Address,
    options?: TransactionOptions
  ): Promise<void>,
  proxyPayment(
    unnamed16: Address,
    options?: TransactionOptions
  ): Promise<boolean>,
  token(options?: TransactionOptions): Promise<Address>
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
