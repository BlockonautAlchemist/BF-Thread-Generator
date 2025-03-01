import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface FinalThreadProps {
  selectedHook: string;
  threadBody: string;
}

const FinalThread: React.FC<FinalThreadProps> = ({ selectedHook, threadBody }) => {
  const [copied, setCopied] = useState(false);
  
  const fullThread = `${selectedHook}\n\n${threadBody}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullThread);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Split thread body into individual paragraphs
  const threadParagraphs = threadBody.split('\n\n');
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-custom-purple">Step 3: Your Generated Thread</h2>
      <p className="text-gray-300 mb-6">
        Here's your complete thread ready to be posted. You can copy it to your clipboard with one click.
      </p>
      
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-inner">
          {/* Thread Content */}
          <div className="space-y-6">
            {/* Hook */}
            <div className="border-l-4 border-custom-purple pl-4 py-1">
              <p className="text-white font-medium text-lg">{selectedHook}</p>
            </div>
            
            {/* Thread Body */}
            <div className="space-y-4 mt-6 text-gray-300">
              {threadParagraphs.map((paragraph, index) => (
                <p key={index} className={`${index === 0 ? 'text-white' : 'text-gray-300'}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        <button
          onClick={copyToClipboard}
          className="flex items-center bg-custom-purple hover:opacity-90 px-6 py-3 rounded-lg font-medium transition-colors text-white"
        >
          {copied ? (
            <>
              <Check size={18} className="mr-2" /> Copied to Clipboard
            </>
          ) : (
            <>
              <Copy size={18} className="mr-2" /> Copy Thread to Clipboard
            </>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-400 text-center italic">
        Remember to add relevant images and engage with replies to maximize visibility!
      </p>
    </div>
  );
};

export default FinalThread;