// Using fetch for browser environment instead of Node.js fs module

interface KnowledgeBaseMetadata {
  version: string;
  lastUpdated: string;
}

interface KnowledgeChunk {
  id: number;
  content: string;
  title?: string;
  keywords: string[];
}

interface KnowledgeBase {
  metadata: KnowledgeBaseMetadata;
  overview: string;
  chunks: KnowledgeChunk[];
  keywords: {
    [key: string]: string[];
  };
}

class KnowledgeBaseService {
  private knowledgeBase: KnowledgeBase | null = null;
  private readonly knowledgeBasePath: string;
  
  constructor(knowledgeBasePath: string = './knowledge/BossFightersWiki_ChunksMD.md') {
    this.knowledgeBasePath = knowledgeBasePath;
  }
  
  /**
   * Load and parse the knowledge base from the Markdown file
   */
  async loadKnowledgeBase(): Promise<KnowledgeBase> {
    try {
      // If already loaded, return the cached version
      if (this.knowledgeBase) {
        return this.knowledgeBase;
      }
      
      // Fetch the markdown file using fetch API (browser compatible)
      const response = await fetch(this.knowledgeBasePath);
      if (!response.ok) {
        throw new Error(`Failed to load knowledge base: ${response.status} ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Parse the markdown content
      const kb = this.parseChunkedMarkdown(content);
      this.knowledgeBase = kb;
      
      console.log(`Knowledge base loaded: ${kb.chunks.length} chunks`);
      return kb;
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      // Return an empty knowledge base as fallback
      return this.createEmptyKnowledgeBase();
    }
  }
  
  /**
   * Parse the chunked markdown content into a structured knowledge base
   */
  private parseChunkedMarkdown(content: string): KnowledgeBase {
    const kb: KnowledgeBase = this.createEmptyKnowledgeBase();
    
    // Split the content by chunk separators
    const chunkSeparator = "================================================================================";
    const rawChunks = content.split(chunkSeparator);
    
    // Process each chunk
    kb.chunks = rawChunks.map((rawChunk, index) => {
      const chunkContent = rawChunk.trim();
      if (!chunkContent) {
        return {
          id: index,
          content: '',
          keywords: []
        };
      }
      
      // Extract chunk ID if available
      const chunkIdMatch = chunkContent.match(/^Chunk (\d+):/);
      const id = chunkIdMatch ? parseInt(chunkIdMatch[1]) : index;
      
      // Extract title if available (first ## heading)
      const titleMatch = chunkContent.match(/## ([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : undefined;
      
      // Generate keywords from the content
      const keywords = this.extractKeywords(chunkContent);
      
      return {
        id,
        content: chunkContent,
        title,
        keywords
      };
    }).filter(chunk => chunk.content.length > 0); // Remove empty chunks
    
    // Set the overview from the first chunk
    if (kb.chunks.length > 0) {
      kb.overview = kb.chunks[0].content;
    }
    
    // Generate global keywords
    this.generateKeywords(kb);
    
    // Set metadata (using current date as we don't have version info in the new format)
    kb.metadata = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    return kb;
  }
  
  /**
   * Extract keywords from chunk content
   */
  private extractKeywords(content: string): string[] {
    const keywords: string[] = [];
    
    // Extract bold text as keywords
    const boldMatches = content.matchAll(/\*\*([^*]+)\*\*/g);
    for (const match of boldMatches) {
      keywords.push(match[1].toLowerCase());
    }
    
    // Extract headings as keywords
    const headingMatches = content.matchAll(/##+ ([^\n]+)/g);
    for (const match of headingMatches) {
      keywords.push(match[1].toLowerCase());
    }
    
    // Extract list items as keywords
    const listMatches = content.matchAll(/- ([^\n:]+):/g);
    for (const match of listMatches) {
      keywords.push(match[1].toLowerCase());
    }
    
    // Remove duplicates
    return [...new Set(keywords)];
  }
  
  /**
   * Generate global keywords for the knowledge base
   */
  private generateKeywords(kb: KnowledgeBase): void {
    // Initialize keyword categories
    kb.keywords = {
      general: ['boss fighters', 'game', 'multiplayer', 'vr', 'pc'],
      gameplay: [],
      bosses: [],
      fighters: [],
      arenas: [],
      economy: []
    };
    
    // Collect keywords from all chunks
    for (const chunk of kb.chunks) {
      // Add chunk title to appropriate category if available
      if (chunk.title) {
        const lowerTitle = chunk.title.toLowerCase();
        
        if (lowerTitle.includes('boss')) {
          kb.keywords.bosses.push(lowerTitle);
        } else if (lowerTitle.includes('fighter')) {
          kb.keywords.fighters.push(lowerTitle);
        } else if (lowerTitle.includes('arena') || lowerTitle.includes('environment')) {
          kb.keywords.arenas.push(lowerTitle);
        } else if (lowerTitle.includes('gameplay') || lowerTitle.includes('mechanic')) {
          kb.keywords.gameplay.push(lowerTitle);
        } else if (lowerTitle.includes('economy') || lowerTitle.includes('currency')) {
          kb.keywords.economy.push(lowerTitle);
        } else {
          kb.keywords.general.push(lowerTitle);
        }
      }
      
      // Add all chunk keywords to general category
      kb.keywords.general.push(...chunk.keywords);
    }
    
    // Remove duplicates from all categories
    for (const category in kb.keywords) {
      kb.keywords[category] = [...new Set(kb.keywords[category])];
    }
  }
  
  /**
   * Get relevant knowledge based on user input
   */
  async getRelevantKnowledge(userInput: string): Promise<string> {
    const kb = await this.loadKnowledgeBase();
    const normalizedInput = userInput.toLowerCase();
    
    // Extract key terms from user input
    const userTerms = this.extractKeyTerms(normalizedInput);
    console.log('Extracted key terms from user input:', userTerms);
    
    // Score each chunk based on relevance to user input
    const scoredChunks = kb.chunks.map(chunk => {
      const score = this.calculateRelevanceScore(chunk, userTerms, normalizedInput);
      return { chunk, score };
    });
    
    // Sort chunks by relevance score (descending)
    scoredChunks.sort((a, b) => b.score - a.score);
    
    // Take only the most relevant chunks (limit to avoid overwhelming the model)
    const topChunks = scoredChunks.slice(0, 5).filter(item => item.score > 0);
    console.log(`Found ${topChunks.length} relevant chunks`);
    
    // If no relevant chunks found, return a general overview
    if (topChunks.length === 0) {
      console.log('No relevant chunks found, returning overview');
      return kb.overview;
    }
    
    // Combine the most relevant chunks
    const relevantSections = topChunks.map(item => item.chunk.content);
    return relevantSections.join('\n\n');
  }
  
  /**
   * Extract key terms from user input
   */
  private extractKeyTerms(input: string): string[] {
    // Remove common words and punctuation
    const cleanedInput = input.replace(/[^\w\s]/g, ' ').toLowerCase();
    
    // Split into words
    const words = cleanedInput.split(/\s+/);
    
    // Filter out common words and short words
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'a', 'an', 'of', 'that', 'this', 'these', 'those', 'it', 'they', 'them', 'their', 'game', 'play', 'player', 'players'];
    
    const keyTerms = words.filter(word => 
      word.length > 2 && !commonWords.includes(word)
    );
    
    // Add multi-word phrases that might be important
    const phrases = [];
    const inputLower = input.toLowerCase();
    
    // Check for specific game-related phrases
    const phrasesToCheck = [
      'boss fighters', 'vr', 'pc', 'boss', 'fighter', 'arena', 'weapon', 'ability', 
      'gameplay', 'multiplayer', 'economy', 'blockchain', 'combat', 'physics', 
      'free to play', 'digital collectible', 'badge', 'showrunner', 'stadium'
    ];
    
    for (const phrase of phrasesToCheck) {
      if (inputLower.includes(phrase)) {
        phrases.push(phrase);
      }
    }
    
    // Combine individual terms and phrases, remove duplicates
    return [...new Set([...keyTerms, ...phrases])];
  }
  
  /**
   * Calculate relevance score for a chunk based on user terms
   */
  private calculateRelevanceScore(chunk: KnowledgeChunk, userTerms: string[], rawInput: string): number {
    let score = 0;
    
    // Check for exact matches in chunk title (highest weight)
    if (chunk.title) {
      const titleLower = chunk.title.toLowerCase();
      for (const term of userTerms) {
        if (titleLower.includes(term)) {
          score += 3;
        }
      }
    }
    
    // Check for exact matches in chunk keywords (medium weight)
    for (const term of userTerms) {
      if (chunk.keywords.some(keyword => keyword.includes(term))) {
        score += 2;
      }
    }
    
    // Check for exact matches in chunk content (lowest weight)
    const contentLower = chunk.content.toLowerCase();
    for (const term of userTerms) {
      if (contentLower.includes(term)) {
        score += 1;
      }
    }
    
    // Bonus points for chunks that contain multiple user terms
    const uniqueTermsInChunk = userTerms.filter(term => contentLower.includes(term));
    score += Math.min(uniqueTermsInChunk.length, 3); // Cap at 3 bonus points
    
    return score;
  }
  
  /**
   * Check if the input contains any of the keywords
   */
  private containsAnyKeyword(input: string, keywords: string[]): boolean {
    return keywords.some(keyword => input.includes(keyword));
  }
  
  /**
   * Create an empty knowledge base structure
   */
  private createEmptyKnowledgeBase(): KnowledgeBase {
    return {
      metadata: {
        version: "1.0.0",
        lastUpdated: new Date().toISOString().split('T')[0]
      },
      overview: 'Boss Fighters is an asymmetric multiplayer VR vs. PC game.',
      chunks: [],
      keywords: {}
    };
  }
  
  /**
   * Get the knowledge base version information
   */
  async getVersionInfo(): Promise<KnowledgeBaseMetadata> {
    const kb = await this.loadKnowledgeBase();
    return {
      version: kb.metadata.version,
      lastUpdated: kb.metadata.lastUpdated
    };
  }
}

// Create and export a singleton instance
const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService; 