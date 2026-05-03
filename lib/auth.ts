export type RTTUser = {
  userId: string;
  email: string;
  role: "admin" | "player";
  playerId?: string;
};

const API_URL = "/api/rtt";
const TOKEN_KEY = "rtt_token";
const USER_KEY = "rtt_user";

export function getToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function getCurrentUser(): RTTUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: RTTUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}

export async function login(email: string, password: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "login", payload: { email, password } })
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Login failed with HTTP ${res.status}`);
  }

  setSession(data.token, data.user);
  return data.user as RTTUser;
}

export async function authedPost<TPayload extends Record<string, unknown>>(
  action: string,
  payload: TPayload = {} as TPayload
) {
  const token = getToken();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token, payload })
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}
