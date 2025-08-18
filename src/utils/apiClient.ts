// src/utils/apiClient.ts
const BASE_URL = import.meta.env.VITE_ENDPOINT// your deployed backend URL

interface ApiResponse {
  data: any;
  status: number;
}

const apiClient = {
  request: async (endpoint: string, method = "GET", body?: Record<string, any>): Promise<ApiResponse> => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    return { data, status: res.status };
  },
};

export default apiClient;
