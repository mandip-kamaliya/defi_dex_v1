// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Exchange.sol";
import "../src/Factory.sol";
import "../src/ERC20.sol";

contract factoryTest is Test {
    Factory public factory;
    MyToken public token;

    address tokenowner = makeAddr("owner");

    function setUp() external {
        factory = new Factory();
        token = new MyToken(tokenowner);
    }

    function testCreateExchangeContract() public {
        address ExchangeAddress = factory.createNewExchange(address(token));
        assertEq(factory.getExchange(address(token)), ExchangeAddress);
        assertTrue(ExchangeAddress != address(0), "Exchange address can not be empty");
    }
}
