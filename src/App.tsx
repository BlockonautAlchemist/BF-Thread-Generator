import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ThreadGenerator from './components/ThreadGenerator';
import HookSelector from './components/HookSelector';
import FinalThread from './components/FinalThread';
import TipsSection from './components/TipsSection';
import XLogo from './components/XLogo';
import AdvantagesSection from './components/AdvantagesSection';
import KnowledgeBaseInfo from './components/KnowledgeBaseInfo';
// @ts-ignore
import { generateThreadContent, hasApiKey, setApiKey } from './services/openRouterService';

function App() {
  const [step, setStep] = useState(1);
  const [gameKnowledge, setGameKnowledge] = useState('');
  const [selectedHook, setSelectedHook] = useState('');
  const [hookOptions, setHookOptions] = useState({
    shitpost: '',
    informative: '',
    viral: ''
  });
  const [threadBody, setThreadBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKeyState] = useState('');
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  
  // Check if API key is available on component mount
  useEffect(() => {
    setShowApiKeyForm(!hasApiKey());
  }, []);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setShowApiKeyForm(false);
      setError('');
    }
  };
  
  const generateHooks = async () => {
    if (!gameKnowledge.trim()) return;
    
    // Check if API key is available
    if (!hasApiKey()) {
      setShowApiKeyForm(true);
      setError('OpenRouter API key is required to generate content.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call the OpenRouter API with Claude 3.5 Sonnet
      const response = await generateThreadContent(gameKnowledge);
      
      // Check if we have valid content
      if (response) {
        setHookOptions({
          shitpost: response.shitpost,
          informative: response.informative,
          viral: response.viral
        });
        setThreadBody(response.threadBody);
        setStep(2);
      } else {
        throw new Error('Failed to generate content');
      }
    } catch (err: any) {
      console.error('Error generating hooks:', err);
      let errorMessage = 'Failed to generate content. Please try again or check your API key.';
      
      if (err.message) {
        errorMessage += ` Error: ${err.message}`;
      }
      
      // If we get a 401 error, show the API key form
      if (err.response && err.response.status === 401) {
        setShowApiKeyForm(true);
        errorMessage = 'Invalid API key. Please enter a valid OpenRouter API key.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const selectHook = (hookType: string) => {
    setSelectedHook(hookOptions[hookType as keyof typeof hookOptions]);
    setStep(3);
  };

  const resetForm = () => {
    setStep(1);
    setGameKnowledge('');
    setSelectedHook('');
    setHookOptions({
      shitpost: '',
      informative: '',
      viral: ''
    });
    setThreadBody('');
    setError('');
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary text-white">
      {/* Header */}
      <header className="bg-custom-darker border-b border-custom-purple p-4 shadow-layered">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-custom-purple flex items-center animate-enter">
            <XLogo className="mr-2 text-custom-purple" size={24} />
            Boss Fighters Thread Generator
          </h1>
          <button 
            onClick={resetForm}
            className="btn-primary btn-micro flex items-center hover:bg-opacity-90 px-3 py-1 rounded-md text-sm transition-colors text-white animate-enter animate-enter-delay-1"
          >
            <RefreshCw size={16} className="mr-1" /> New Thread
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Progress Indicator */}
        <div className="mb-8 animate-enter">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={goBack} 
              disabled={step === 1}
              className={`flex items-center transition-all duration-250 ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-custom-purple hover:text-custom-cyan hover:-translate-y-0.5'}`}
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            <div className="text-sm text-gray-400">Step {step} of 3</div>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-accent h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6 animate-enter shadow-subtle">
            <p>{error}</p>
          </div>
        )}
        
        {/* API Key Form */}
        {showApiKeyForm && (
          <div className="card-modern bg-gray-800 rounded-lg shadow-layered p-6 mb-8 animate-enter">
            <h2 className="text-xl font-bold mb-4 text-custom-purple">Enter OpenRouter API Key</h2>
            <p className="text-gray-300 mb-4">
              This app requires an OpenRouter API key to generate content. Your key is stored locally in your browser and never sent to our servers.
            </p>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKeyState(e.target.value)}
                  className="input-modern w-full"
                  placeholder="sk-or-..."
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="btn-primary w-full py-2 px-4 rounded-md font-medium"
                >
                  Save API Key
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Don't have an API key? <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-custom-cyan hover:text-custom-gold hover:underline transition-colors duration-250">Get one from OpenRouter</a>
              </p>
            </form>
          </div>
        )}

        {/* Step Content */}
        <div className="card-modern bg-gray-800 rounded-lg shadow-layered p-6 mb-8 animate-enter">
          {step === 1 && (
            <>
              <ThreadGenerator 
                gameKnowledge={gameKnowledge} 
                setGameKnowledge={setGameKnowledge} 
                generateHooks={generateHooks}
                isLoading={isLoading}
              />
              <AdvantagesSection />
            </>
          )}
          
          {step === 2 && (
            <HookSelector 
              hookOptions={hookOptions} 
              selectHook={selectHook} 
            />
          )}
          
          {step === 3 && (
            <FinalThread 
              selectedHook={selectedHook} 
              threadBody={threadBody} 
            />
          )}
        </div>

        {/* Tips Section (only shown on final step) */}
        {step === 3 && <TipsSection />}
      </main>

      {/* Footer */}
      <footer className="bg-custom-darker border-t border-custom-purple p-4 mt-auto shadow-layered">
        <div className="container mx-auto text-center">
          <div className="text-gray-400 text-sm mb-1 animate-enter">
            © 2025 Boss Fighters Thread Generator | Create engaging threads to share your gaming insights
          </div>
          <KnowledgeBaseInfo className="text-center animate-enter animate-enter-delay-1" />
        </div>
      </footer>
    </div>
  );
}

export default App;