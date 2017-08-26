pragma solidity ^0.4.5;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zeppelin-solidity/contracts/crowdsale/RefundableCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/CappedCrowdsale.sol";

contract HaloCoin is MintableToken {
}

contract HaloSale is RefundableCrowdsale, CappedCrowdsale, Pausable {
}
