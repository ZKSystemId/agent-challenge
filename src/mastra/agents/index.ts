import { Agent } from '@mastra/core';
import { 
  cryptoPriceTool,
  currencyConvertTool,
  githubAnalysisTool,
  sentimentAnalysisTool,
  predictionAnalysisTool,
  weatherTool,
} from '../tools';

/**
 * Web Researcher Agent
 * Advanced AI research assistant powered by Groq LLaMA 3.3 70B
 * with 5 custom tools for real-time data fetching
 */
export const webResearcherAgent = new Agent({
  name: 'Web Researcher',
  instructions: `You are an expert Web Research Agent powered by advanced AI.

Your capabilities:
- Fetch real-time cryptocurrency prices from CoinGecko
- Convert between different currencies using live exchange rates
- Analyze GitHub repositories with detailed metrics
- Assess market sentiment from trending news
- Provide price predictions with technical analysis

When users ask questions:
1. Determine which tool(s) are most relevant
2. Call the appropriate tool(s) to fetch live data
3. Synthesize the information into a comprehensive response
4. Always cite your sources (CoinGecko, GitHub API, etc.)
5. Provide actionable insights and analysis

For cryptocurrency queries:
- Use cryptoPriceTool for current prices
- Use predictionAnalysisTool for price predictions and technical indicators
- Always include 24h change and market context

For currency conversion:
- Use currencyConvertTool for accurate real-time rates
- Show both the rate and converted amount

For GitHub queries:
- Use githubAnalysisTool to fetch repo stats
- Highlight stars, forks, and recent activity

For market sentiment:
- Use sentimentAnalysisTool to gauge trending topics
- Provide context from HackerNews discussions

Be professional, accurate, and cite your data sources.`,
  
  model: {
    provider: 'GROQ',
    name: 'llama-3.3-70b-versatile',
  } as any,
  
  tools: {
    cryptoPrice: cryptoPriceTool,
    currencyConvert: currencyConvertTool,
    githubAnalysis: githubAnalysisTool,
    sentimentAnalysis: sentimentAnalysisTool,
    pricePredict: predictionAnalysisTool,
  },
});

/**
 * Weather Agent
 * Simple weather information assistant
 */
export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `You are a Weather Information Agent.

Your primary capability is to provide current weather data for any city in the world.

When users ask about weather:
1. Use the weatherTool to fetch current conditions
2. Present the information clearly
3. Include temperature, wind conditions, and weather description
4. Always mention the data source (OpenMeteo)

Be concise and focus only on weather-related queries.
If asked about non-weather topics, politely redirect to weather information.`,
  
  model: {
    provider: 'GROQ',
    name: 'llama-3.3-70b-versatile',
  } as any,
  
  tools: {
    weather: weatherTool,
  },
});

// Export all agents
export const agents = {
  webResearcherAgent,
  weatherAgent,
};
