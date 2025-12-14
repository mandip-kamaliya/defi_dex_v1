import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Plus, Minus } from 'lucide-react'
import { EXCHANGE_ADDRESS, EXCHANGE_ABI, ERC20_ABI, FACTORY_ADDRESS, FACTORY_ABI, TOKENS } from '@/lib/contracts'
import { formatBalance, parseAmount, getDeadline } from '@/lib/utils'

type TokenAddress = typeof TOKENS[keyof typeof TOKENS]

const PoolInterface: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [tokenA, setTokenA] = useState<TokenAddress>(TOKENS.ETH)
  const [tokenB, setTokenB] = useState<TokenAddress>(TOKENS.USDC)
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(true)
  const [isPending, setIsPending] = useState(false)

  // Get exchange address from factory
  const { data: exchangeAddress } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'getExchange',
    args: tokenA !== TOKENS.ETH ? [tokenA] : [tokenB],
  })

  // Read token balances (skip for native ETH)
  const { data: balanceA } = useReadContract({
    address: tokenA as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address && tokenA !== TOKENS.ETH ? [address] : undefined,
  })

  const { data: balanceB } = useReadContract({
    address: tokenB as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address && tokenB !== TOKENS.ETH ? [address] : undefined,
  })

  // Read ETH balance using wagmi's useBalance
  const { data: ethBalance } = useBalance({
    address: address,
  })

  // Read token info
  const { data: tokenAInfo } = useReadContract({
    address: tokenA as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
  })

  const { data: tokenBInfo } = useReadContract({
    address: tokenB as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
  })

  // Calculate required amounts when one amount changes
  useEffect(() => {
    if (amountA && tokenA && tokenB) {
      // Mock calculation - in a real app, you'd query the contract for reserves
      const amountABN = parseAmount(amountA)
      if (amountABN > 0n) {
        // Simplified 1:1 ratio - replace with actual pool ratio
        setAmountB(amountA)
      } else {
        setAmountB('')
      }
    } else {
      setAmountB('')
    }
  }, [amountA, tokenA, tokenB])

  const handleAddLiquidity = async () => {
    if (!isConnected || !address || !exchangeAddress) return

    try {
      setIsPending(true)
      
      if (tokenA === TOKENS.ETH) {
        // ETH + Token liquidity
        const amountTokenBN = parseAmount(amountB)
        const amountEthBN = parseAmount(amountA)
        
        await writeContract({
          address: exchangeAddress as `0x${string}`,
          abi: EXCHANGE_ABI,
          functionName: 'addliquidity',
          args: [amountTokenBN as any],
          value: amountEthBN as any,
        })
      } else if (tokenB === TOKENS.ETH) {
        // Token + ETH liquidity
        const amountTokenBN = parseAmount(amountA)
        const amountEthBN = parseAmount(amountB)
        
        await writeContract({
          address: exchangeAddress as `0x${string}`,
          abi: EXCHANGE_ABI,
          functionName: 'addliquidity',
          args: [amountTokenBN as any],
          value: amountEthBN as any,
        })
      }
      
      setAmountA('')
      setAmountB('')
    } catch (error) {
      console.error('Add liquidity failed:', error)
    } finally {
      setIsPending(false)
    }
  }

  const handleCreateExchange = async () => {
    if (!isConnected) return

    try {
      setIsPending(true)
      
      const tokenAddress = tokenA !== TOKENS.ETH ? tokenA : tokenB
      
      await writeContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'createNewExchange',
        args: [tokenAddress],
      })
    } catch (error) {
      console.error('Create exchange failed:', error)
    } finally {
      setIsPending(false)
    }
  }

  const handleSetMaxAmountA = () => {
    if (tokenA === TOKENS.ETH && ethBalance) {
      const formattedBalance = formatUnits(ethBalance.value, ethBalance.decimals)
      setAmountA(formattedBalance)
    } else if (balanceA) {
      const formattedBalance = formatUnits(balanceA as bigint, 18)
      setAmountA(formattedBalance)
    }
  }

  const handleSetMaxAmountB = () => {
    if (tokenB === TOKENS.ETH && ethBalance) {
      const formattedBalance = formatUnits(ethBalance.value, ethBalance.decimals)
      setAmountB(formattedBalance)
    } else if (balanceB) {
      const formattedBalance = formatUnits(balanceB as bigint, 18)
      setAmountB(formattedBalance)
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Toggle */}
      <div className="flex space-x-2">
        <Button
          variant={isAddingLiquidity ? "default" : "outline"}
          onClick={() => setIsAddingLiquidity(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Liquidity</span>
        </Button>
        <Button
          variant={!isAddingLiquidity ? "default" : "outline"}
          onClick={() => setIsAddingLiquidity(false)}
          className="flex items-center space-x-2"
        >
          <Minus className="h-4 w-4" />
          <span>Remove Liquidity</span>
        </Button>
      </div>

      {/* Liquidity Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isAddingLiquidity ? 'Add Liquidity' : 'Remove Liquidity'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Token A</label>
              {tokenA === TOKENS.ETH ? (
                ethBalance && (
                  <button
                    onClick={handleSetMaxAmountA}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Max: {formatBalance(ethBalance.value)} ETH
                  </button>
                )
              ) : (
                balanceA !== undefined && (
                  <button
                    onClick={handleSetMaxAmountA}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Max: {formatBalance(balanceA as bigint)} {tokenAInfo || 'TOKEN'}
                  </button>
                )
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="flex-1"
              />
              <select
                value={tokenA}
                onChange={(e) => setTokenA(e.target.value as TokenAddress)}
                className="px-3 py-2 border border-secondary-300 rounded-md bg-white text-sm"
              >
                <option value={TOKENS.ETH}>ETH</option>
                <option value={TOKENS.USDC}>USDC</option>
                <option value={TOKENS.DAI}>DAI</option>
              </select>
            </div>
          </div>

          {/* Token B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Token B</label>
              {tokenB === TOKENS.ETH ? (
                ethBalance && (
                  <button
                    onClick={handleSetMaxAmountB}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Max: {formatBalance(ethBalance.value)} ETH
                  </button>
                )
              ) : (
                balanceB !== undefined && (
                  <button
                    onClick={handleSetMaxAmountB}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Max: {formatBalance(balanceB as bigint)} {tokenBInfo || 'TOKEN'}
                  </button>
                )
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="flex-1"
              />
              <select
                value={tokenB}
                onChange={(e) => setTokenB(e.target.value as TokenAddress)}
                className="px-3 py-2 border border-secondary-300 rounded-md bg-white text-sm"
              >
                <option value={TOKENS.ETH}>ETH</option>
                <option value={TOKENS.USDC}>USDC</option>
                <option value={TOKENS.DAI}>DAI</option>
              </select>
            </div>
          </div>

          {/* Exchange Status */}
          {exchangeAddress && exchangeAddress !== '0x0000000000000000000000000000000000000000' && (
            <div className="p-3 bg-secondary-50 rounded-md">
              <p className="text-sm text-secondary-600">
                Exchange exists at: {exchangeAddress}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!exchangeAddress || exchangeAddress === '0x0000000000000000000000000000000000000000' ? (
              <Button
                onClick={handleCreateExchange}
                disabled={!isConnected || isPending}
                className="w-full"
              >
                {isPending ? 'Creating...' : !isConnected ? 'Connect Wallet' : 'Create Exchange'}
              </Button>
            ) : (
              <Button
                onClick={handleAddLiquidity}
                disabled={!isConnected || !amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0 || isPending}
                className="w-full"
              >
                {isPending ? 'Processing...' : !isConnected ? 'Connect Wallet' : 'Add Liquidity'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your Liquidity Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Liquidity Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-secondary-600">
            <p>No liquidity positions found</p>
            <p className="text-sm mt-2">Add liquidity to create a position</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PoolInterface
