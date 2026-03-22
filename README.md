# SynthAgent ⚡

**An autonomous AI agent living on Base that trades, earns, and creates.**

Built by [ivclaw](https://github.com/ivclaw) for the **Synthesis Hackathon 2026**.

---

## What is SynthAgent?

SynthAgent is a self-sovereign AI entity on the Base L2 network. It combines:

- 🏦 **DeFi Trading** — Autonomous swaps on Uniswap V3 (Base)
- 💰 **x402 Paid Services** — Sells trading insights, wallet analysis, and portfolio advice via HTTP 402
- 🔒 **Privacy via Venice** — Uses Venice AI for private, censorship-resistant inference
- 🪪 **On-chain Identity** — ERC-8004 agent identity, self-custodial wallet

### The Thesis

Agents shouldn't just *talk* — they should **earn**. SynthAgent is an autonomous economic actor:
it analyzes markets, executes trades, and sells its intelligence as a paid API service.
Other agents or humans pay with USDC on Base via the [x402 protocol](https://x402.org).

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  SynthAgent                      │
├──────────┬──────────┬───────────┬───────────────┤
│  x402    │  DeFi    │  Venice   │  ERC-8004     │
│  Payment │  Trading │  Private  │  Identity     │
│  Server  │  Engine  │  AI       │  (Base)       │
├──────────┴──────────┴───────────┴───────────────┤
│              Base L2 (Ethereum)                  │
└─────────────────────────────────────────────────┘
```

### Components

| Component | Description |
|-----------|------------|
| **x402 Payment Server** | Express server implementing HTTP 402 payment protocol. Endpoints return pricing info; payment in USDC unlocks the response. |
| **DeFi Trading Engine** | Executes swaps on Uniswap V3 via Base. Supports ETH/USDC and other pairs. |
| **Venice AI Integration** | Private inference for portfolio analysis. No data leaks, no censorship. |
| **ERC-8004 Identity** | On-chain agent identity on Base for verifiable autonomous actions. |

---

## Paid API Endpoints (x402)

All paid endpoints follow the [x402 protocol](https://x402.org). Send a request without payment → get a `402` response with pricing. Include payment header → get the data.

| Endpoint | Price | Description |
|----------|-------|-------------|
| `GET /` | Free | Agent info and service catalog |
| `GET /insights?wallet=0x...` | 0.50 USDC | AI-powered DeFi portfolio insights |
| `GET /signal?pair=ETH/USDC` | 1.00 USDC | Trading signal for any Base token pair |
| `GET /analyze?address=0x...` | 0.25 USDC | On-chain wallet risk analysis |

---

## Quick Start

```bash
# Clone
git clone https://github.com/ivclaw/synth-agent.git
cd synth-agent

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your keys

# Build & Run
npm run build
npm start
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Agent wallet private key |
| `BASE_RPC_URL` | Base RPC endpoint (default: `https://mainnet.base.org`) |
| `VENICE_API_KEY` | Venice AI API key for private inference |
| `PORT` | Payment server port (default: `3402`) |

---

## Agent Identity

- **Wallet:** `0x87EF7e4e34F58df85125372f25e75f962557d2d5`
- **Network:** Base (Ethereum L2)
- **Identity Standard:** ERC-8004
- **Registration TX:** [View on BaseScan](https://basescan.org/tx/0x2d29e1d766d85637dd79d53bb6db679c39b391acf91bfba44c6ee347c8d75434)

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Chain:** Base (Ethereum L2) via [viem](https://viem.sh)
- **DEX:** Uniswap V3
- **Payments:** x402 protocol (HTTP 402 + USDC)
- **Privacy:** Venice AI
- **Identity:** ERC-8004

---

## Hackathon Categories

This project targets multiple Synthesis Hackathon categories:

- ✅ **Autonomous Trading** — DeFi swaps on Base
- ✅ **Agent Services** — x402 paid API endpoints
- ✅ **Privacy** — Venice AI integration
- ✅ **On-chain Identity** — ERC-8004 self-custody

---

## License

MIT
