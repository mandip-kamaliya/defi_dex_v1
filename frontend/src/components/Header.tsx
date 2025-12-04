import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from './ui/button'
import { formatAddress } from '@/lib/utils'
import { Wallet, LogOut } from 'lucide-react'

const Header: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    const connector = connectors.find(c => c.name === 'MetaMask')
    if (connector) {
      connect({ connector })
    }
  }

  return (
    <header className="border-b border-secondary-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600"></div>
            <h1 className="text-xl font-bold text-slate-900">DeFi DEX</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected && address ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <p className="text-sm text-secondary-600">Connected</p>
                  <p className="text-sm font-medium text-slate-900">{formatAddress(address)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
