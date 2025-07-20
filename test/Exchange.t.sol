// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Exchange.sol";
import "../src/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockERC20 is ERC20, Ownable {
    constructor() ERC20("MockToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

contract ExchangeTest is Test {
    Exchange public exchange;
    MockERC20 public mockToken;

    function setUp() public {
        mockToken = new MockERC20();

        exchange = new Exchange(address(mockToken));
    }

    function testPlaceholder() public {
        assertTrue(true, "Placeholder test should always pass.");
    }
}
