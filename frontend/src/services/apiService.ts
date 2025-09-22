export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic API caller with optional RequestInit
export default async function apiCall<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${init?.method || 'GET'} ${path} failed: ${res.status} ${text}`);
  }
  // Try parse JSON, else return as any
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

// Convenience GET with fallback
export async function apiGet<T>(path: string, fallback?: T): Promise<T> {
  try {
    return await apiCall<T>(path);
  } catch (e) {
    if (fallback !== undefined) return fallback;
    throw e;
  }
}
