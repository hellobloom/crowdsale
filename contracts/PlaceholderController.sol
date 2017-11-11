pragma solidity 0.4.15;

import "./MiniMeToken.sol";
import "./BLT.sol";
import "zeppelin/ownership/Ownable.sol";

/* Temporary controller for after sale */
contract PlaceholderController is TokenController, Ownable {
  BLT public token;

  function PlaceholderController(address _blt) public {
    token = BLT(_blt);
  }

  function changeTokenController(address _newController) public onlyOwner {
    token.changeController(_newController);
  }

  // No buying tokens
  function proxyPayment(address) public payable returns (bool) {
    require(msg.value == 0);
    return false;
  }

  function onTransfer(address, address, uint) public returns (bool) {
    return true;
  }

  function onApprove(address, address, uint) public returns (bool) {
    return true;
  }
}
