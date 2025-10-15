import { NextRequest, NextResponse } from "next/server";
import { processWithUltraReasoning } from "@/mastra/config";
import { vectorStore, enhancedReasoning } from "@/mastra/memory/vector-store";
import { KNOWLEDGE_SOURCES, getTotalSourceCount } from "@/mastra/config/knowledge-sources";
import { detectIntent, enhancePromptWithIntent } from "@/utils/intent-detector";

export async function POST(req: NextRequest) {
  try {
    const { message, model, context = [] } = await req.json();
    
    // ULTRA Intelligence System Prompt v7 - Context-Aware Research Agent
    const systemPrompt = {
      role: "system",
      content: `You are ZigsAI Ultra Agent - an advanced AI assistant specialized in blockchain, Web3, DeFi, and AI technologies.

## CRITICAL: UNDERSTAND USER INTENT FIRST
Before responding, identify what the user is ACTUALLY asking for:
- NEWS → Provide recent developments, updates, announcements
- PRICE → Give current market data and price analysis
- TECHNICAL → Explain how something works technically
- COMPARISON → Compare different solutions/projects
- ANALYSIS → Deep dive into metrics and performance
- GENERAL → Educational or informational content

## RESPONSE GUIDELINES

### For NEWS queries:
- Focus on RECENT events (last 7-30 days)
- Mention specific dates when possible
- Cover: partnerships, launches, updates, governance decisions
- NO price analysis unless specifically asked

### For PRICE/MARKET queries:
- Current price and market cap
- Trading volume and liquidity
- Price trends and technical indicators
- Market sentiment

### For TECHNICAL queries:
- Architecture and implementation details
- Performance metrics and benchmarks
- Technical advantages/disadvantages
- Code examples if relevant

### For COMPARISON queries:
- Side-by-side feature comparison
- Performance metrics
- Use cases and target markets
- Pros and cons of each

## KNOWLEDGE SOURCES
You have access to 160+ data sources including:
- Real-time blockchain data
- GitHub repositories and development activity
- News aggregators and social media
- Technical documentation
- Market data feeds

## RESPONSE FORMAT
1. **Intent Recognition**: [Briefly state what user is asking]
2. **Relevant Information**: [Provide ONLY what was asked]
3. **Key Insights**: [2-3 main takeaways]
4. **Sources**: [Mention data sources used]

## CRITICAL RULES
- NEVER provide price data when asked for news
- NEVER provide news when asked for technical details
- ALWAYS match response type to user intent
- Be concise but comprehensive
- Use current data (mention dates/timeframes)
- Admit if information is not available`
    };
    
    // Check which API to use based on model selection
    if (model === "groq" || !model) {
      const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
      // Detect user intent first
      const userIntent = detectIntent(message);
      console.log("Detected intent:", userIntent);
      
      // Process with Mastra ULTRA reasoning for enhanced context
      let mastraContext = null;
      try {
        console.log("Analyzing with Mastra ULTRA reasoning...");
        mastraContext = await processWithUltraReasoning(message);
        console.log("Mastra analysis complete:", mastraContext);
      } catch (mastraError) {
        console.error("Mastra analysis failed:", mastraError);
      }
      
      // Check if we have API keys for real responses
      if (!groqKey && !process.env.OPENAI_API_KEY) {
        console.log("No API keys configured - please add GROQ_API_KEY or OPENAI_API_KEY to .env");
        return NextResponse.json({
          error: "No API keys configured. Please add GROQ_API_KEY or OPENAI_API_KEY to your .env file.",
          hint: "Add your API key to .env file: GROQ_API_KEY=your_key_here"
        }, { status: 500 });
      }
      
      // Use Groq API if key is available
      if (groqKey) {
        const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        
        // Enhance system prompt with intent and Mastra context
        let enhancedSystemPrompt = systemPrompt.content;
        
        // Add intent information
        enhancedSystemPrompt += `\n\n## USER INTENT DETECTED
- Primary Intent: ${userIntent.primary.toUpperCase()}
- Confidence: ${userIntent.confidence}%
- Keywords: ${userIntent.keywords.join(', ')}
- Instruction: ${userIntent.contextHint}`;
        
        // Add Mastra context if available
        if (mastraContext) {
          enhancedSystemPrompt += `\n\n## CONTEXT ANALYSIS
- Sources Available: ${mastraContext.sourceAnalysis.primary} primary, ${mastraContext.sourceAnalysis.secondary} secondary
- Memory Context: ${mastraContext.memoryContext.avgConfidence}% confidence`;
        }
        
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",  // Latest Groq model, replacing deprecated mixtral
              messages: [
                { role: "system", content: enhancedSystemPrompt },
                ...context,
                { role: "user", content: enhancePromptWithIntent(message, userIntent) }
              ],
              temperature: 0.3,  // Lower temperature for more focused responses
              max_tokens: 4096,  // More tokens for comprehensive answers
              stream: false,
              top_p: 0.9,
              frequency_penalty: 0.5,  // Reduce repetition
              presence_penalty: 0.5   // Encourage diverse content
            })
          });

          if (!response.ok) {
            const error = await response.text();
            console.error("Groq API error:", error);
            throw new Error(`Groq API error: ${response.status}`);
          }

          const data = await response.json();
          
          return NextResponse.json({
            response: data.choices[0].message.content,
            model: data.model,
            timestamp: new Date().toISOString(),
            usage: data.usage,
            mastraAnalysis: mastraContext
          });
        } catch (error: any) {
          console.error("Error calling Groq API:", error);
          // Fall through to OpenAI if Groq fails
        }
      }
    }
    
    // OpenAI API mode
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // Use gpt-4o-mini as default, more cost-effective
        messages: [
          systemPrompt,
          ...context,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      response: data.choices[0].message.content,
      model: data.model,
      timestamp: new Date().toISOString(),
      usage: data.usage
    });
    
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}
