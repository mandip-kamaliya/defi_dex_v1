// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Exchange is ERC20, ReentrancyGuard {
    //state variable
    address immutable tokenaddress;
    address immutable factorycontract;

    //constructor
    constructor(address _tokenaddress) ERC20("UNI-V1", "UNI-V1") {
        require(_tokenaddress != address(0), "token address should not be empty");
        tokenaddress = _tokenaddress;
        factorycontract = msg.sender;
    }

    //event
    event AddedLiquidity(address indexed sender, uint256 ethamount, uint256 tokenamount);
    event RemovedLiquidity(address indexed reciever, uint256 ethamount, uint256 tokenamount);
    event tokenpurchaged(address indexed buyer, uint256 ethamount, uint256 tokenamount);
    event tokensold(address indexed seller, uint256 tokensold, uint256 ethrecieved);

    //contract function
    function gettokenreserve() public view returns (uint256) {
        return IERC20(tokenaddress).balanceOf(address(this));
    }

    //pricing functions
    function getamount(uint256 inputamount, uint256 inputreserve, uint256 outputreserve)
        public
        pure
        returns (uint256)
    {
        require(inputreserve > 0 && inputamount > 0, "invalid value provided!!");
        uint256 inputwithfee = inputamount * 997;
        uint256 numerator = (inputwithfee * outputreserve);
        uint256 denominator = ((inputreserve * 1000) + inputwithfee);
        return numerator / denominator;
    }

    function getEthfortokens(uint256 tokensSold) public view returns (uint256) {
        require(tokensSold > 0, "token amount should be more than zero");
        uint256 inputreserve = IERC20(tokenaddress).balanceOf(address(this));
        return getamount(tokensSold, inputreserve, address(this).balance);
    }

    function gettokenforEth(uint256 Ethsold) public view returns (uint256) {
        require(Ethsold > 0, "Eth amount should be more than zero");
        uint256 outputreserve = IERC20(tokenaddress).balanceOf((address(this)));
        return getamount(Ethsold, address(this).balance, outputreserve);
    }

    //liquidity functions

    function addliquidity(uint256 tokenadded) external payable nonReentrant returns (uint256) {
        require(msg.value > 0 && tokenadded > 0, "Invalid values provided");
        uint256 ethBalance = address(this).balance;
        uint256 tokenreserve = gettokenreserve();

        if (tokenreserve == 0) {
            require(IERC20(tokenaddress).balanceOf(msg.sender) >= tokenadded, "insufficient balance");
            IERC20(tokenaddress).transferFrom(msg.sender, address(this), tokenadded);
            uint256 liquidity = msg.value;
            _mint(msg.sender, liquidity);
            emit AddedLiquidity(msg.sender, msg.value, tokenadded);
            return liquidity;
        } else {
            uint256 liquidity = (msg.value * totalSupply()) / (ethBalance - msg.value);
            uint256 currentEthReserve = ethBalance - msg.value;
            uint256 expectedTokensRequired = (msg.value * tokenreserve) / currentEthReserve;
            require(tokenadded == expectedTokensRequired, "Disproportionate token amount for liquidity");

            require(IERC20(tokenaddress).balanceOf(msg.sender) >= tokenadded, "insufficient balance");
            IERC20(tokenaddress).transferFrom(msg.sender, address(this), tokenadded);
            _mint(msg.sender, liquidity);
            emit AddedLiquidity(msg.sender, msg.value, tokenadded);
            return liquidity;
        }
    }

    function removeliquidity(uint256 tokenamount) external nonReentrant returns (uint256, uint256) {
        require(tokenamount > 0, "token amount should be more than zero");
        require(totalSupply() > 0, "No liquidity in pool to remove");
        uint256 ethamount = (tokenamount * address(this).balance) / totalSupply();
        uint256 tokenvalue = (tokenamount * IERC20(tokenaddress).balanceOf(address(this))) / totalSupply();
        _burn(msg.sender, tokenamount);
        payable(msg.sender).transfer(ethamount);
        IERC20(tokenaddress).transfer(msg.sender, tokenvalue);
        emit RemovedLiquidity(msg.sender, ethamount, tokenvalue);
        return (ethamount, tokenvalue);
    }
    // Swap Functions

    function swapEthForTokens(uint256 minTokens, address recipient) external payable nonReentrant returns (uint256) {
        uint256 tokenAmount = gettokenforEth(msg.value);
        require(tokenAmount >= minTokens, "Token amount less than expected");

        IERC20(tokenaddress).transfer(recipient, tokenAmount);
        emit tokenpurchaged(msg.sender, msg.value, tokenAmount);

        return tokenAmount;
    }

    function tokenForEthSwap(uint256 tokensSold, uint256 minEth) external nonReentrant returns (uint256) {
        uint256 ethAmount = getEthfortokens(tokensSold);
        require(ethAmount >= minEth, "ETH amount less than expected");

        IERC20(tokenaddress).transferFrom(msg.sender, address(this), tokensSold);
        payable(msg.sender).transfer(ethAmount);
        emit tokensold(msg.sender, tokensSold, ethAmount);

        return ethAmount;
    }
}
