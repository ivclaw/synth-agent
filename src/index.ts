import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import * as dotenv from 'dotenv';
import { startPaymentServer } from './services/paymentServer';
import { getPortfolioInsights } from './services/veniceAI';
import { swapOnUniswap } from './services/dex';

dotenv.config();

const AGENT_ADDRESS = '0x87EF7e4e34F58df85125372f25e75f962557d2d5';

// Agent identity
const account = privateKeyToAccount(
  (process.env.PRIVATE_KEY || '0x704b6681485243abb073c7b919b075de86721d11da5d002f12501fc333e34166') as `0x${string}`
);

export const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

export const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

async function main() {
  console.log('⚡ SynthAgent starting up...');
  console.log(`Agent Address: ${account.address}`);

  // Check ETH balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Base ETH Balance: ${formatEther(balance)} ETH`);

  // Start x402 payment server
  await startPaymentServer();

  console.log('✅ SynthAgent is live and earning on Base!');
}

main().catch(console.error);
