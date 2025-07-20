// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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
    event AddedLiquidity(address indexed sender, uint256 ethamount, uint256 tokenamount,uint256 liquidity_token);
    event RemovedLiquidity(address indexed reciever, uint256 ethamount, uint256 tokenamount,uint256 liquidity_token);
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
        uint256 inputwithfee = inputreserve * 997;
        uint256 numerator = (inputwithfee * outputreserve);
        uint256 denominator = ((inputreserve * 1000) + inputwithfee);
        return numerator / denominator;
    }

    function getEthfortokens(uint256 tokensold) public view returns (uint256) {
        require(tokensold > 0, "token amount should be more than zero");
        uint256 inputreserve = IERC20(tokenaddress).balanceOf(address(this));
        return getamount(tokensold, inputreserve, address(this).balance);
    }

    function gettokenforEth(uint256 Ethsold) public view returns (uint256) {
        require(Ethsold > 0, "Eth amount should be more than zero");
        uint256 outputreserve = IERC20(tokenaddress).balanceOf((address(this)));
        return getamount(Ethsold, address(this).balance, outputreserve);
    }

    //liquidity functions

    function addliquidity(uint256 tokenadded) external payable nonReentrant returns (uint256) {
        uint256 ethBalance = address(this).balance;
        uint256 tokenreserve = gettokenreserve();

        if (tokenreserve == 0) {
            require(IERC20(tokenaddress).balanceOf(msg.sender) >= tokenadded, "insufficient balance");
            IERC20(tokenaddress).transferFrom(msg.sender, address(this), tokenadded);
            uint256 liquidity = ethBalance;
            _mint(msg.sender, liquidity);
            emit AddedLiquidity(msg.sender, msg.value, tokenadded);
            return liquidity;
        } else {
            uint256 liquidity = (msg.value * totalSupply()) / ethBalance;
            require(IERC20(tokenaddress).balanceOf(msg.sender) >= tokenadded, "insufficient balance");
            IERC20(tokenaddress).transferFrom(msg.sender, address(this), tokenadded);
            _mint(msg.sender, liquidity);
            emit AddedLiquidity(msg.sender, msg.value, tokenadded,tokenadded);
            return liquidity;
        }
    }

    function removeliquidity(uint256 tokenamount) external nonReentrant returns(uint256,uint256){
        require(tokenamount>0,"token amount should be more than zero");

        uint256 ethamount = (tokenamount * address(this).balance)/totalSupply();
        uint256 tokenvalue = (tokenamount * IERC20(tokenaddress).balanceOf(address(this)));
        _burn(msg.sender, tokenamount);
        payable(msg.sender).transfer(ethamount);
        IERC20(tokenaddress).transferFrom(address(this), msg.sender, tokenvalue);
        emit RemovedLiquidity(msg.sender, ethamount, tokenvalue,tokenamount);
        return (ethamount,tokenvalue);
    }
}
