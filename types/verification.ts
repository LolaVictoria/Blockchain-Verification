// types/verification.ts
export interface VerificationResult {
  authentic: boolean;
  serialNumber: string;
  brand?: string;
  model?: string;
  deviceType?: string;
  storage?: string;
  storageData?: string;
  color?: string;
  manufacturerName?: string;
  confidence?: number;
  blockchain_verified?: boolean;
  blockchain_proof?: BlockchainProof;
  source?: 'blockchain' | 'database' | 'not_found';
  message?: string;
  verification_timestamp?: string;
  registered_at?: string;
  created_at?: string;
  transaction_hash?: string;
}

export interface BlockchainProof {
  network?: string;
  contract_address?: string;
  explorer_links?: {
    transaction?: string;
    contract?: string;
  };
}

export interface BatchVerificationRequest {
  serialNumbers: string[];
}

export interface BatchVerificationResult {
  results: VerificationResult[];
  total_verified: number;
  total_checked: number;
}

export interface SampleData {
  authentic?: {
    blockchain?: string[];
    database?: string[];
  };
  counterfeit?: string[];
}

export interface OwnershipRecord {
  from?: string;
  to?: string;
  previous_owner?: string;
  new_owner?: string;
  transfer_date?: string;
  date?: string;
  transfer_reason?: string;
  reason?: string;
  transaction_hash?: string;
}

export interface OwnershipHistory {
  history: OwnershipRecord[];
  serialNumber: string;
}

export interface DeviceDetails extends VerificationResult {
  device_type?: string;
  storage_data?: string;
  manufacturer_name?: string;
  registration_type?: string;
  serial_number?: string;
}

export interface VerificationLogRequest {
  serial_number: string;
  authentic: boolean;
  timestamp: string;
  user_agent: string;
}