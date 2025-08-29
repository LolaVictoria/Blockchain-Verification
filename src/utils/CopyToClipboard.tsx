import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from './helper';

interface CopyableTextProps {
  text: string;
  displayText?: string;
  className?: string;
  successMessage: string;
  showFullText?: boolean;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  displayText,
  className = '',
  successMessage,
  showFullText = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text, successMessage);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateText = (str: string, maxLength: number = 20) => {
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
  };

  return (
    <div className="relative inline-block">
      <code 
        className={`text-xs bg-gray-200 px-2 py-1 pr-8 rounded font-mono border border-gray-300 ${className}`}
      >
        {displayText || (showFullText ? text : truncateText(text))}
      </code>
      <button
        onClick={handleCopy}
        className={`absolute top-1 right-1 p-1 rounded transition-all duration-200 ${
          copied 
            ? 'bg-green-100 text-green-600' 
            : 'hover:bg-gray-300 text-gray-600 hover:text-gray-800'
        }`}
        title={copied ? 'Copied!' : `Copy ${successMessage?.toLowerCase() || 'text'}`}
      >
        {copied ? (
          <Check size={12} />
        ) : (
          <Copy size={12} />
        )}
      </button>
    </div>
  );
};