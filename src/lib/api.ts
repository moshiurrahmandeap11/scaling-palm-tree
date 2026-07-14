// Thin fetch wrapper around the Express API.
// Automatically attaches the JWT stored in localStorage and parses JSON.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean; // default: true when body or when endpoint requires it
  rawResponse?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = true, rawResponse = false } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (rawResponse) return res as unknown as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }
  }

  if (!res.ok || (data as Record<string, unknown>)?.success === false) {
    const message =
      String((data as Record<string, unknown>)?.message || `Request failed with status ${res.status}`);
    throw new ApiError(message, res.status);
  }

  return data as T;
}

// Convenience helpers
export const api = {
  get: <T = unknown>(path: string, auth = true) =>
    apiFetch<T>(path, { method: "GET", auth }),
  post: <T = unknown>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "POST", body, auth }),
  patch: <T = unknown>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "PATCH", body, auth }),
  del: <T = unknown>(path: string, auth = true) =>
    apiFetch<T>(path, { method: "DELETE", auth }),
};

export { BASE_URL };