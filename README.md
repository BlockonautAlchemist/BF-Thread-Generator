# Boss Fighters Thread Generator

A web application that generates Twitter thread content about the game Boss Fighters using AI.

## Features

- Generate three different types of Twitter hooks:
  - Funny/shitpost style
  - Informative
  - Viral-optimized
- Create a complete thread body with informative content
- Customize the content based on your knowledge of the game

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to a new file called `.env`
   - Get an API key from [OpenRouter](https://openrouter.ai/)
   - Add your API key to the `.env` file:
     ```
     VITE_OPENROUTER_API_KEY=your_actual_api_key_here
     ```

4. Start the development server:
   ```
   npm run dev
   ```

## How It Works

The application uses the OpenRouter API to access Claude 3.7 Sonnet (and other AI models as fallbacks) to generate creative and informative Twitter thread content about Boss Fighters.

1. Enter what you know about the game in the text area
2. Click "Generate Hooks" to create three different hook options
3. Select your favorite hook
4. View and copy your complete Twitter thread

## Technologies Used

- React
- TypeScript
- Vite
- OpenRouter API (accessing Claude 3.7 Sonnet)
- Tailwind CSS

## Note on API Usage

This application requires an OpenRouter API key to function. API usage may incur costs depending on your OpenRouter plan.

## License

MIT # BF-Thread-Generator
