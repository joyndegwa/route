const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface ApiResponse<T> {
  data?: T;
  error?: { message: string };
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${BACKEND_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: undefined,
        error: data.error || { message: "Request failed" },
      };
    }

    return { data };
  } catch (error) {
    return {
      data: undefined,
      error: {
        message: error instanceof Error ? error.message : "Network error",
      },
    };
  }
}

export async function registerUser(email: string, password: string) {
  return apiCall("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  return apiCall("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
