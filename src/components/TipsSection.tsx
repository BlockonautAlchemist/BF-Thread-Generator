import React from 'react';
import { Image, MessageCircle, Clock, Lightbulb } from 'lucide-react';

const TipsSection: React.FC = () => {
  const tips = [
    {
      icon: <Image className="text-custom-purple" />,
      title: "Add Visual Content",
      description: "Include screenshots or images throughout your thread, especially with the hook tweet. Visual content increases engagement by up to 150%."
    },
    {
      icon: <Lightbulb className="text-custom-purple" />,
      title: "Personalize Your Language",
      description: "Match your authentic tone and voice. Readers can tell when you're being genuine, and they'll connect more with your content."
    },
    {
      icon: <Clock className="text-custom-purple" />,
      title: "Post at Peak Times",
      description: "Share when Boss Fighters players are most active - typically weekday evenings and weekend afternoons in your target audience's timezone."
    },
    {
      icon: <MessageCircle className="text-custom-purple" />,
      title: "Engage With Replies",
      description: "Respond to comments on your thread to boost visibility. The algorithm favors threads with active discussions."
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center text-custom-purple">
        <Lightbulb className="mr-2" /> Tips for Maximizing Engagement
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="bg-gray-700 border border-gray-600 hover:border-custom-purple rounded-lg p-4 transition-colors">
            <div className="flex items-center mb-3">
              {tip.icon}
              <h3 className="font-bold ml-2 text-white">{tip.title}</h3>
            </div>
            <p className="text-gray-300 text-sm">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsSection;