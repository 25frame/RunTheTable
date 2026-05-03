import { authedPost } from "@/lib/auth";

export type AdminHealthTab = {
  name: string;
  exists: boolean;
  rows: number;
  columns: number;
};

export type AdminHealth = {
  ok: boolean;
  spreadsheetId: string;
  formUrl: string;
  tabs: AdminHealthTab[];
  checkedAt: string;
};

export async function adminHealthCheck() {
  return authedPost("adminHealthCheck", {}) as Promise<AdminHealth>;
}

export async function createPlayer(payload: {
  displayName: string;
  fullName?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  skill?: string;
  paymentHandle?: string;
  photo?: string;
  status?: string;
}) {
  return authedPost("createPlayer", payload);
}

export async function updatePlayerAdmin(payload: {
  playerId: string;
  displayName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  skill?: string;
  paymentHandle?: string;
  photo?: string;
  status?: string;
}) {
  return authedPost("updatePlayerAdmin", payload);
}

export async function createUser(payload: {
  email: string;
  password: string;
  role: "admin" | "player";
  playerId?: string;
}) {
  return authedPost("createUser", payload);
}

export async function createMatch(payload: {
  eventId?: string;
  type?: string;
  table?: string;
  playerAId: string;
  playerBId: string;
}) {
  return authedPost("createMatch", payload);
}

export async function updateSetup(payload: {
  activeEventId?: string;
  winPoints?: number;
  lossPoints?: number;
}) {
  return authedPost("updateSetup", payload);
}

export async function updatePayoutConfig(payload: {
  eventId?: string;
  paidPlayers?: number;
  totalCollected?: number;
  operationsCut?: number;
  prizePool?: number;
  firstPlacePayout?: number;
  secondPlacePayout?: number;
  thirdPlacePayout?: number;
}) {
  return authedPost("updatePayoutConfig", payload);
}
