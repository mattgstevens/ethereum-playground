pragma solidity ^0.4.15;

import "./ForwardOwnable.sol";

contract SimpleStorage is ForwardOwnable {
  uint public count;

  event CountSet(uint _count);

  event Deployed(uint _blockNumber);

  function SimpleStorage() {
    Deployed(block.number);
  }

  function setCount(uint _count) {
    count = _count;
    CountSet(_count);
  }
}
