import { createTool } from '@mastra/core';
import { z } from 'zod';

export const cryptoPriceTool = createTool({
  id: 'crypto-price-fetcher',
  description: 'Fetch real-time cryptocurrency prices from CoinGecko API. Supports BTC, ETH, SOL, NOS, DOGE, XRP, BNB, ADA.',
  inputSchema: z.object({
    symbol: z.string().describe('Cryptocurrency symbol (e.g., bitcoin, ethereum, solana, nosana)'),
  }),
  execute: async ({ context }) => {
    const { symbol } = context;
    
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
        { 
          headers: { 'Accept': 'application/json' },
          cache: 'no-store' 
        }
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data = await response.json();
      const coinData = data[symbol.toLowerCase()];
      
      if (!coinData) {
        return {
          success: false,
          error: `Cryptocurrency "${symbol}" not found`,
        };
      }
      
      return {
        success: true,
        symbol: symbol.toUpperCase(),
        price: coinData.usd,
        change24h: coinData.usd_24h_change?.toFixed(2) || 'N/A',
        marketCap: coinData.usd_market_cap || 'N/A',
        timestamp: new Date().toISOString(),
        source: 'CoinGecko API',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
