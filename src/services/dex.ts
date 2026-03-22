import { publicClient, walletClient } from '../index';
import { parseAbi, parseEther, formatEther } from 'viem';

// Uniswap V3 SwapRouter on Base
const SWAP_ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481' as const;
const WETH = '0x4200000000000000000000000000000000000006' as const;
const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

const swapRouterAbi = parseAbi([
  'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
]);

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string; // in ETH units
  slippageBps?: number; // basis points, default 50 (0.5%)
}

export async function swapOnUniswap(params: SwapParams): Promise<string> {
  const { tokenIn, tokenOut, amountIn, slippageBps = 50 } = params;

  console.log(`[DEX] Swapping ${amountIn} ${tokenIn} -> ${tokenOut} on Uniswap V3 (Base)`);

  const amountInWei = parseEther(amountIn);

  try {
    const hash = await walletClient.writeContract({
      address: SWAP_ROUTER,
      abi: swapRouterAbi,
      functionName: 'exactInputSingle',
      args: [
        {
          tokenIn: (tokenIn === 'ETH' ? WETH : tokenIn) as `0x${string}`,
          tokenOut: (tokenOut === 'USDC' ? USDC : tokenOut) as `0x${string}`,
          fee: 3000, // 0.3% pool
          recipient: walletClient.account.address,
          amountIn: amountInWei,
          amountOutMinimum: 0n, // In production: calculate with slippage
          sqrtPriceLimitX96: 0n,
        },
      ],
      value: tokenIn === 'ETH' ? amountInWei : 0n,
    });

    console.log(`[DEX] Swap tx: ${hash}`);
    return hash;
  } catch (error) {
    console.error('[DEX] Swap failed:', error);
    throw error;
  }
}

export async function getTokenPrice(tokenAddress: string): Promise<string> {
  // Simplified — in production: query Uniswap V3 pool or oracle
  console.log(`[DEX] Fetching price for ${tokenAddress}`);
  return 'Price oracle not yet integrated';
}
