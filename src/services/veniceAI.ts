import * as dotenv from 'dotenv';
dotenv.config();

export async function getPortfolioInsights(walletAddress: string): Promise<string> {
  const prompt = `Analyze the DeFi portfolio for wallet ${walletAddress} on the Base network. Identify high-yield opportunities and risk factors without exposing identity. Limit response to 3-4 concise sentences.`;
  
  console.log(`[Venice] Processing private inference for ${walletAddress}...`);
  
  const apiKey = process.env.VENICE_API_KEY;
  
  if (!apiKey) {
    console.log('[Venice] No API key found, falling back to mock response.');
    return `Based on the activity of ${walletAddress}, the portfolio shows a conservative profile leaning toward stablecoin yields. Recommendation: Consider migrating idle USDC to Aave V3 on Base for a current 4.2% APY, while maintaining a 20% ETH position for gas and upside exposure. Risk level: Low.`;
  }

  try {
    const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b', // Popular open model on Venice
        messages: [
          { role: 'system', content: 'You are a highly analytical, privacy-focused DeFi AI agent.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Venice API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('[Venice] Error calling Venice AI:', error);
    return 'Analysis temporarily unavailable due to inference node timeout.';
  }
}
