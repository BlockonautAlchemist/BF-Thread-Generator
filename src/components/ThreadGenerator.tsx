import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ThreadGeneratorProps {
  gameKnowledge: string;
  setGameKnowledge: (value: string) => void;
  generateHooks: () => void;
  isLoading: boolean;
}

const ThreadGenerator: React.FC<ThreadGeneratorProps> = ({ 
  gameKnowledge, 
  setGameKnowledge, 
  generateHooks,
  isLoading
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-custom-purple">Step 1: Share Your Boss Fighters Knowledge</h2>
      <p className="text-gray-300 mb-4">
        Input your knowledge about Boss Fighters (game mechanics, perks, economy, strategies, etc.).
        The more specific details you provide, the better your thread will be!
      </p>
      
      <div className="mb-4">
        <textarea
          value={gameKnowledge}
          onChange={(e) => setGameKnowledge(e.target.value)}
          placeholder="Example: Boss Fighters has a unique economy system where players earn credits by defeating minions. These credits can be spent on perks that enhance your character's abilities. The most effective strategy I've found is to focus on agility perks early game..."
          className="w-full h-64 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-custom-purple focus:ring-1 focus:ring-custom-purple"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={generateHooks}
          disabled={!gameKnowledge.trim() || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            gameKnowledge.trim() && !isLoading
              ? 'bg-custom-purple hover:opacity-90 text-white' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              Generate Hook Options <Send size={18} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThreadGenerator;