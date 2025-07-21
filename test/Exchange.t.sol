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

    function testRemoveLiquidity() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 10000 * 10 ** 18);
        vm.prank(owner);
        token.approve(address(exchange), 10000 * 10 ** 18);
        vm.prank(owner);
        uint256 tokensToAdd = 5000 * 10 ** 18;
        uint256 ethToAdd = 10 ether;
        uint256 liquidity = exchange.addliquidity{value: ethToAdd}(tokensToAdd);

        uint256 totalLiquidityTokens = liquidity;

        vm.prank(owner);
        (uint256 ethAmount, uint256 tokenAmount) = exchange.removeliquidity(totalLiquidityTokens);
        console.log(ethAmount, tokenAmount);

        assertTrue(ethAmount > 0 && tokenAmount > 0, "ETH and Tokens should be returned");
        assertEq(ethAmount, ethToAdd, "Incorrect ETH amount returned");
        assertEq(tokenAmount, tokensToAdd, "Incorrect Token amount returned");
    }

    function testSwapEthForTokens() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 10000 ether);
        vm.prank(owner);
        token.approve(address(exchange), 10000 ether);
        vm.prank(owner);
        exchange.addliquidity{value: 10 ether}(10000 ether);

        uint256 ethToSwap = 1 ether;
        uint256 minTokens = 1;
        address recipient = makeAddr("bob");
        vm.deal(recipient, ethToSwap);
        vm.prank(recipient);
        uint256 tokensReceived = exchange.swapEthForTokens{value: ethToSwap}(minTokens, recipient);

        assertTrue(tokensReceived >= minTokens, "Received less tokens than expected");
    }

    function testTokenForEthSwap() public {
        vm.prank(owner);
        vm.deal(owner, 10 ether);
        token.mint(owner, 10000 ether);
        vm.prank(owner);
        token.approve(address(exchange), 10000 ether);
        vm.prank(owner);
        exchange.addliquidity{value: 10 ether}(10000 ether);

        address bob = makeAddr("bob");
        vm.prank(owner);
        token.mint(bob, 1000 ether);
        vm.prank(bob);
        token.approve(address(exchange), 1000 ether);

        uint256 tokensToSwap = 500 ether;
        uint256 minEth = 1;
        vm.prank(bob);
        uint256 ethReceived = exchange.tokenForEthSwap(tokensToSwap, minEth);

        assertTrue(ethReceived >= minEth, "Received less ETH than expected");
    }
}
