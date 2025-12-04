import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './lib/wagmi'
import Header from './components/Header'
import SwapInterface from './components/SwapInterface'
import PoolInterface from './components/PoolInterface'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-4xl font-bold text-slate-900">DeFi DEX</h1>
                <p className="text-slate-600">Decentralized Exchange for Token Swaps and Liquidity</p>
              </div>
              
              <div className="space-y-6">
                <SwapInterface />
                <PoolInterface />
              </div>
            </div>
          </main>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
