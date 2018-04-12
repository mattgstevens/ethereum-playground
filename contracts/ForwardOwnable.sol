pragma solidity ^0.4.18;


/**
 * @title ForwardOwnable
 * @dev The ForwardOwnable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract ForwardOwnable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The ForwardOwnable constructor sets the original `owner` of the contract to the sender
   * account. When this has been deployed via ForwardFactory contract, it will always be "0x0".
   */
  function ForwardOwnable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner, or when owner hs not been set.
   */
  modifier onlyOwner() {
    require(msg.sender == owner || owner == address(0));
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}
