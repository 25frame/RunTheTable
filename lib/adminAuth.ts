import { clearSession, isAdmin as checkAdmin } from "./auth";

export function logout() {
  clearSession();
}

export function isAdmin() {
  return checkAdmin();
}

export function getAdminKey() {
  return "";
}
