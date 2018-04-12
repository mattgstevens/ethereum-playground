// # Source
// https://gist.github.com/izqui/7f904443e6d19c1ab52ec7f5ad46b3a8

// ## Description
// Any contract deployed for 66349 gas (90975 with ability to forward ownership)
// - at 30Gwei and Ξ800$USD => (30e-9 * 66349 * 800 ) ~= 1.60$USD
//
// This contract costs: 199398 gas to deploy, many others are quite expensive and should be

// ## References
// [Bytecode origin](https://www.reddit.com/r/ethereum/comments/6ic49q/any_assembly_programmers_willing_to_write_a/dj5ceuw)
// [Modified version of Vitalik's](https://www.reddit.com/r/ethereum/comments/6c1jui/delegatecall_forwarders_how_to_save_5098_on/)
// [Credits to Jordi Baylina for this way of deploying contracts](https://gist.github.com/jbaylina/e8ac19b8e7478fd10cf0363ad1a5a4b3)

// ## Details
// Forwarder is slightly modified to only return 256 bytes (8 normal returns)

// ## Example
// Deployed Factory in Kovan: https://kovan.etherscan.io/address/0xaebc118657099e2110c90494f48b3d21329b23eb
// Example of a Forwarder deploy using the Factory: https://kovan.etherscan.io/tx/0xe995dd023c8336685cb819313d933ae8938009f9c8c0e1af6c57b8be06986957

pragma solidity ^0.4.12;


contract ForwardFactory {

  event Deployed(address deployedAddress, address indexed templateContract);

  // Given the `template` address, a new contract of that type will be created
  function deploy(
    address template
  )
    public
    returns (address deployedContract)
  {
    bytes32 b1 = 0x602e600c600039602e6000f33660006000376101006000366000730000000000; // length 27 bytes = 1b
    bytes32 b2 = 0x5af41558576101006000f3000000000000000000000000000000000000000000; // length 11 bytes

    uint256 shiftedAddress = uint256(template) * ((2 ** 8) ** 12);   // Shift address 12 bytes to the left

    assembly {
      let contractCode := mload(0x40)                 // Find empty storage location using "free memory pointer"
      mstore(contractCode, b1)                        // We add the first part of the bytecode
      mstore(add(contractCode, 0x1b), shiftedAddress) // Add template address
      mstore(add(contractCode, 0x2f), b2)             // Final part of bytecode
      deployedContract := create(0, contractCode, 0x3A)    // total length 58 dec = 3a
      switch extcodesize(deployedContract) case 0 { invalid() }
    }
    Deployed(deployedContract, template);

    // testing that ownership can be transferred
    // alternative is figuring out how to send a bytes array into the contructor
    deployedContract.call(bytes4(keccak256("transferOwnership(address)")), msg.sender);
  }
}
