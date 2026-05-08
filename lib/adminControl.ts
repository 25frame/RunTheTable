import { authedPost } from "@/lib/auth";
import type { RTTUser } from "@/lib/auth";
import type { RTTConfig, RTTData } from "@/lib/googleData";

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
  publicFeed?: {
    playersSheetRows: number;
    standingsSheetRows: number;
    matchesSheetRows: number;
    registrationsSheetRows: number;
    siteConfigRows?: number;
    publicPlayersReturned: number;
  };
  error?: string;
  message?: string;
};

export type AdminActionResult = {
  ok: boolean;
  message?: string;
  error?: string;
  feed?: RTTData;
};

export type FormSyncResult = AdminActionResult & {
  addedPlayers?: number;
  updatedPlayers?: number;
  addedRegistrations?: number;
  skippedRows?: number;
};

export type CreatePlayerPayload = {
  displayName: string;
  fullName?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  skill?: string;
  paymentHandle?: string;
  photo?: string;
  status?: string;
};

export type UpdatePlayerPayload = {
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
};

export type CreateUserPayload = {
  email: string;
  password: string;
  role: "admin" | "player";
  playerId?: string;
};

export type CreateMatchPayload = {
  eventId?: string;
  type?: string;
  table?: string;
  playerAId: string;
  playerBId: string;
};

export type UpdateLiveScorePayload = {
  row: number;
  scoreA: number;
  scoreB: number;
};

export type SaveLiveMatchPayload = {
  row: number;
  scoreA: number;
  scoreB: number;
};

export type ListUsersResult = {
  ok: boolean;
  users: RTTUser[];
  error?: string;
};

export type SiteConfigUpdatePayload = {
  updates: Record<string, string>;
};

export type SiteConfigUpdateResult = AdminActionResult & {
  config?: RTTConfig;
};

export async function adminHealthCheck(): Promise<AdminHealth> {
  return authedPost<Record<string, never>, AdminHealth>("adminHealthCheck", {});
}

export async function runSetup(): Promise<AdminActionResult> {
  return authedPost<Record<string, never>, AdminActionResult>("runSetup", {});
}

export async function repairRTTSiteData(): Promise<AdminActionResult> {
  return authedPost<Record<string, never>, AdminActionResult>(
    "repairRTTSiteData",
    {}
  );
}

export async function syncForm(): Promise<FormSyncResult> {
  return authedPost<Record<string, never>, FormSyncResult>("syncForm", {});
}

export async function recalcStandings(): Promise<AdminActionResult> {
  return authedPost<Record<string, never>, AdminActionResult>(
    "recalcStandings",
    {}
  );
}

export async function updateSiteConfig(
  payload: SiteConfigUpdatePayload
): Promise<SiteConfigUpdateResult> {
  return authedPost<SiteConfigUpdatePayload, SiteConfigUpdateResult>(
    "updateSiteConfig",
    payload
  );
}

export async function createPlayer(
  payload: CreatePlayerPayload
): Promise<AdminActionResult & { playerId?: string }> {
  return authedPost<
    CreatePlayerPayload,
    AdminActionResult & { playerId?: string }
  >("createPlayer", payload);
}

export async function updatePlayerAdmin(
  payload: UpdatePlayerPayload
): Promise<AdminActionResult & { playerId?: string }> {
  return authedPost<
    UpdatePlayerPayload,
    AdminActionResult & { playerId?: string }
  >("updatePlayerProfile", payload);
}

export async function createUser(
  payload: CreateUserPayload
): Promise<AdminActionResult & { userId?: string }> {
  return authedPost<
    CreateUserPayload,
    AdminActionResult & { userId?: string }
  >("createUser", payload);
}

export async function listUsers(): Promise<ListUsersResult> {
  return authedPost<Record<string, never>, ListUsersResult>("listUsers", {});
}

export async function setUserStatus(payload: {
  userId: string;
  status: "active" | "inactive";
}): Promise<AdminActionResult & { userId?: string; status?: string }> {
  return authedPost<
    { userId: string; status: "active" | "inactive" },
    AdminActionResult & { userId?: string; status?: string }
  >("setUserStatus", payload);
}

export async function deleteUser(payload: {
  userId: string;
}): Promise<AdminActionResult & { userId?: string }> {
  return authedPost<
    { userId: string },
    AdminActionResult & { userId?: string }
  >("deleteUser", payload);
}

export async function createMatch(
  payload: CreateMatchPayload
): Promise<AdminActionResult & { matchId?: string }> {
  return authedPost<
    CreateMatchPayload,
    AdminActionResult & { matchId?: string }
  >("createMatch", payload);
}

export async function updateLiveScore(
  payload: UpdateLiveScorePayload
): Promise<AdminActionResult & { score?: string }> {
  return authedPost<
    UpdateLiveScorePayload,
    AdminActionResult & { score?: string }
  >("updateLiveScore", payload);
}

export async function saveLiveMatch(
  payload: SaveLiveMatchPayload
): Promise<
  AdminActionResult & {
    winner?: string;
    score?: string;
  }
> {
  return authedPost<
    SaveLiveMatchPayload,
    AdminActionResult & {
      winner?: string;
      score?: string;
    }
  >("saveLiveMatch", payload);
}

/**
 * Reserved helper.
 *
 * Your current Apps Script backend does not yet expose "updateSetup".
 * Do not call this from active UI until the Apps Script doPost() supports it.
 */
export async function updateSetup(payload: {
  activeEventId?: string;
  winPoints?: number;
  lossPoints?: number;
}): Promise<AdminActionResult> {
  return authedPost<
    {
      activeEventId?: string;
      winPoints?: number;
      lossPoints?: number;
    },
    AdminActionResult
  >("updateSetup", payload);
}

/**
 * Reserved helper.
 *
 * Your current Apps Script backend does not yet expose "updatePayoutConfig".
 * Do not call this from active UI until the Apps Script doPost() supports it.
 */
export async function updatePayoutConfig(payload: {
  eventId?: string;
  paidPlayers?: number;
  totalCollected?: number;
  operationsCut?: number;
  prizePool?: number;
  firstPlacePayout?: number;
  secondPlacePayout?: number;
  thirdPlacePayout?: number;
}): Promise<AdminActionResult> {
  return authedPost<
    {
      eventId?: string;
      paidPlayers?: number;
      totalCollected?: number;
      operationsCut?: number;
      prizePool?: number;
      firstPlacePayout?: number;
      secondPlacePayout?: number;
      thirdPlacePayout?: number;
    },
    AdminActionResult
  >("updatePayoutConfig", payload);
}