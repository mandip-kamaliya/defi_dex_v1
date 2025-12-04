export const EXCHANGE_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Replace with your deployed contract address

export const EXCHANGE_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_tokenA", "type": "address"},
      {"internalType": "address", "name": "_tokenB", "type": "address"}
    ],
    "name": "createPool",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_tokenA", "type": "address"},
      {"internalType": "address", "name": "_tokenB", "type": "address"},
      {"internalType": "uint256", "name": "_amountADesired", "type": "uint256"},
      {"internalType": "uint256", "name": "_amountBDesired", "type": "uint256"},
      {"internalType": "uint256", "name": "_amountAMin", "type": "uint256"},
      {"internalType": "uint256", "name": "_amountBMin", "type": "uint256"},
      {"internalType": "address", "name": "_to", "type": "address"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"}
    ],
    "name": "addLiquidity",
    "outputs": [
      {"internalType": "uint256", "name": "amountA", "type": "uint256"},
      {"internalType": "uint256", "name": "amountB", "type": "uint256"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_tokenA", "type": "address"},
      {"internalType": "address", "name": "_tokenB", "type": "address"},
      {"internalType": "uint256", "name": "_amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "_amountOutMin", "type": "uint256"},
      {"internalType": "address[]", "name": "_path", "type": "address[]"},
      {"internalType": "address", "name": "_to", "type": "address"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"}
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_tokenA", "type": "address"},
      {"internalType": "address", "name": "_tokenB", "type": "address"}
    ],
    "name": "getPool",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_amountIn", "type": "uint256"},
      {"internalType": "uint256", "name": "_reserveIn", "type": "uint256"},
      {"internalType": "uint256", "name": "_reserveOut", "type": "uint256"}
    ],
    "name": "getAmountOut",
    "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  }
] as const

export const ERC20_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Sample token addresses (replace with your actual token addresses)
export const TOKENS = {
  WETH: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Hardhat default account
  USDC: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Hardhat account 2
  DAI: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Hardhat account 3
} as const
