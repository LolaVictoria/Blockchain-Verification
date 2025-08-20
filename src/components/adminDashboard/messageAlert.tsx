import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useAdminContext } from '../../../context/AdminContext';

const MessageAlert: React.FC = () => {
  const { state, actions } = useAdminContext();
  const { message } = state;

  if (!message) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg flex items-center ${
      message.type === 'success' 
        ? 'bg-green-50 border border-green-200 text-green-800' 
        : 'bg-red-50 border border-red-200 text-red-800'
    }`}>
      {message.type === 'success' ? (
        <CheckCircle2 size={20} className="mr-2 text-green-600" />
      ) : (
        <XCircle size={20} className="mr-2 text-red-600" />
      )}
      <span className="text-sm font-medium">{message.text}</span>
      <button 
        onClick={actions.clearMessage}
        className="ml-auto text-lg font-bold hover:opacity-70"
      >
        ×
      </button>
    </div>
  );
};

export default MessageAlert;