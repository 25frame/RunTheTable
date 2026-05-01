/**
 * Browser-only admin session helper.
 *
 * NOTE FOR CODERS:
 * This is UX protection, not backend security.
 * Backend security is enforced by Apps Script doPost() checking ADMIN_KEY.
 */
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "rtt_Lx7jeZN05FlwPSG88PxUN7T41jJd";
const STORAGE_KEY = "rtt_admin_key";

export function login(password: string) {
  if (password === ADMIN_KEY) {
    window.sessionStorage.setItem(STORAGE_KEY, password);
    return true;
  }
  return false;
}

export function logout() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function getAdminKey() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(STORAGE_KEY) || "";
}

export function isAdmin() {
  return getAdminKey() === ADMIN_KEY;
}
