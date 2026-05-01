/**
 * RTT Admin Auth
 * Browser session helper; Apps Script still validates key server-side.
 */
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "rtt_esNlmK8c2JDttw6GwBpJ6WxpIUNDf3D1dZTl";
const STORAGE_KEY = "rtt_admin_key";

export function login(password: string) {
  if (password === ADMIN_KEY) {
    window.sessionStorage.setItem(STORAGE_KEY, password);
    return true;
  }
  return false;
}
export function logout() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY);
}
export function getAdminKey() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(STORAGE_KEY) || "";
}
export function isAdmin() {
  return getAdminKey() === ADMIN_KEY;
}
