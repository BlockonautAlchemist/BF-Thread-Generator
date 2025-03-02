import axios from 'axios';
import knowledgeBaseService from './knowledgeBaseService';

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

// Try to get API key from environment variables or localStorage
let API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// If not found in env vars, try localStorage
if (!API_KEY) {
  API_KEY = localStorage.getItem('openrouter_api_key') || '';
}

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Debug log for API key (masking most of it for security)
console.log('API Key loaded:', API_KEY ? `${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 5)}` : 'Not found');
console.log('Environment variables available:', Object.keys(import.meta.env).join(', '));

// Function to set API key (used when user provides it manually)
export const setApiKey = (key: string): void => {
  API_KEY = key;
  localStorage.setItem('openrouter_api_key', key);
  console.log('API Key updated:', API_KEY ? `${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 5)}` : 'Not found');
};

// Function to check if API key is available
export const hasApiKey = (): boolean => {
  return !!API_KEY;
};

// Function to add transition sentences to hooks
function addTransitionToHook(hook: string, hookType: string, threadBody: string): string {
  // If the hook already ends with a colon, it likely already has a transition
  if (hook.trim().endsWith(':')) {
    return hook;
  }
  
  // Extract the first few words of the thread body to reference in the transition
  const firstPartWords = threadBody.split(' ').slice(0, 3).join(' ');
  
  // Different transition templates based on hook type
  const transitions = {
    shitpost: [
      "Here's my complete breakdown of why this game is so addictive:",
      "Let me walk you through exactly why I can't stop playing:",
      "I've mapped out the entire experience below and it's wild:",
      "Buckle up, I'm about to share all the reasons this game has taken over my life:",
      `Let me tell you about ${firstPartWords}...`
    ],
    informative: [
      "Let me break down the fascinating details for you:",
      "Here's the complete story behind this incredible game:",
      "I've researched everything you need to know about it:",
      "Below, I'll share the exact development journey that made this possible:",
      "I've compiled all the essential information you should know:"
    ],
    viral: [
      "I'm about to reveal everything I've discovered:",
      "Let me show you exactly what makes this so special:",
      "I've documented the entire thing below and it's mind-blowing:",
      "Here's the full story that most players never discover:",
      "I'll walk you through all the hidden details below:"
    ]
  };
  
  // Select a random transition for the hook type
  const transitionOptions = transitions[hookType as keyof typeof transitions] || transitions.informative;
  const randomTransition = transitionOptions[Math.floor(Math.random() * transitionOptions.length)];
  
  // Check if the hook already ends with a period, question mark, or exclamation point
  const endsWithPunctuation = /[.!?]$/.test(hook.trim());
  
  // Add the transition with appropriate spacing and punctuation
  return endsWithPunctuation 
    ? `${hook} ${randomTransition}`
    : `${hook}. ${randomTransition}`;
}

// Function to generate a call to action that matches the thread topic
function generateCallToAction(threadBody: string, gameKnowledge: string): string {
  console.log('Generating call to action for thread...');
  
  // Collection of CTA templates
  const ctaTemplates = [
    // Casual, friendly style
    "Found this helpful? Drop a like, share with your audience, and follow for more Boss Fighters tips and updates! What's your experience with {topic}? Let me know in the comments!",
    
    // Direct, action-oriented style
    "If this helped your game, hit like and share with your Boss Fighters crew! Follow for more content like this. Have you tried {topic} yet? Share your results below!",
    
    // Question-focused style
    "Like and repost if you found this useful! Follow for more Boss Fighters content. What other topic would you like me to cover next? Let me know!",
    
    // Enthusiastic style
    "Enjoying Boss Fighters? Like and share this thread! Follow for more insights. What's your favorite part about {topic}? Drop a comment below!",
    
    // Value-proposition style
    "Found value in this thread? Like, repost, and follow for more Boss Fighters content! What other topic would you like to learn more about?",
    
    // Community-focused style
    "Join our Boss Fighters community by liking, sharing, and following! Let's discuss {topic} together - what's been your approach so far?",
    
    // Curiosity-driven style
    "Curious about more Boss Fighters content? Like and follow for regular updates! What's your biggest question about {topic}?",
    
    // Benefit-oriented style
    "Want to master {topic} in Boss Fighters? Like, share, and follow for more advanced tips! What strategy has worked best for you?",
    
    // Conversational style
    "I'm always sharing new Boss Fighters insights - like and follow to stay updated! How has {topic} changed your gameplay? Share below!"
  ];
  
  // Extract key topics from the thread and user input
  const combinedText = `${threadBody} ${gameKnowledge}`.toLowerCase();
  
  // List of potential topics to detect in the thread
  const topicKeywords = [
    { keyword: "boss", replacement: "boss battles" },
    { keyword: "fighter", replacement: "fighter abilities" },
    { keyword: "weapon", replacement: "weapons" },
    { keyword: "arena", replacement: "arenas" },
    { keyword: "combat", replacement: "combat mechanics" },
    { keyword: "multiplayer", replacement: "multiplayer features" },
    { keyword: "vr", replacement: "VR gameplay" },
    { keyword: "pc", replacement: "PC gameplay" },
    { keyword: "strategy", replacement: "strategies" },
    { keyword: "gameplay", replacement: "gameplay features" }
  ];
  
  // Count occurrences of each topic
  const topicCounts = topicKeywords.map(topic => {
    // Count how many times the keyword appears in the text
    const regex = new RegExp(topic.keyword, 'gi');
    const matches = combinedText.match(regex) || [];
    return {
      ...topic,
      count: matches.length
    };
  });
  
  // Sort by count (descending) and get the most frequent topic
  topicCounts.sort((a, b) => b.count - a.count);
  
  // Use the most frequent topic, or default if none found
  let detectedTopic = "these features";
  if (topicCounts.length > 0 && topicCounts[0].count > 0) {
    detectedTopic = topicCounts[0].replacement;
    console.log(`Detected topic for CTA: ${detectedTopic} (mentioned ${topicCounts[0].count} times)`);
  }
  
  // Select a random CTA template
  const selectedTemplate = ctaTemplates[Math.floor(Math.random() * ctaTemplates.length)];
  
  // Replace the topic placeholder with the detected topic
  const customizedCTA = selectedTemplate.replace("{topic}", detectedTopic);
  
  console.log(`Generated CTA: ${customizedCTA}`);
  
  // Add a newline before the CTA to separate it from the thread body
  return `\n\n${customizedCTA}`;
}

export const generateThreadContent = async (gameKnowledge: string): Promise<ThreadContent> => {
  try {
    console.log('Making request to OpenRouter API...');
    
    // Get relevant knowledge from the knowledge base
    const relevantKnowledge = await knowledgeBaseService.getRelevantKnowledge(gameKnowledge);
    console.log('Retrieved relevant knowledge from knowledge base');
    
    // Get knowledge base version info
    const kbVersionInfo = await knowledgeBaseService.getVersionInfo();
    console.log(`Using knowledge base v${kbVersionInfo.version} (${kbVersionInfo.lastUpdated})`);
    
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
          IMPORTANT: Always be positive and enthusiastic about the game. Never criticize or speak negatively about it.
          
          You have access to the following official knowledge about Boss Fighters (v${kbVersionInfo.version}):
          
          ${relevantKnowledge}
          
          IMPORTANT: This knowledge is provided ONLY for context and accuracy. Your primary focus should be on the user's specific input about the game. The thread you create MUST be centered around what the user has told you about the game, not just general information from the knowledge base.`
        },
        {
          role: 'user',
          content: `I need you to create an informative Twitter thread about the game Boss Fighters.
          
          Here's what I know about the game: ${gameKnowledge}
          
          IMPORTANT: The thread MUST focus primarily on the specific aspects of the game I mentioned above. This is the main theme for the thread. Use the official knowledge base only to ensure accuracy and proper terminology.
          
          Please create:
          
          1. A funny/shitpost style hook (max 280 characters) - This should be humorous and catch attention with a positive joke or exaggeration about the game, specifically related to what I mentioned. Focus on what I described. Be ENTHUSIASTIC and BULLISH about the game - avoid any negative comments. NO hashtags or emojis.
          
          2. An informative hook (max 280 characters) - This should promise to educate the reader about the specific aspects of the game I mentioned. NO hashtags or emojis.
          
          3. A viral-optimized hook (max 280 characters) - This should create curiosity about the interesting aspects of the game I mentioned. NO hashtags or emojis.
          
          4. A thread body with 5 short parts (each part MUST be under 200 characters). The thread should focus on the specific aspects of Boss Fighters that I mentioned. End with a thoughtful conclusion.
          
          IMPORTANT RULES:
          - The content MUST be centered around what I told you about the game, not just general information
          - Do NOT use any hashtags (e.g., #BossFighters, #Gaming)
          - Do NOT use any emojis
          - Do NOT number the tweets (no "1/" or "2/" at the beginning of each part)
          - Keep all text natural and clean
          - Make sure each part of the thread body is complete and not cut off
          - Keep each thread part SHORT (under 200 characters)
          - Focus on being INFORMATIVE about the game itself, not just strategy tips
          - Be POSITIVE and ENTHUSIASTIC about the game - never criticize or speak negatively about it
          - Use ACCURATE terminology and facts from the official knowledge base
          - Maintain CONSISTENT naming conventions from the official game
          
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
      
      // Generate a call to action and append it to the thread body
      const threadBodyWithCTA = threadBody + generateCallToAction(threadBody, gameKnowledge);
      
      // Add transition sentences to each hook
      const shitpostWithTransition = addTransitionToHook(parsedContent.shitpost || "", "shitpost", threadBody);
      const informativeWithTransition = addTransitionToHook(parsedContent.informative || "", "informative", threadBody);
      const viralWithTransition = addTransitionToHook(parsedContent.viral || "", "viral", threadBody);
      
      // Return the content in the expected format with transitions
      return {
        shitpost: shitpostWithTransition || "Error: Could not generate shitpost hook",
        informative: informativeWithTransition || "Error: Could not generate informative hook",
        viral: viralWithTransition || "Error: Could not generate viral hook",
        threadBody: threadBodyWithCTA || "Error: Could not generate thread body"
      };
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      
      // Try to extract content using regex if JSON parsing fails
      const extractedThreadBody = [
        extractContent(content, 'part1') || "",
        extractContent(content, 'part2') || "",
        extractContent(content, 'part3') || "",
        extractContent(content, 'part4') || "",
        extractContent(content, 'part5') || ""
      ].filter(part => part.length > 0).join('\n\n');
      
      // Generate a call to action and append it to the thread body
      const extractedThreadBodyWithCTA = extractedThreadBody + generateCallToAction(extractedThreadBody, gameKnowledge);
      
      const shitpost = extractContent(content, 'shitpost') || "Error: Could not extract shitpost hook";
      const informative = extractContent(content, 'informative') || "Error: Could not extract informative hook";
      const viral = extractContent(content, 'viral') || "Error: Could not extract viral hook";
      
      // Add transition sentences to each extracted hook
      const shitpostWithTransition = addTransitionToHook(shitpost, "shitpost", extractedThreadBody);
      const informativeWithTransition = addTransitionToHook(informative, "informative", extractedThreadBody);
      const viralWithTransition = addTransitionToHook(viral, "viral", extractedThreadBody);
      
      const extractedContent = {
        shitpost: shitpostWithTransition,
        informative: informativeWithTransition,
        viral: viralWithTransition,
        threadBody: extractedThreadBodyWithCTA
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