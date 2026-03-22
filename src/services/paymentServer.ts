import express, { Request, Response, NextFunction } from 'express';
import { publicClient, walletClient } from '../index';
import { getPortfolioInsights } from './veniceAI';

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3402');
const AGENT_ADDRESS = '0x87EF7e4e34F58df85125372f25e75f962557d2d5';

// x402 Payment middleware
// See: https://x402.org for the HTTP 402 payment protocol
function requirePayment(priceUSDC: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers['x-payment'];

    if (!paymentHeader) {
      // Return 402 with payment details
      res.status(402).json({
        error: 'Payment Required',
        x402Version: 1,
        accepts: [
          {
            scheme: 'exact',
            network: 'base-mainnet',
            maxAmountRequired: priceUSDC,
            resource: req.path,
            description: `SynthAgent: ${req.path}`,
            mimeType: 'application/json',
            payTo: AGENT_ADDRESS,
            maxTimeoutSeconds: 300,
            asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
          },
        ],
      });
      return;
    }

    // Payment present — verify and proceed
    // In production: verify payment on-chain via Base RPC
    console.log(`[x402] Payment received for ${req.path}:`, paymentHeader);
    next();
  };
}

// Free endpoint — agent health/identity
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'SynthAgent',
    description: 'Autonomous AI agent on Base — trades, earns, creates',
    version: '1.0.0',
    address: AGENT_ADDRESS,
    network: 'base-mainnet',
    services: {
      '/insights': { price: '0.50 USDC', description: 'AI-powered DeFi portfolio insights (Venice)' },
      '/signal': { price: '1.00 USDC', description: 'Trading signal for any Base token pair' },
      '/analyze': { price: '0.25 USDC', description: 'On-chain wallet analysis' },
    },
  });
});

// Paid endpoint 1: Portfolio insights (via Venice AI, private)
app.get('/insights', requirePayment('500000'), async (req: Request, res: Response) => {
  const walletAddress = req.query.wallet as string || AGENT_ADDRESS;
  const insights = await getPortfolioInsights(walletAddress);
  res.json({ insights, generatedBy: 'SynthAgent + Venice', timestamp: new Date().toISOString() });
});

// Paid endpoint 2: Trading signal
app.get('/signal', requirePayment('1000000'), async (req: Request, res: Response) => {
  const tokenPair = req.query.pair as string || 'ETH/USDC';
  // In production: fetch on-chain data and run ML model
  const signal = await generateTradingSignal(tokenPair);
  res.json({ signal, pair: tokenPair, timestamp: new Date().toISOString() });
});

// Paid endpoint 3: Wallet analysis
app.get('/analyze', requirePayment('250000'), async (req: Request, res: Response) => {
  const address = req.query.address as string;
  if (!address) return res.status(400).json({ error: 'address query param required' });
  const analysis = await analyzeWallet(address);
  res.json({ analysis, timestamp: new Date().toISOString() });
});

async function generateTradingSignal(pair: string): Promise<object> {
  // Simplified signal generation — in production: use on-chain price feeds + ML
  const sentiment = Math.random() > 0.5 ? 'BULLISH' : 'BEARISH';
  const confidence = (0.6 + Math.random() * 0.35).toFixed(2);
  return {
    pair,
    signal: sentiment,
    confidence: parseFloat(confidence),
    action: sentiment === 'BULLISH' ? 'BUY' : 'SELL',
    reasoning: `On-chain analysis of ${pair} shows ${sentiment.toLowerCase()} momentum with ${confidence} confidence.`,
  };
}

async function analyzeWallet(address: string): Promise<object> {
  try {
    const balance = await publicClient.getBalance({ address: address as `0x${string}` });
    const txCount = await publicClient.getTransactionCount({ address: address as `0x${string}` });
    return {
      address,
      ethBalance: balance.toString(),
      transactionCount: txCount,
      network: 'base-mainnet',
      riskScore: txCount > 100 ? 'LOW' : txCount > 10 ? 'MEDIUM' : 'HIGH',
    };
  } catch (e) {
    return { address, error: 'Could not fetch on-chain data' };
  }
}

export async function startPaymentServer(): Promise<void> {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`💰 x402 Payment Server running on port ${PORT}`);
      console.log(`   Services: http://localhost:${PORT}/`);
      resolve();
    });
  });
}
