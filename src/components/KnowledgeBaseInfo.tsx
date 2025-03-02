import React, { useEffect, useState } from 'react';
import knowledgeBaseService from '../services/knowledgeBaseService';

interface KnowledgeBaseInfoProps {
  className?: string;
}

const KnowledgeBaseInfo: React.FC<KnowledgeBaseInfoProps> = ({ className = '' }) => {
  const [version, setVersion] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadVersionInfo = async () => {
      try {
        const versionInfo = await knowledgeBaseService.getVersionInfo();
        setVersion(versionInfo.version);
        setLastUpdated(versionInfo.lastUpdated);
      } catch (error) {
        console.error('Failed to load knowledge base version info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVersionInfo();
  }, []);
  
  if (isLoading) {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        Loading knowledge base info...
      </div>
    );
  }
  
  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      Knowledge Base: v{version} (Updated: {lastUpdated})
    </div>
  );
};

export default KnowledgeBaseInfo; 