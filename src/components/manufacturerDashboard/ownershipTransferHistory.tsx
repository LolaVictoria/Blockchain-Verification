import React from 'react';
import LoadingSpinner from "../layout/loadingSpinner";
import { CopyableText } from '../../utils/CopyToClipboard';
import VerificationResultCard from './verificationResultCard';

// OwnershipHistoryModal.tsx
interface OwnershipHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serialNumber: string;
  ownershipHistory: any[];
  loading?: boolean;
  ownershipModal: any;
}

export const OwnershipHistoryModal: React.FC<OwnershipHistoryModalProps> = ({
  isOpen,
  onClose,
  serialNumber,
  ownershipHistory,
  loading = false, 
  ownershipModal
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl h-[95vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Ownership History</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-5xl font-bold p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <LoadingSpinner message="Loading ownership history..." />
          ) : ownershipModal.history.length > 0 ? (
            <div>
              <h4 className="font-bold mb-4 text-gray-800">Serial Number: {serialNumber}</h4>
              <div className="space-y-4">
                {ownershipHistory.map((record, index) => {
                  const date = new Date(record.transfer_date || record.date || '').toLocaleDateString();
                  return (
                    <div key={index} className="relative pl-8 pb-4">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="mb-2"><strong>From:</strong> {record.from || record.previous_owner || '_'}</p>
                        <p className="mb-2"><strong>To:</strong> {record.to || record.new_owner || 'Unknown'}</p>
                        <p className="mb-2"><strong>Date:</strong> {date}</p>
                        <p className="mb-2"><strong>Note:</strong> {record.transfer_reason || record.reason || 'Ownership Transfer'}</p>
                        {record.transaction_hash && (
                          <p>
                            <strong>Transaction:</strong>{' '}
                            <CopyableText
                              text={record.transaction_hash}
                              className="text-xs bg-gray-200 px-2 py-1 rounded font-mono border border-transparent"
                              successMessage="Transaction Hash to clipboard!"
                            />
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <VerificationResultCard type="not-found">
              <h4 className="font-bold">No Ownership History</h4>
              <p>No ownership transfers found for this device.</p>
              <p>This device may still be with the original manufacturer.</p>
            </VerificationResultCard>
          )}
        </div>
      </div>
    </div>
  );
};