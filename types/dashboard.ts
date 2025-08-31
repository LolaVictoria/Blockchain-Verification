export interface OwnershipHistoryEntry {
  owner_address: string;
  owner_type: 'manufacturer' | 'customer';
  previous_owner: string;
  new_owner: string
  transfer_date: string;
  transfer_type: string;
  transaction_hash?: string;
  sale_price?: number;
  notes?: string;
}

export interface Product {
  _id?: string;
  serial_number: string;
  product_name?: string; // Made optional since you're using 'name'
  name?: string; // Added this field since your data uses 'name'
  brand: string;
  model: string;
  device_type: string;
  category: string;
  description?: string;
  storage_data?: string;
  color?: string;
  batch_number?: string;
  manufacturer_id: string;
  manufacturer_name?: string; // Added from your data
  manufacturer_address?: string; // Made optional since it might not always be present
  manufacturer_wallet: string;
  wallet_address?: string; // Added from your data
  current_owner?: string; // Made optional since we derive this from ownership_history
  transaction_hash?: string; // Made optional since you might use specification_hash instead
  specification_hash?: string; // Added from your data
  registration_type: string;
  registered_at: string;
  created_at?: string; // Added from your data
  updated_at: string;
  verified?: boolean; // Made optional since you use blockchain_verified
  blockchain_verified?: boolean; // Added from your data
  ownership_history: OwnershipHistoryEntry[];
  
  // Blockchain-related fields from your data
  block_number?: number;
  gas_price?: string;
  gas_used?: number;
}

export interface DashboardStats {
  total_products: number;
  blockchain_products: number;
  pending_products: number;
  total_verifications: number;
}

export interface ProductFormData {
  serial_number: string;
  brand: string;
  model: string;
  device_type: string;
  storage_data?: string;
  color?: string;
  batch_number?: string;
}

export interface TransferFormData {
  serial_number: string,
  previous_owner: string,
  new_owner: string,
  transfer_reason: string,
  notes: string
}


export interface BlockchainConfig {
  CHAIN_ID: number;
  CONTRACT_ADDRESS: string;
  WALLET_ADDRESS: string;
  CONTRACT_ABI: any[];
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  web3: any;
  contract: any;
  isAuthorized: boolean;
}

export type FilterType = 'all' | 'blockchain_confirmed' | 'blockchain_pending' | 'blockchain_failed';

export interface TransactionStatus {
  isVisible: boolean;
  message: string;
  type: 'loading' | 'success' | 'error';
}