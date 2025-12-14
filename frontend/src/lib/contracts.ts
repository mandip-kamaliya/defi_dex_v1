export const EXCHANGE_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Replace with your deployed contract address
export const FACTORY_ADDRESS = '0xE2fa192e962C41B2895F4F3c8865bF045dC07A57' // Deployed Factory address on Sepolia

export const EXCHANGE_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "minTokens", "type": "uint256"},
      {"internalType": "address", "name": "recipient", "type": "address"}
    ],
    "name": "swapEthForTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokensSold", "type": "uint256"},
      {"internalType": "uint256", "name": "minEth", "type": "uint256"}
    ],
    "name": "tokenForEthSwap",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenadded", "type": "uint256"}
    ],
    "name": "addliquidity",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenamount", "type": "uint256"}
    ],
    "name": "removeliquidity",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"},
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gettokenreserve",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "inputamount", "type": "uint256"},
      {"internalType": "uint256", "name": "inputreserve", "type": "uint256"},
      {"internalType": "uint256", "name": "outputreserve", "type": "uint256"}
    ],
    "name": "getamount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokensSold", "type": "uint256"}
    ],
    "name": "getEthfortokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "Ethsold", "type": "uint256"}
    ],
    "name": "gettokenforEth",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_tokenAddress", "type": "address"}
    ],
    "name": "createNewExchange",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_tokenAddress", "type": "address"}
    ],
    "name": "getExchange",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
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

// Token addresses for your DEX
export const TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000', // Native ETH
  USDC: '0xbE47c51b571685d6B85dd6AaEb23E89403297a92', // Deployed MyToken on Sepolia
  DAI: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Replace with another deployed ERC20 token
} as const
