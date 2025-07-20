// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Exchange is ERC20,ReentrancyGuard {
    
    //state variable
    address immutable tokenaddress;
    address immutable factorycontract;

    //constructor
    constructor(address _tokenaddress) ERC20("UNI-V1","UNI-V1"){
        require(_tokenaddress != address(0),"token address should not be empty");
        tokenaddress=_tokenaddress;
        factorycontract=msg.sender;
    }

    //event
    event AddLiquidity(address indexed sender,uint256 ethamount,uint256 tokenamount);
    event RemoveLiquidity(address indexed reciever,uint256 ethamount,uint256 tokenamount);
    event tokenpurchaged(address indexed buyer,uint256 ethamount,uint256 tokenamount);
    event tokensold(address indexed seller,uint256 tokensold,uint256 ethrecieved);

    //contract function
    function gettokenreserve() public view returns(uint256){
        return IERC20(tokenaddress).balanceOf(address(this));
    }

    //pricing functions
    function getamount(uint256 inputamount,uint256 inputreserve,uint256 outputreserve) public view returns(uint256){
            require(inputreserve>0 && inputamount>0,"invalid value provided!!");
            uint256 inputwithfee = inputreserve * 997 ; 
            uint256 numerator = (inputwithfee * outputreserve);
            uint256 denominator = ((inputreserve * 1000) + inputwithfee);
            return numerator/denominator;
    }

    function getEthfortokens(uint256 tokensold) public view returns(uint256)  {
        require(tokensold>0,"token amount should be more than zero");
        uint256 inputreserve=IERC20(tokenaddress).balanceOf(address(this));
        return  getamount(tokensold, inputreserve, address(this).balance);
    }

    function gettokenforEth(uint256 Ethsold) public view returns(uint256){
        require(Ethsold>0,"Eth amount should be more than zero");
        uint256 outputreserve = IERC20(tokenaddress).balanceOf((address(this)));
        return  getamount(Ethsold, address(this).balance, outputreserve);
    }

}
