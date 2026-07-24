const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getHeaders(customHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.detail || errorMessage;
    } catch {
      // JSON parsing failed, use fallback
    }
    throw new Error(errorMessage);
  }

  // Handle empty or 204 responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: async <T>(endpoint: string, customHeaders: Record<string, string> = {}): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: any, customHeaders: Record<string, string> = {}): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, body: any, customHeaders: Record<string, string> = {}): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, body: any, customHeaders: Record<string, string> = {}): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, customHeaders: Record<string, string> = {}): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse<T>(response);
  },
};
