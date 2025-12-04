import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Plus, Minus } from 'lucide-react'
import { EXCHANGE_ADDRESS, EXCHANGE_ABI, ERC20_ABI, TOKENS } from '@/lib/contracts'
import { formatBalance, parseAmount, getDeadline } from '@/lib/utils'

type TokenAddress = typeof TOKENS[keyof typeof TOKENS]

const PoolInterface: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [tokenA, setTokenA] = useState<TokenAddress>(TOKENS.WETH)
  const [tokenB, setTokenB] = useState<TokenAddress>(TOKENS.USDC)
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(true)
  const [isPending, setIsPending] = useState(false)

  // Read token balances
  const { data: balanceA } = useReadContract({
    address: tokenA as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: balanceB } = useReadContract({
    address: tokenB as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
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

  // Read pool info
  const { data: poolAddress } = useReadContract({
    address: EXCHANGE_ADDRESS as `0x${string}`,
    abi: EXCHANGE_ABI,
    functionName: 'getPool',
    args: [tokenA, tokenB],
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
    if (!isConnected || !address) return

    try {
      setIsPending(true)
      
      const amountABN = parseAmount(amountA)
      const amountBBN = parseAmount(amountB)
      const amountAMinBN = parseAmount((parseFloat(amountA) * 0.99).toString())
      const amountBMinBN = parseAmount((parseFloat(amountB) * 0.99).toString())
      
      await writeContract({
        address: EXCHANGE_ADDRESS as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'addLiquidity',
        args: [
          tokenA,
          tokenB,
          amountABN,
          amountBBN,
          amountAMinBN,
          amountBMinBN,
          address,
          BigInt(getDeadline())
        ],
      })
      
      setAmountA('')
      setAmountB('')
    } catch (error) {
      console.error('Add liquidity failed:', error)
    } finally {
      setIsPending(false)
    }
  }

  const handleCreatePool = async () => {
    if (!isConnected) return

    try {
      setIsPending(true)
      
      await writeContract({
        address: EXCHANGE_ADDRESS as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'createPool',
        args: [tokenA, tokenB],
      })
    } catch (error) {
      console.error('Create pool failed:', error)
    } finally {
      setIsPending(false)
    }
  }

  const handleSetMaxAmountA = () => {
    if (balanceA) {
      const formattedBalance = formatUnits(balanceA as bigint, 18)
      setAmountA(formattedBalance)
    }
  }

  const handleSetMaxAmountB = () => {
    if (balanceB) {
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
              {balanceA !== undefined && (
                <button
                  onClick={handleSetMaxAmountA}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Max: {formatBalance(balanceA as bigint)} {tokenAInfo || 'ETH'}
                </button>
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
                <option value={TOKENS.WETH}>WETH</option>
                <option value={TOKENS.USDC}>USDC</option>
                <option value={TOKENS.DAI}>DAI</option>
              </select>
            </div>
          </div>

          {/* Token B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Token B</label>
              {balanceB !== undefined && (
                <button
                  onClick={handleSetMaxAmountB}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Max: {formatBalance(balanceB as bigint)} {tokenBInfo || 'ETH'}
                </button>
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
                <option value={TOKENS.WETH}>WETH</option>
                <option value={TOKENS.USDC}>USDC</option>
                <option value={TOKENS.DAI}>DAI</option>
              </select>
            </div>
          </div>

          {/* Pool Status */}
          {poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000' && (
            <div className="p-3 bg-secondary-50 rounded-md">
              <p className="text-sm text-secondary-600">
                Pool exists at: {poolAddress}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!poolAddress || poolAddress === '0x0000000000000000000000000000000000000000' ? (
              <Button
                onClick={handleCreatePool}
                disabled={!isConnected || isPending}
                className="w-full"
              >
                {isPending ? 'Creating...' : !isConnected ? 'Connect Wallet' : 'Create Pool'}
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
