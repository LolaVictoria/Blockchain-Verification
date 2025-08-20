import { useState } from 'react';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import type { ApiKey } from '../../../types';


// const ApiKeyDisplay: React.FC<ApiKeyDisplayProps> = ({ apiKey }) => {
//   const [showKey, setShowKey] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const toggleVisibility = () => {
//     setShowKey(!showKey);
//   };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(apiKey.full_key || apiKey.key);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy: ', err);
//     }
//   };

//   const displayValue = showKey ? (apiKey.full_key || apiKey.key) : '•'.repeat(12);

//   return (
//     <div className="mb-3">
//       <div className="relative">
//         <code className="block p-2 pr-20 bg-gray-50 border rounded text-sm font-mono break-all">
//           {displayValue}
//         </code>
        
//         {/* Action buttons container */}
//         <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
//           {/* Toggle visibility button */}
//           <button
//             onClick={toggleVisibility}
//             className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
//             title={showKey ? 'Hide API key' : 'Show API key'}
//           >
//             {showKey ? (
//               <EyeOff className="h-4 w-4" />
//             ) : (
//               <Eye className="h-4 w-4" />
//             )}
//           </button>
          
//           {/* Copy button */}
//           <button
//             onClick={copyToClipboard}
//             className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
//             title="Copy API key"
//           >
//             {copied ? (
//               <Check className="h-4 w-4 text-green-600" />
//             ) : (
//               <Copy className="h-4 w-4" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
const InlineApiKeyDisplay: React.FC<{ apiKey: ApiKey }> = ({ apiKey }) => {
  const [showKey, setShowKey] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const toggleVisibility = (): void => {
    setShowKey(!showKey);
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(apiKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const displayValue: string = showKey ? (apiKey.key) : '•'.repeat(32);

  return (
    <div className="flex items-center space-x-2 min-w-0">
      <code className="flex-1 p-2 bg-gray-50 border rounded text-black text-xs font-mono truncate">
        {displayValue}
      </code>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          onClick={toggleVisibility}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          title={showKey ? 'Hide API key' : 'Show API key'}
          type="button"
        >
          {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </button>
        <button
          onClick={copyToClipboard}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          title="Copy API key"
          type="button"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  );
};
export default InlineApiKeyDisplay;   