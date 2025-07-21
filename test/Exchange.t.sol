// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Exchange.sol";
import "../src/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExchangeTest is Test {
    Exchange public exchange;
    MyToken public token;

    address owner = makeAddr("alice");

    function setUp() public {
        vm.prank(owner);
        token = new MyToken(owner);
        address tokenAdddress = address(token);
        exchange = new Exchange(tokenAdddress);
    }

    function testAddLiquidity() public {
        vm.startPrank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 1000 * 10 ** 18);
        token.approve(address(exchange), 500 * 10 ** 18);
        uint256 tokenadded = (500 * 10 ** 18);
        uint256 ethAmount = 10 ether;
        uint256 liquidity = exchange.addliquidity{value: ethAmount}(tokenadded);
        console.log(liquidity);
        assertGt(liquidity, 0, "liquidity token not created");
        vm.stopPrank();
        uint256 contractTokenBalance = token.balanceOf(address(exchange));
        assertEq(contractTokenBalance, tokenadded, "Exchange token balance incorrect");
        assertEq(address(exchange).balance, ethAmount, "Exchange Eth balance incorrect");
    }
}
