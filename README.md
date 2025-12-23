# Uniswap V1-Style DEX

A decentralized exchange that allows swapping between ETH and ERC20 tokens, inspired by Uniswap V1.

## Architecture

### Smart Contracts

- **Factory.sol**: Creates exchange contracts for each ERC20 token
- **Exchange.sol**: Handles ETH/Token swaps and liquidity provision
- **ERC20.sol**: Sample ERC20 token for testing

### Frontend

React + TypeScript frontend using:
- Wagmi for wallet connection
- Viem for contract interactions
- Tailwind CSS for styling


## Setup Instructions

### 1. Prerequisites

Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Deploy Contracts

Start a local node:
```bash
anvil
```

Deploy the Factory contract:
```bash
forge script script/Deploy.s.sol:DeployFactory --rpc-url http://localhost:8545 --private-key <private-key> --broadcast
```

Deploy a test token:
```bash
forge script script/DeployToken.s.sol:DeployToken --rpc-url http://localhost:8545 --private-key <private-key> --broadcast
```

Create an exchange for the token:
```bash
cast send <FACTORY_ADDRESS> "createNewExchange(address)" <TOKEN_ADDRESS> --rpc-url http://localhost:8545 --private-key <private-key>
```

### 3. Configure Frontend

Update contract addresses in `frontend/src/lib/contracts.ts`:
```typescript
export const FACTORY_ADDRESS = '<YOUR_FACTORY_ADDRESS>'
export const TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDC: '<YOUR_DEPLOYED_TOKEN_ADDRESS>',
  DAI: '<ANOTHER_TOKEN_ADDRESS>',
}
```

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Connect Wallet

1. Install MetaMask
2. Add local network: Network Name: "Localhost 8545", RPC URL: "http://localhost:8545", Chain ID: "31337"


## Features

### Swapping
- **ETH → Token**: Send ETH to receive ERC20 tokens
- **Token → ETH**: Send ERC20 tokens to receive ETH
- 0.3% fee on all swaps
- Slippage protection

### Liquidity
- **Add Liquidity**: Provide ETH and tokens to earn fees
- **Remove Liquidity**: Withdraw ETH and tokens
- Receive LP tokens representing your share

## Contract Functions

### Exchange.sol
- `swapEthForTokens(uint256 minTokens, address recipient)`: Swap ETH for tokens
- `tokenForEthSwap(uint256 tokensSold, uint256 minEth)`: Swap tokens for ETH
- `addliquidity(uint256 tokenadded)`: Add liquidity (payable)
- `removeliquidity(uint256 tokenamount)`: Remove liquidity
- `gettokenreserve()`: Get token reserve amount
- `getamount()`: Calculate output amount with fees
- `getEthfortokens()`: Get ETH amount for tokens
- `gettokenforEth()`: Get token amount for ETH

### Factory.sol
- `createNewExchange(address tokenAddress)`: Create new exchange
- `getExchange(address tokenAddress)`: Get exchange address for token

## Testing

Run contract tests:
```bash
forge test
```

## Security Notes

- Contracts use ReentrancyGuard
- Proper access controls in place
- Slippage protection in frontend
- Always verify contract addresses before interacting

## Next Steps

1. Deploy to a testnet (Sepolia/Goerli)
2. Add more token pairs
3. Implement price charts
4. Add transaction history
5. Implement limit orders
