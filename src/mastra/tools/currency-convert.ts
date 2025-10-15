import { createTool } from '@mastra/core';
import { z } from 'zod';

export const currencyConvertTool = createTool({
  id: 'currency-converter',
  description: 'Convert between fiat currencies (USD, EUR, GBP, JPY, IDR, etc.) using real-time rates.',
  inputSchema: z.object({
    from: z.string().describe('Source currency code (e.g., USD, EUR, GBP)'),
    to: z.string().describe('Target currency code (e.g., IDR, JPY, EUR)'),
    amount: z.number().describe('Amount to convert'),
  }),
  execute: async ({ context }) => {
    const { from, to, amount } = context;
    
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${from.toUpperCase()}&to=${to.toUpperCase()}&amount=${amount}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        throw new Error(`Frankfurter API error: ${response.status}`);
      }
      
      const data = await response.json();
      const rate = data.rates[to.toUpperCase()];
      
      return {
        success: true,
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: amount,
        convertedAmount: rate,
        rate: rate / amount,
        timestamp: new Date().toISOString(),
        source: 'Frankfurter API',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
