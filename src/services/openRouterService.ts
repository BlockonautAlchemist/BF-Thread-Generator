import axios from 'axios';

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface ThreadContent {
  shitpost: string;
  informative: string;
  viral: string;
  threadBody: string;
}

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Debug log for API key (masking most of it for security)
console.log('API Key loaded:', API_KEY ? `${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 5)}` : 'Not found');

export const generateThreadContent = async (gameKnowledge: string): Promise<ThreadContent> => {
  try {
    console.log('Making request to OpenRouter API...');
    
    // List of models to try
    const models = [
      'anthropic/claude-3-7-sonnet',
      'anthropic/claude-3-opus-20240229',
      'anthropic/claude-3-sonnet-20240229',
      'anthropic/claude-3-haiku-20240307',
      'openai/gpt-4-turbo'
    ];
    
    // Use the first model in the list
    const selectedModel = models[0];
    console.log('Using model:', selectedModel);
    
    const requestBody = {
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: `You are an expert social media content creator specializing in gaming content.
          You create engaging, informative Twitter threads that educate readers about games.
          Always respond in valid JSON format with the exact keys requested.
          IMPORTANT: Do NOT use any hashtags or emojis in your responses.
          IMPORTANT: Always be positive and enthusiastic about the game. Never criticize or speak negatively about it.`
        },
        {
          role: 'user',
          content: `I need you to create an informative Twitter thread about the game Boss Fighters.
          
          Here's what I know about the game: ${gameKnowledge}
          
          Please create:
          
          1. A funny/shitpost style hook (max 280 characters) - This should be humorous and catch attention with a positive joke or exaggeration about the game. Focus on the game's world, characters, or lore. Be ENTHUSIASTIC and BULLISH about the game - avoid any negative comments. NO hashtags or emojis.
          
          2. An informative hook (max 280 characters) - This should promise to educate the reader about the game's background, development, or unique features. NO hashtags or emojis.
          
          3. A viral-optimized hook (max 280 characters) - This should create curiosity about an interesting aspect of the game's world, story, or mechanics. NO hashtags or emojis.
          
          4. A thread body with 5 short parts (each part MUST be under 200 characters). The thread should focus on interesting facts, lore, development history, or unique features of Boss Fighters. End with a thoughtful conclusion.
          
          IMPORTANT RULES:
          - Do NOT use any hashtags (e.g., #BossFighters, #Gaming)
          - Do NOT use any emojis
          - Do NOT number the tweets (no "1/" or "2/" at the beginning of each part)
          - Keep all text natural and clean
          - Make sure each part of the thread body is complete and not cut off
          - Keep each thread part SHORT (under 200 characters)
          - Focus on being INFORMATIVE about the game itself, not just strategy tips
          - Be POSITIVE and ENTHUSIASTIC about the game - never criticize or speak negatively about it
          
          Format your response as a JSON object with these exact keys:
          - "shitpost" (the funny hook)
          - "informative" (the informative hook)
          - "viral" (the viral hook)
          - "part1" (first part of thread)
          - "part2" (second part of thread)
          - "part3" (third part of thread)
          - "part4" (fourth part of thread)
          - "part5" (fifth part of thread)
          
          Example format:
          {
            "shitpost": "Been playing Boss Fighters for 72 hours straight and now I instinctively dodge roll away from my coworkers when they approach my desk. This game is TOO GOOD.",
            "informative": "Boss Fighters began as a game jam project in 2021 before becoming a viral sensation. Here's the fascinating story behind its unique boss-centric gameplay design:",
            "viral": "The secret area in Boss Fighters that only 2% of players have discovered contains lore that completely changes how you'll view the game's story.",
            "part1": "Boss Fighters was created by a team of just three developers who previously worked on major AAA titles. They wanted to flip the script on traditional boss battles.",
            "part2": "The game's distinctive art style was inspired by a mix of 90s anime and renaissance paintings, creating its unique visual identity that stands out in the genre.",
            "part3": "Each boss character has a detailed backstory written by fantasy author Rebecca Chen, explaining their motivations and connection to the game world.",
            "part4": "The haunting soundtrack was composed using a mix of traditional orchestral instruments and sounds recorded from actual medieval weapons and armor.",
            "part5": "While most players focus on combat, the game contains a rich world with environmental storytelling that reveals the tragic history of the game's universe."
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post<OpenRouterResponse>(
      API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bossfighters.com',
          'X-Title': 'Boss Fighters Thread Generator'
        }
      }
    );

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    // Check if we have a valid response
    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response structure from OpenRouter API');
    }
    
    // Get the content from the response
    const content = response.data.choices[0].message.content;
    console.log('Response content:', content);
    
    try {
      // Try to parse the JSON response
      const parsedContent = JSON.parse(content);
      
      // Combine the thread parts into a single string
      const threadBody = [
        parsedContent.part1 || "",
        parsedContent.part2 || "",
        parsedContent.part3 || "",
        parsedContent.part4 || "",
        parsedContent.part5 || ""
      ].filter(part => part.length > 0).join('\n\n');
      
      // Return the content in the expected format
      return {
        shitpost: parsedContent.shitpost || "Error: Could not generate shitpost hook",
        informative: parsedContent.informative || "Error: Could not generate informative hook",
        viral: parsedContent.viral || "Error: Could not generate viral hook",
        threadBody: threadBody || "Error: Could not generate thread body"
      };
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      
      // Try to extract content using regex if JSON parsing fails
      const extractedContent = {
        shitpost: extractContent(content, 'shitpost') || "Error: Could not extract shitpost hook",
        informative: extractContent(content, 'informative') || "Error: Could not extract informative hook",
        viral: extractContent(content, 'viral') || "Error: Could not extract viral hook",
        threadBody: [
          extractContent(content, 'part1') || "",
          extractContent(content, 'part2') || "",
          extractContent(content, 'part3') || "",
          extractContent(content, 'part4') || "",
          extractContent(content, 'part5') || ""
        ].filter(part => part.length > 0).join('\n\n')
      };
      
      console.log('Extracted content:', extractedContent);
      return extractedContent;
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
    
    throw error;
  }
};

// Helper function to extract content from non-JSON response
function extractContent(text: string, key: string): string | null {
  // Try to find the key in the text with various formats
  const patterns = [
    // Standard JSON format: "key": "value"
    new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`, 'i'),
    // Alternative format: key: value
    new RegExp(`${key}\\s*:\\s*([^\\n,}]+)`, 'i'),
    // Look for the key followed by any text
    new RegExp(`${key}[^:]*:\\s*(.+?)(?=\\n|$)`, 'i')
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
} 