import React, { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ArrowDownUp, Settings } from 'lucide-react'
import { EXCHANGE_ABI, ERC20_ABI, FACTORY_ADDRESS, FACTORY_ABI, TOKENS } from '@/lib/contracts'
import { formatBalance, parseAmount } from '@/lib/utils'

type TokenAddress = typeof TOKENS[keyof typeof TOKENS]

const SwapInterface: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [tokenIn, setTokenIn] = useState<TokenAddress>(TOKENS.ETH)
  const [tokenOut, setTokenOut] = useState<TokenAddress>(TOKENS.USDC)
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [isSwapping, setIsSwapping] = useState(false)

  // Get exchange address from factory for token pairs
  const { data: exchangeAddress, error: factoryError } = useReadContract({
    address: FACTORY_ADDRESS as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'getExchange',
    args: tokenIn !== TOKENS.ETH ? [tokenIn] : [tokenOut],
  })

  // Debug logging
  useEffect(() => {
    console.log('Token In:', tokenIn)
    console.log('Token Out:', tokenOut)
    console.log('Exchange Address:', exchangeAddress)
    console.log('Factory Error:', factoryError)
    console.log('Amount In:', amountIn)
  }, [tokenIn, tokenOut, exchangeAddress, factoryError, amountIn])

  // Read token balances (skip for native ETH)
  const { data: balanceIn } = useReadContract({
    address: tokenIn as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address && tokenIn !== TOKENS.ETH ? [address] : undefined,
  })

  const { data: balanceOut } = useReadContract({
    address: tokenOut as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address && tokenOut !== TOKENS.ETH ? [address] : undefined,
  })

  // Read ETH balance using wagmi's useBalance
  const { data: ethBalance } = useBalance({
    address: address,
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

  // Calculate output amount using contract pricing
  const { data: tokenAmount, error: pricingError } = useReadContract({
    address: exchangeAddress as `0x${string}`,
    abi: EXCHANGE_ABI,
    functionName: tokenIn === TOKENS.ETH ? 'gettokenforEth' : 'getEthfortokens',
    args: amountIn && parseAmount(amountIn) > 0n ? [parseAmount(amountIn)] : undefined,
    query: {
      enabled: !!amountIn && !!exchangeAddress && parseAmount(amountIn) > 0n,
      retry: false
    }
  })

  // Update amountOut when contract data changes
  useEffect(() => {
    if (tokenAmount) {
      const formattedAmount = formatUnits(tokenAmount as bigint, 18)
      setAmountOut(formattedAmount)
    } else if (!amountIn) {
      setAmountOut('')
    } else if (pricingError) {
      console.error('Pricing error:', pricingError)
      // Fallback to mock calculation for testing
      const mockAmount = (parseFloat(amountIn) * 0.99).toString()
      setAmountOut(mockAmount + ' (mock)')
    } else if (!exchangeAddress) {
      // No exchange exists - show mock pricing for testing
      const mockAmount = (parseFloat(amountIn) * 0.99).toString()
      setAmountOut(mockAmount + ' (mock - no exchange)')
    }
  }, [tokenAmount, amountIn, pricingError, exchangeAddress])

  const handleSwap = async () => {
    if (!isConnected || !address || !exchangeAddress) return

    try {
      setIsSwapping(true)
      
      const amountInBN = parseAmount(amountIn)
      const amountOutMinBN = parseAmount((parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toString())
      
      if (tokenIn === TOKENS.ETH) {
        // ETH -> Token swap
        await writeContract({
          address: exchangeAddress as `0x${string}`,
          abi: EXCHANGE_ABI,
          functionName: 'swapEthForTokens',
          args: [amountOutMinBN as any, address as any],
          value: amountInBN as any,
        })
      } else {
        // Token -> ETH swap
        await writeContract({
          address: exchangeAddress as `0x${string}`,
          abi: EXCHANGE_ABI,
          functionName: 'tokenForEthSwap',
          args: [amountInBN as any, amountOutMinBN as any],
        })
      }
      
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
    if (tokenIn === TOKENS.ETH && ethBalance) {
      const formattedBalance = formatUnits(ethBalance.value, ethBalance.decimals)
      setAmountIn(formattedBalance)
    } else if (balanceIn) {
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
            {tokenIn === TOKENS.ETH ? (
              ethBalance && (
                <button
                  onClick={handleSetMaxAmount}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Max: {formatBalance(ethBalance.value)} ETH
                </button>
              )
            ) : (
              balanceIn !== undefined && (
                <button
                  onClick={handleSetMaxAmount}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Max: {formatBalance(balanceIn as bigint)} {tokenInInfo || 'TOKEN'}
                </button>
              )
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
              <option value={TOKENS.ETH}>ETH</option>
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
            {tokenOut === TOKENS.ETH ? (
              ethBalance && (
                <span className="text-xs text-secondary-600">
                  Balance: {formatBalance(ethBalance.value)} ETH
                </span>
              )
            ) : (
              balanceOut !== undefined && (
                <span className="text-xs text-secondary-600">
                  Balance: {formatBalance(balanceOut as bigint)} {tokenOutInfo || 'TOKEN'}
                </span>
              )
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
              <option value={TOKENS.ETH}>ETH</option>
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
          disabled={!isConnected || !amountIn || parseFloat(amountIn) <= 0 || !exchangeAddress || isSwapping}
          className="w-full"
        >
          {isSwapping ? 'Swapping...' : !isConnected ? 'Connect Wallet' : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default SwapInterface
