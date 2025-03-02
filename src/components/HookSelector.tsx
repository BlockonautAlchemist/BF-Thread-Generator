import React from 'react';

interface HookSelectorProps {
  hookOptions: {
    shitpost: string;
    informative: string;
    viral: string;
  };
  selectHook: (hookType: string) => void;
}

const HookSelector: React.FC<HookSelectorProps> = ({ hookOptions, selectHook }) => {
  return (
    <div className="animate-enter">
      <h2 className="text-xl font-bold mb-4 text-custom-purple">Step 2: Choose Your Hook Style</h2>
      <p className="text-gray-300 mb-6">
        Select the opening tweet that best matches your style and audience. This will be the first tweet in your thread.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Informative Hook */}
        <div 
          onClick={() => selectHook('informative')}
          className="stagger-item bg-gray-700 border border-gray-600 hover-elegant hover-primary rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-105 shadow-subtle hw-accelerated"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-custom-purple">Informative Style</h3>
            <span className="bg-gradient-accent text-xs px-2 py-1 rounded-full text-white">Educational</span>
          </div>
          <p className="text-gray-300 mb-4 text-sm">
            Clear value proposition with educational tone. Perfect for sharing insights.
          </p>
          <div className="bg-gray-800 rounded p-3 border-l-4 border-custom-cyan">
            {hookOptions.informative}
          </div>
        </div>
        
        {/* Viral Hook */}
        <div 
          onClick={() => selectHook('viral')}
          className="stagger-item bg-gray-700 border border-gray-600 hover-elegant hover-primary rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-105 shadow-subtle hw-accelerated"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-custom-purple">Viral Style</h3>
            <span className="bg-gradient-accent text-xs px-2 py-1 rounded-full text-white">Attention-grabbing</span>
          </div>
          <p className="text-gray-300 mb-4 text-sm">
            Results-focused with curiosity gap. Designed to maximize engagement and grab attention.
          </p>
          <div className="bg-gray-800 rounded p-3 border-l-4 border-custom-purple">
            {hookOptions.viral}
          </div>
        </div>
        
        {/* Shitpost Hook */}
        <div 
          onClick={() => selectHook('shitpost')}
          className="stagger-item bg-gray-700 border border-gray-600 hover-elegant hover-primary rounded-lg p-4 cursor-pointer transition-all hover:transform hover:scale-105 shadow-subtle hw-accelerated"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-custom-purple">Shitpost Style</h3>
            <span className="bg-gradient-accent text-xs px-2 py-1 rounded-full text-white">Humorous</span>
          </div>
          <p className="text-gray-300 mb-4 text-sm">
            Funny, exaggerated, and meme-worthy. Great for engaging a casual audience.
          </p>
          <div className="bg-gray-800 rounded p-3 border-l-4 border-custom-gold">
            {hookOptions.shitpost}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 italic animate-enter animate-enter-delay-3">
        Click on any hook style to select it and continue to the final step.
      </p>
    </div>
  );
};

export default HookSelector;