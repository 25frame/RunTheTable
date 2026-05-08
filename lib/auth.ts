export type RTTUser = {
  userId: string;
  email: string;
  role: "admin" | "player";
  playerId?: string;
  status?: string;
};

export type AuthResponse = {
  ok: boolean;
  token?: string;
  user?: RTTUser;
  error?: string;
};

export type RttApiResponse<T = Record<string, unknown>> = T & {
  ok: boolean;
  error?: string;
  message?: string;
};

const API_URL = "/api/rtt";

const TOKEN_KEY = "rtt_token";
const USER_KEY = "rtt_user";

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) || "";
}

export function getCurrentUser(): RTTUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as RTTUser) : null;
  } catch {
    clearSession();
    return null;
  }
}

export function setSession(token: string, user: RTTUser): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken() && getCurrentUser());
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === "admin";
}

export function requireAdminClient(): RTTUser {
  const user = getCurrentUser();

  if (!user || user.role !== "admin") {
    throw new Error("Admin login required.");
  }

  return user;
}

export async function login(email: string, password: string): Promise<RTTUser> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanEmail) {
    throw new Error("Email is required.");
  }

  if (!cleanPassword) {
    throw new Error("Password is required.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "login",
      payload: {
        email: cleanEmail,
        password: cleanPassword,
      },
    }),
  });

  const data = (await safeJson(res)) as AuthResponse;

  if (!res.ok || !data.ok || !data.token || !data.user) {
    throw new Error(data.error || `Login failed with HTTP ${res.status}`);
  }

  setSession(data.token, data.user);

  return data.user;
}

export async function authedPost<
  TPayload extends Record<string, unknown>,
  TResult = Record<string, unknown>
>(
  action: string,
  payload: TPayload = {} as TPayload
): Promise<RttApiResponse<TResult>> {
  const token = getToken();

  if (!token) {
    clearSession();
    throw new Error("Admin session expired. Please log in again.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    cache: "no-store",
    body: JSON.stringify({
      action,
      token,
      payload,
    }),
  });

  const data = (await safeJson(res)) as RttApiResponse<TResult>;

  if (!res.ok || !data.ok) {
    if (data.error === "Unauthorized") {
      clearSession();
    }

    throw new Error(data.error || `RTT request failed with HTTP ${res.status}`);
  }

  return data;
}

async function safeJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {
      ok: false,
      error: `Empty response from /api/rtt. HTTP status: ${response.status}`,
    };
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "Server returned invalid JSON.",
      raw: text,
    };
  }
}