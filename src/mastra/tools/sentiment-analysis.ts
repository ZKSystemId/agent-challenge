import { createTool } from '@mastra/core';
import { z } from 'zod';

export const sentimentAnalysisTool = createTool({
  id: 'market-sentiment',
  description: 'Analyze market sentiment and trending topics from HackerNews.',
  inputSchema: z.object({
    query: z.string().optional().describe('Optional search query to filter stories'),
  }),
  execute: async ({ context }) => {
    const { query } = context;
    
    try {
      const response = await fetch(
        `https://hn.algolia.com/api/v1/search?tags=front_page${query ? `&query=${encodeURIComponent(query)}` : ''}`,
        { cache: 'no-store' }
      );
      
      if (!response.ok) {
        throw new Error(`HackerNews API error: ${response.status}`);
      }
      
      const data = await response.json();
      const stories = data.hits.slice(0, 10);
      
      const totalPoints = stories.reduce((sum: number, s: any) => sum + (s.points || 0), 0);
      const avgPoints = totalPoints / stories.length;
      
      const sentiment = avgPoints > 200 ? 'Very Positive' :
                       avgPoints > 100 ? 'Positive' :
                       avgPoints > 50 ? 'Neutral' : 'Low Interest';
      
      return {
        success: true,
        sentiment: sentiment,
        averagePoints: Math.round(avgPoints),
        topStories: stories.slice(0, 5).map((s: any) => ({
          title: s.title,
          points: s.points || 0,
          comments: s.num_comments || 0,
        })),
        timestamp: new Date().toISOString(),
        source: 'HackerNews API',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
