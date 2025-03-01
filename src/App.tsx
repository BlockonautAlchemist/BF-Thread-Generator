import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Twitter } from 'lucide-react';
import ThreadGenerator from './components/ThreadGenerator';
import HookSelector from './components/HookSelector';
import FinalThread from './components/FinalThread';
import TipsSection from './components/TipsSection';
// @ts-ignore
import { generateThreadContent } from './services/openRouterService';

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
  
  const generateHooks = async () => {
    if (!gameKnowledge.trim()) return;
    
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-custom-purple p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-custom-purple flex items-center">
            <Twitter className="mr-2" />
            Boss Fighters Thread Generator
          </h1>
          <button 
            onClick={resetForm}
            className="flex items-center bg-custom-purple hover:opacity-90 px-3 py-1 rounded-md text-sm transition-colors text-white"
          >
            <RefreshCw size={16} className="mr-1" /> New Thread
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={goBack} 
              disabled={step === 1}
              className={`flex items-center ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-custom-purple hover:text-gray-300'}`}
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            <div className="text-sm text-gray-400">Step {step} of 3</div>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div 
              className="bg-custom-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {step === 1 && (
            <ThreadGenerator 
              gameKnowledge={gameKnowledge} 
              setGameKnowledge={setGameKnowledge} 
              generateHooks={generateHooks}
              isLoading={isLoading}
            />
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
      <footer className="bg-gray-800 border-t border-custom-purple p-4 mt-auto">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          © 2025 Boss Fighters Thread Generator | Create engaging threads to share your gaming insights
        </div>
      </footer>
    </div>
  );
}

export default App;