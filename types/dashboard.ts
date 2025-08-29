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
  product_name: string;
  brand: string;
  model: string;
  device_type: string;
  category: string;
  description?: string;
  storage_data?: string;
  color?: string;
  batch_number?: string;
  manufacturer_id: string;
  manufacturer_address: string;
  manufacturer_wallet: string;
  current_owner: string;
  transaction_hash: string;
  registered_at: string;
  updated_at: string;
  verified: boolean;
  ownership_history: OwnershipHistoryEntry[];
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