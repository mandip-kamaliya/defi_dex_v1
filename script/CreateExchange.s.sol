// scripts/CreateExchange.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Factory.sol";

contract CreateExchangeScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        // Updated with correct checksum
        address factoryAddress = 0x9347d87Cf7E6b41A03b7dE1276CAE4d27dB6a3DA; // Your Factory address
        address tokenAddress = 0xaf0BCA0f7B036b305E24Ff5cad8f514F5a408E24; // Your Token address

        vm.startBroadcast(deployerPrivateKey);
        Factory factory = Factory(factoryAddress);
        address exchange = factory.createNewExchange(tokenAddress);
        console.log("Exchange created at:", exchange);
        vm.stopBroadcast();
    }
}
