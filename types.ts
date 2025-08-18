// Types
export interface User {
  id: string;
  email: string;
  role: 'manufacturer' | 'developer';
  wallet_address?: string;
  created_at: string;
}

export interface Product {
  _id?: string;
  serial_number: string;
  product_name: string;
  category: string;
  description?: string;
  manufacturer_id: string;
  manufacturer_address: string;
  blockchain_tx_hash: string;
  registered_at: string;
  verified: boolean;
}

export interface ApiKey {
  _id: string;
  label: string;
  masked_key: string;
  created_at: string;
  last_used?: string;
  usage_count: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: string, walletAddress?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}