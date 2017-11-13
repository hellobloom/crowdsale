pragma solidity 0.4.15;

import "zeppelin/math/SafeMath.sol";
import "./Crowdsale.sol";

/**
 * @title CappedCrowdsale
 * @dev Extension of Crowsdale with a max amount of funds raised
 *   Same as OpenZeppelin 1.3.0 CappedCrowdsale but duplicated in our
 *   source so that it imports our modified base Crowdsale contract
 */
contract CappedCrowdsale is Crowdsale {
  using SafeMath for uint256;

  uint256 public cap;

  function CappedCrowdsale(uint256 _cap) public {
    require(_cap > 0);
    cap = _cap;
  }

  // overriding Crowdsale#hasEnded to add cap logic
  // @return true if crowdsale event has ended
  function hasEnded() public constant returns (bool) {
    bool capReached = weiRaised >= cap;
    return super.hasEnded() || capReached;
  }

  // overriding Crowdsale#validPurchase to add extra cap logic
  // @return true if investors can buy at the moment
  function validPurchase() internal constant returns (bool) {
    bool withinCap = weiRaised.add(msg.value) <= cap;
    return super.validPurchase() && withinCap;
  }

}
