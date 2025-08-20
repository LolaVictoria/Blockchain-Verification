const BASE_URL = import.meta.env.VITE_ENDPOINT;

// Your original interface - preserved exactly as is
interface ApiResponse {
  // error: string;
  data: any;
  status: number;
}

// Enhanced interface for new TypeScript usage (optional)
export interface TypedApiResponse<T = any> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  error?: string;
}

const apiClient = {
  request: async (
    endpoint: string, 
    method = "GET", 
    body?: Record<string, any> | null, // Fixed: removed p0: null, made body optional
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers, // Allow additional headers to be passed
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        // If response isn't JSON, get it as text
        const text = await res.text();
        console.error("Non-JSON response:", text);
        data = { error: "Invalid JSON response", raw: text };
      }

      if (!res.ok) {
        console.error(`HTTP ${res.status} Error:`, data);
      }

      return { data, status: res.status };
    } catch (networkError) {
      console.error("Network error:", networkError);
      throw networkError;
    }
  },

  // Additional convenience methods (fixed to use correct parameters)
  get: <T = any>(endpoint: string): Promise<TypedApiResponse<T>> => {
    return apiClient.request(endpoint, 'GET') as Promise<TypedApiResponse<T>>;
  },

  post: <T = any>(endpoint: string, body?: Record<string, any>): Promise<TypedApiResponse<T>> => {
    return apiClient.request(endpoint, 'POST', body) as Promise<TypedApiResponse<T>>;
  },

  put: <T = any>(endpoint: string, body?: Record<string, any>): Promise<TypedApiResponse<T>> => {
    return apiClient.request(endpoint, 'PUT', body) as Promise<TypedApiResponse<T>>;
  },

  delete: <T = any>(endpoint: string): Promise<TypedApiResponse<T>> => {
    return apiClient.request(endpoint, 'DELETE') as Promise<TypedApiResponse<T>>;
  },
};

export default apiClient;