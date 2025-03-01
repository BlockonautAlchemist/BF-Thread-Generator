import React from 'react';
import XLogo from './XLogo';

const AdvantagesSection: React.FC = () => {
  return (
    <section className="bg-gray-800/50 rounded-lg p-5 border-t border-gray-700 mt-6">
      <h3 className="text-lg font-medium text-custom-purple mb-3">Why we're better than ChatGPT</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start">
          <div className="bg-custom-purple/20 p-1 rounded mr-2 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-purple"/>
            </svg>
          </div>
          <p className="text-gray-300">
            Trained specifically on top performing <XLogo className="inline mx-1" size={12} /> posts
          </p>
        </div>
        
        <div className="flex items-start">
          <div className="bg-custom-purple/20 p-1 rounded mr-2 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-purple"/>
            </svg>
          </div>
          <p className="text-gray-300">
            No generic AI tone or overused hashtags/emojis
          </p>
        </div>
        
        <div className="flex items-start">
          <div className="bg-custom-purple/20 p-1 rounded mr-2 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-purple"/>
            </svg>
          </div>
          <p className="text-gray-300">
            Authentic player voice that resonates with the community
          </p>
        </div>
        
        <div className="flex items-start">
          <div className="bg-custom-purple/20 p-1 rounded mr-2 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-custom-purple"/>
            </svg>
          </div>
          <p className="text-gray-300">
            Purpose-built for Boss Fighters content
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection; 