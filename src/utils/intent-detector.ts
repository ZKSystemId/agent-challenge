/**
 * Intent Detection for Query Routing
 */

export type QueryIntent = 
  | 'news'
  | 'price'
  | 'technical'
  | 'comparison'
  | 'analysis'
  | 'general';

export interface IntentAnalysis {
  primary: QueryIntent;
  confidence: number;
  keywords: string[];
  contextHint?: string;
}

// Intent keywords mapping
const INTENT_KEYWORDS = {
  news: [
    'news', 'latest', 'recent', 'update', 'announcement', 'partnership',
    'launch', 'release', 'happening', 'event', 'development', 'breaking',
    'today', 'yesterday', 'this week', 'new'
  ],
  price: [
    'price', 'cost', 'value', 'worth', 'market cap', 'trading', 'volume',
    'liquidity', 'chart', 'pump', 'dump', 'bull', 'bear', 'ath', 'atl',
    'buy', 'sell', 'exchange rate', 'conversion', 'usd', 'market'
  ],
  technical: [
    'how', 'work', 'technical', 'architecture', 'implement', 'code',
    'algorithm', 'protocol', 'mechanism', 'infrastructure', 'system',
    'performance', 'tps', 'throughput', 'latency', 'consensus'
  ],
  comparison: [
    'compare', 'vs', 'versus', 'difference', 'better', 'worse',
    'advantages', 'disadvantages', 'pros', 'cons', 'which', 'between'
  ],
  analysis: [
    'analyze', 'analysis', 'deep dive', 'metrics', 'statistics',
    'trend', 'pattern', 'forecast', 'prediction', 'evaluation',
    'assessment', 'review', 'breakdown'
  ]
};

/**
 * Detect the primary intent of a user query
 */
export function detectIntent(query: string): IntentAnalysis {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);
  
  // Handle "who are you" type queries (HIGHEST PRIORITY)
  // Including Indonesian: "siapa kamu", "apa itu", etc
  if (/(who are you|siapa kamu|siapa anda|what are you|apa kamu)/i.test(lowerQuery)) {
    return {
      primary: 'general',
      confidence: 100,
      keywords: ['identity', 'about'],
      contextHint: 'Explain who ZigsAI is'
    };
  }
  
  const scores: Record<QueryIntent, number> = {
    news: 0,
    price: 0,
    technical: 0,
    comparison: 0,
    analysis: 0,
    general: 0
  };
  
  const foundKeywords: string[] = [];
  
  // Calculate scores for each intent
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        scores[intent as QueryIntent] += keyword.length > 5 ? 2 : 1;
        foundKeywords.push(keyword);
      }
    }
  }
  
  // Find the highest scoring intent
  let maxScore = 0;
  let primaryIntent: QueryIntent = 'general';
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      primaryIntent = intent as QueryIntent;
    }
  }
  
  // Calculate confidence (0-100)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 0;
  
  // Generate context hint
  let contextHint = '';
  switch (primaryIntent) {
    case 'news':
      contextHint = 'Focus on recent developments and updates';
      break;
    case 'price':
      contextHint = 'Provide market data and price analysis';
      break;
    case 'technical':
      contextHint = 'Explain technical details and implementation';
      break;
    case 'comparison':
      contextHint = 'Compare features and performance metrics';
      break;
    case 'analysis':
      contextHint = 'Provide deep analysis with metrics and insights';
      break;
    default:
      contextHint = 'Provide general information';
  }
  
  return {
    primary: primaryIntent,
    confidence,
    keywords: [...new Set(foundKeywords)],
    contextHint
  };
}

/**
 * Generate enhanced prompt based on intent
 */
export function enhancePromptWithIntent(
  query: string,
  intent: IntentAnalysis
): string {
  const prefix = `[User Intent: ${intent.primary.toUpperCase()} | Confidence: ${intent.confidence}%]\n`;
  const hint = `[Context: ${intent.contextHint}]\n`;
  const instruction = `[Keywords detected: ${intent.keywords.join(', ')}]\n\n`;
  
  return prefix + hint + instruction + 
    `User Query: "${query}"\n\n` +
    `Please provide a response that specifically addresses the ${intent.primary} aspect of this query.`;
}
