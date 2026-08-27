import { supabase } from "./supabaseClient";

const API_URL = import.meta.env.VITE_API_URL as string;

// Every request grabs the current Supabase session token fresh, so it's
// always valid (Supabase auto-refreshes it in the background).
async function authedFetch(path: string, options: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string) => authedFetch(path),
  post: (path: string, body?: unknown) =>
    authedFetch(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: (path: string, body?: unknown) =>
    authedFetch(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) => authedFetch(path, { method: "DELETE" }),
};
