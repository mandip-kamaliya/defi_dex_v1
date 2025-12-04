import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ArrowDownUp, Settings } from 'lucide-react'
import { EXCHANGE_ADDRESS, EXCHANGE_ABI, ERC20_ABI, TOKENS } from '@/lib/contracts'
import { formatBalance, parseAmount, getDeadline } from '@/lib/utils'

type TokenAddress = typeof TOKENS[keyof typeof TOKENS]

const SwapInterface: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [tokenIn, setTokenIn] = useState<TokenAddress>(TOKENS.WETH)
  const [tokenOut, setTokenOut] = useState<TokenAddress>(TOKENS.USDC)
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [isSwapping, setIsSwapping] = useState(false)

  // Read token balances
  const { data: balanceIn } = useReadContract({
    address: tokenIn as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: balanceOut } = useReadContract({
    address: tokenOut as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read token info
  const { data: tokenInInfo } = useReadContract({
    address: tokenIn as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
  })

  const { data: tokenOutInfo } = useReadContract({
    address: tokenOut as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
  })

  // Calculate output amount when input changes
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      // This is a simplified calculation - in a real app, you'd query the contract
      const amountInBN = parseAmount(amountIn)
      if (amountInBN > 0n) {
        // Mock calculation - replace with actual contract call
        setAmountOut((parseFloat(amountIn) * 0.99).toString())
      } else {
        setAmountOut('')
      }
    } else {
      setAmountOut('')
    }
  }, [amountIn, tokenIn, tokenOut])

  const handleSwap = async () => {
    if (!isConnected || !address) return

    try {
      setIsSwapping(true)
      
      const amountInBN = parseAmount(amountIn)
      const amountOutMinBN = parseAmount((parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toString())
      
      await writeContract({
        address: EXCHANGE_ADDRESS as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInBN as any,
          amountOutMinBN as any,
          [tokenIn, tokenOut] as any,
          address as any,
          BigInt(getDeadline()) as any
        ] as any,
      })
      
      setAmountIn('')
      setAmountOut('')
    } catch (error) {
      console.error('Swap failed:', error)
    } finally {
      setIsSwapping(false)
    }
  }

  const handleSwitchTokens = () => {
    setTokenIn(tokenOut as TokenAddress)
    setTokenOut(tokenIn as TokenAddress)
    setAmountIn(amountOut)
    setAmountOut(amountIn)
  }

  const handleSetMaxAmount = () => {
    if (balanceIn) {
      const formattedBalance = formatUnits(balanceIn as bigint, 18)
      setAmountIn(formattedBalance)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Swap</CardTitle>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token In */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">You pay</label>
            {balanceIn !== undefined && (
              <button
                onClick={handleSetMaxAmount}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Max: {formatBalance(balanceIn as bigint)} {tokenInInfo || 'ETH'}
              </button>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1"
            />
            <select
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value as TokenAddress)}
              className="px-3 py-2 border border-secondary-300 rounded-md bg-white text-sm"
            >
              <option value={TOKENS.WETH}>WETH</option>
              <option value={TOKENS.USDC}>USDC</option>
              <option value={TOKENS.DAI}>DAI</option>
            </select>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwitchTokens}
            className="rounded-full"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Token Out */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">You receive</label>
            {balanceOut !== undefined && (
              <span className="text-xs text-secondary-600">
                Balance: {formatBalance(balanceOut as bigint)} {tokenOutInfo || 'ETH'}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amountOut}
              readOnly
              className="flex-1 bg-secondary-50"
            />
            <select
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value as TokenAddress)}
              className="px-3 py-2 border border-secondary-300 rounded-md bg-white text-sm"
            >
              <option value={TOKENS.WETH}>WETH</option>
              <option value={TOKENS.USDC}>USDC</option>
              <option value={TOKENS.DAI}>DAI</option>
            </select>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Slippage Tolerance</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-20"
              step="0.1"
              min="0.1"
              max="50"
            />
            <span className="text-sm text-secondary-600 py-2">%</span>
          </div>
        </div>

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!isConnected || !amountIn || parseFloat(amountIn) <= 0 || isSwapping}
          className="w-full"
        >
          {isSwapping ? 'Swapping...' : !isConnected ? 'Connect Wallet' : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default SwapInterface
