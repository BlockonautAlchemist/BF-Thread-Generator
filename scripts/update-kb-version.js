#!/usr/bin/env node

/**
 * Simple script to update the knowledge base version
 * Usage: node update-kb-version.js [version]
 * Example: node update-kb-version.js 1.0.1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the knowledge base file
const kbPath = path.join(__dirname, '../public/knowledge/BossFightersWiki_ChunksMD.md');

// Get the new version from command line arguments
const newVersion = process.argv[2];
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

if (!newVersion) {
  console.error('Please provide a version number.');
  console.error('Usage: node update-kb-version.js [version]');
  console.error('Example: node update-kb-version.js 1.0.1');
  process.exit(1);
}

try {
  // Read the knowledge base file
  const data = fs.readFileSync(kbPath, 'utf8');
  
  // Check if the file already has metadata
  const hasMetadata = data.includes('**Version:') && data.includes('**Last Updated:');
  
  let updatedContent;
  
  if (hasMetadata) {
    // Update existing metadata
    updatedContent = data
      .replace(/\*\*Version:\s*([\d\.]+)\*\*/, `**Version: ${newVersion}**`)
      .replace(/\*\*Last Updated:\s*([\d\-]+)\*\*/, `**Last Updated: ${today}**`);
  } else {
    // Add metadata at the beginning of the file
    const metadata = `**Version: ${newVersion}**\n**Last Updated: ${today}**\n\n`;
    updatedContent = metadata + data;
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(kbPath, updatedContent, 'utf8');
  
  console.log(`Knowledge base updated to version ${newVersion} (${today})`);
} catch (err) {
  console.error('Error updating knowledge base:', err);
  process.exit(1);
} 