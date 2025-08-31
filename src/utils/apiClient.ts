import axios, { type AxiosResponse, AxiosError, type AxiosRequestConfig } from 'axios';

// Update the BASE_URL to use the proxy in development
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return '/api'; // Use proxy in development
  }
  return import.meta.env.VITE_BASE_URL || 'https://product-verification-blockchain.onrender.com';
};

const BASE_URL = getBaseURL();
// Your original interface - preserved exactly as is
interface ApiResponse {
  data: any;
  status: number;
}

// Enhanced interface for new TypeScript usage
export interface TypedApiResponse<T = any> {
  data: T;
  status: number;

}

export interface ApiError {
  message: string;
  status?: number;
  error?: string;
}

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  withCredentials: false, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

       // Ensure Content-Type is set
        if (!config.headers['Content-Type'] && config.method !== 'get') {
          config.headers['Content-Type'] = 'application/json';
        }
        
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`
        });
        
        return config;
      },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
);

// Response interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response as-is for successful requests
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.code === 'ERR_NETWORK') {
      console.error('CORS or network error:', error);
    } else if (error.response) {
      // Server responded with error status
      console.error(`HTTP ${error.response.status} Error:`, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Main API client object
const apiClient = {
  // Core request method - handles all HTTP methods
  request: async <T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body?: Record<string, any> | null,
    headers?: Record<string, any>
  ): Promise<TypedApiResponse<T>> => {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: endpoint,
        data: body,
        headers: headers ? { ...headers } : undefined,
      };

      const response = await axiosInstance.request<T>(config);
      
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error(`API Error for ${method} ${endpoint}:`, error);
      
      // Re-throw with enhanced error info
      if (axios.isAxiosError(error)) {
        // Create a proper error object that matches your expected structure
        const enhancedError = new Error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          error.message || 
          'Request failed'
        ) as any;
        
        // Add status and additional properties
        enhancedError.status = error.response?.status;
        enhancedError.response = error.response;
        enhancedError.data = error.response?.data;
        
        throw enhancedError;
      }
      throw error;
    }
  },

  // Convenience methods with proper typing
  get: <T = any>(
    endpoint: string, 
    headers?: Record<string, any>
  ): Promise<TypedApiResponse<T>> => {
    return apiClient.request<T>(endpoint, 'GET', null, headers);
  },

  post: <T = any>(
    endpoint: string, 
    body?: Record<string, any>, 
    headers?: Record<string, any>
  ): Promise<TypedApiResponse<T>> => {
    return apiClient.request<T>(endpoint, 'POST', body, headers);
  },

  put: <T = any>(
    endpoint: string, 
    body?: Record<string, any>, 
    headers?: Record<string, any>
  ): Promise<TypedApiResponse<T>> => {
    return apiClient.request<T>(endpoint, 'PUT', body, headers);
  },

  patch: <T = any>(
    endpoint: string, 
    body?: Record<string, any>, 
    headers?: Record<string, any>
  ): Promise<TypedApiResponse<T>> => {
    return apiClient.request<T>(endpoint, 'PATCH', body, headers);
  },

  delete: <T = any>(
    endpoint: string, 
    headers?: Record<string, any>
  ): Promise<TypedApiResponse<T>> => {
    return apiClient.request<T>(endpoint, 'DELETE', null, headers);
  },

  // Legacy compatibility - returns original ApiResponse format
  requestLegacy: async (
    endpoint: string,
    method: string,
    body?: Record<string, any> | null,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const response = await apiClient.request(endpoint, method as any, body, headers);
    return {
      data: response.data,
      status: response.status
    };
  },

  // Utility methods
  setBaseURL: (url: string) => {
    axiosInstance.defaults.baseURL = url;
  },

  setTimeout: (timeout: number) => {
    axiosInstance.defaults.timeout = timeout;
  },

  // Direct access to axios instance for advanced usage
  getInstance: () => axiosInstance
};

// Export both the client and the axios instance
export { axiosInstance };
export default apiClient;