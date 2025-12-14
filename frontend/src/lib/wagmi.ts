import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = 'YOUR_PROJECT_ID' // Replace with your WalletConnect project ID

export const config = createConfig({
  chains: [hardhat, sepolia, mainnet],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'DeFi DEX',
        description: 'Decentralized Exchange',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://yourapp.com/icon.png']
      }
    }),
    metaMask(),
  ],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http('https://eth-sepolia-testnet.api.pocket.network'),
    [mainnet.id]: http(),
  },
})
