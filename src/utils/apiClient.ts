const BASE_URL = import.meta.env.VITE_ENDPOINT;

interface ApiResponse {
  data: any;
  status: number;
}

const apiClient = {
  request: async (endpoint: string, method = "GET", body?: Record<string, any>): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
};

export default apiClient;