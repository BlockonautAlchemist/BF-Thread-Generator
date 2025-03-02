# Boss Fighters Thread Generator

A web application that generates Twitter thread content about the game Boss Fighters using AI.

## Features

- Generate three different types of Twitter hooks:
  - Funny/shitpost style
  - Informative
  - Viral-optimized
- Create a complete thread body with informative content
- Customize the content based on your knowledge of the game
- **NEW**: Knowledge base integration for accurate game information

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

## Knowledge Base Integration

The application now includes a knowledge base system that ensures all generated content is accurate and consistent with the official game information.

### How the Knowledge Base Works

1. The knowledge base is stored in a Markdown file (`public/knowledge/BossFightersWiki_ChunksMD.md`)
2. When generating content, the system:
   - Analyzes the user's input to identify relevant game topics
   - Retrieves accurate information from the knowledge base
   - Provides this information to the AI model to ensure factual accuracy
   - Maintains consistent terminology and naming conventions

### Updating the Knowledge Base

As new game content is released, you can update the knowledge base:

1. Manually edit the `public/knowledge/BossFightersWiki_ChunksMD.md` file
2. Update the version number using the provided script:
   ```
   npm run update-kb 1.0.1
   ```
   (Replace `1.0.1` with the new version number)

3. The version and last updated date will be automatically updated

### Knowledge Base Structure

The knowledge base is organized into chunks, each containing specific information about the game:
- Game Overview
- Gameplay Highlights
- Boss Gameplay
- Fighter Gameplay
- Technology Requirements
- Economy System
- And more

Each chunk is separated by a delimiter and contains structured information that the AI can reference when generating content.

## Technologies Used

- React
- TypeScript
- Vite
- OpenRouter API (accessing Claude 3.7 Sonnet)
- Tailwind CSS
- Knowledge Base System

## Note on API Usage

This application requires an OpenRouter API key to function. API usage may incur costs depending on your OpenRouter plan.

## Deployment

### GitHub Pages Deployment

This application is configured for deployment to GitHub Pages. To deploy:

1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the sidebar
4. Under "Build and deployment", select:
   - Source: "GitHub Actions"
5. The workflow will automatically build and deploy your site

The GitHub Actions workflow will:
1. Install dependencies
2. Build the application with the correct base path
3. Deploy the built files to GitHub Pages

After deployment, your site will be available at `https://[your-username].github.io/[repository-name]/`

### Troubleshooting Deployment

If you see a blank white screen after deployment:
- Check browser console for errors
- Ensure all paths in the code are relative (starting with `./`) rather than absolute (starting with `/`)
- Verify that the knowledge base file is correctly included in the build

## License

MIT
