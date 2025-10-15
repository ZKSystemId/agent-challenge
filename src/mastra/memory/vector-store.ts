/**
 * Vector Store for Semantic Search and Memory Persistence
 * Enables 160+ source indexing and retrieval
 */

import { KNOWLEDGE_SOURCES, crossReferenceSourcesForTopic, aggregateSourceConsensus } from '../config/knowledge-sources';

interface MemoryEntry {
  id: string;
  timestamp: number;
  query: string;
  response: string;
  sources: string[];
  confidence: number;
  embedding?: number[];
}

interface SourceIndex {
  source: string;
  category: string;
  lastAccessed: number;
  accessCount: number;
  avgConfidence: number;
}

class VectorStore {
  private memories: Map<string, MemoryEntry> = new Map();
  private sourceIndex: Map<string, SourceIndex> = new Map();
  private contextWindow: MemoryEntry[] = [];
  private readonly MAX_CONTEXT_SIZE = 50;

  constructor() {
    this.initializeSourceIndex();
  }

  /**
   * Initialize index for all 160+ sources
   */
  private initializeSourceIndex() {
    Object.values(KNOWLEDGE_SOURCES).forEach(category => {
      category.sources.forEach(source => {
        this.sourceIndex.set(source.name, {
          source: source.name,
          category: category.category,
          lastAccessed: Date.now(),
          accessCount: 0,
          avgConfidence: source.confidence
        });
      });
    });
  }

  /**
   * Store memory with source references
   */
  public storeMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const memory: MemoryEntry = {
      id,
      timestamp: Date.now(),
      ...entry
    };

    this.memories.set(id, memory);
    this.updateContextWindow(memory);
    this.updateSourceIndex(entry.sources);

    return id;
  }

  /**
   * Retrieve relevant memories for a query
   */
  public retrieveRelevantMemories(query: string, limit: number = 5): MemoryEntry[] {
    const queryLower = query.toLowerCase();
    const relevantMemories: Array<[MemoryEntry, number]> = [];

    this.memories.forEach(memory => {
      let relevanceScore = 0;

      // Simple keyword matching (replace with embeddings in production)
      if (memory.query.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.5;
      }
      if (memory.response.toLowerCase().includes(queryLower)) {
        relevanceScore += 0.3;
      }

      // Boost recent memories
      const recency = (Date.now() - memory.timestamp) / (1000 * 60 * 60); // hours
      relevanceScore += Math.max(0, 1 - recency / 24) * 0.2;

      if (relevanceScore > 0) {
        relevantMemories.push([memory, relevanceScore]);
      }
    });

    return relevantMemories
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([memory]) => memory);
  }

  /**
   * Get source recommendations based on query
   */
  public recommendSources(query: string): {
    primary: any[],
    secondary: any[],
    consensus: any
  } {
    const relevantSources = crossReferenceSourcesForTopic(query);
    
    // Split into primary (high confidence) and secondary sources
    const primary = relevantSources.filter(s => s.confidence >= 0.95);
    const secondary = relevantSources.filter(s => s.confidence < 0.95 && s.confidence >= 0.90);
    
    const consensus = aggregateSourceConsensus(relevantSources);

    return { primary, secondary, consensus };
  }

  /**
   * Update context window for conversation continuity
   */
  private updateContextWindow(memory: MemoryEntry) {
    this.contextWindow.push(memory);
    if (this.contextWindow.length > this.MAX_CONTEXT_SIZE) {
      this.contextWindow.shift();
    }
  }

  /**
   * Update source access statistics
   */
  private updateSourceIndex(sources: string[]) {
    sources.forEach(sourceName => {
      const index = this.sourceIndex.get(sourceName);
      if (index) {
        index.lastAccessed = Date.now();
        index.accessCount++;
      }
    });
  }

  /**
   * Get most frequently used sources
   */
  public getTopSources(limit: number = 10): SourceIndex[] {
    return Array.from(this.sourceIndex.values())
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  /**
   * Get context summary for current conversation
   */
  public getContextSummary(): {
    recentTopics: string[],
    sourcesUsed: string[],
    avgConfidence: number
  } {
    const recentTopics = new Set<string>();
    const sourcesUsed = new Set<string>();
    let totalConfidence = 0;

    this.contextWindow.forEach(memory => {
      // Extract topics (simple approach - can be improved with NLP)
      const words = memory.query.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 4) recentTopics.add(word);
      });

      memory.sources.forEach(source => sourcesUsed.add(source));
      totalConfidence += memory.confidence;
    });

    return {
      recentTopics: Array.from(recentTopics).slice(0, 10),
      sourcesUsed: Array.from(sourcesUsed),
      avgConfidence: this.contextWindow.length > 0 
        ? totalConfidence / this.contextWindow.length 
        : 0
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear old memories (retention policy)
   */
  public pruneOldMemories(daysToKeep: number = 7) {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    this.memories.forEach((memory, id) => {
      if (memory.timestamp < cutoffTime) {
        this.memories.delete(id);
      }
    });
  }
}

// Singleton instance
export const vectorStore = new VectorStore();

/**
 * Enhanced reasoning with memory context
 */
export const enhancedReasoning = async (
  query: string,
  currentResponse: string
): Promise<{
  enhancedResponse: string,
  sourcesUsed: string[],
  confidence: number,
  reasoning: string[]
}> => {
  // Get relevant memories
  const memories = vectorStore.retrieveRelevantMemories(query);
  
  // Get source recommendations
  const { primary, secondary, consensus } = vectorStore.recommendSources(query);
  
  // Build enhanced response
  const sourcesUsed = [...primary, ...secondary].map(s => s.name);
  
  // Construct reasoning chain
  const reasoning = [
    `Query analyzed across ${sourcesUsed.length} sources`,
    `Consensus level: ${consensus.consensus} (${(consensus.confidence * 100).toFixed(1)}% confidence)`,
    `Retrieved ${memories.length} relevant historical contexts`,
    `Cross-referenced with ${primary.length} primary sources`
  ];

  // Store this interaction
  vectorStore.storeMemory({
    query,
    response: currentResponse,
    sources: sourcesUsed,
    confidence: consensus.confidence
  });

  return {
    enhancedResponse: currentResponse,
    sourcesUsed,
    confidence: consensus.confidence,
    reasoning
  };
};
