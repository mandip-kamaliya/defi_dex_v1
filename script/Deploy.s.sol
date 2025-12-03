// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Factory.sol";

contract DeployFactory is Script {
    function run() external {
        // Get the private key from the .env file
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the Factory contract
        Factory factory = new Factory();
        
        // Log the deployed contract address
        console.log("Factory deployed at:", address(factory));
        
        vm.stopBroadcast();
    }
}