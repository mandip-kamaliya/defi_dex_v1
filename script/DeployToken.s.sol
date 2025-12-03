// scripts/DeployToken.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/ERC20.sol";

contract DeployToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);
        MyToken token = new MyToken(deployerAddress);
        console.log("Token deployed at:", address(token));
        vm.stopBroadcast();
    }
}