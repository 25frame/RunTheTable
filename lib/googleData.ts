export type RTTPlayer = {
  rank: number;
  id: string;
  name: string;
  skill: string;
  wins: number;
  losses: number;
  points: number;
  gameDiff: number;
  pointDiff: number;
  streak: string;
  handle: string;
  photo: string;
};

export type RTTMatch = {
  row?: number;
  eventId: string;
  matchId: string;
  type: string;
  table: string;
  playerAId: string;
  playerA: string;
  playerBId: string;
  playerB: string;
  scoreA: number;
  scoreB: number;
  winnerId: string;
  winner: string;
  verified: boolean;
  status?: string;
  score: string;
};

export type RTTWeeklyResult = {
  week: number;
  winner: string;
  players: number;
  collected: number;
  organizerCut: number;
  prizePool: number;
  first: number;
  second: number;
  third: number;
};

export type RTTPayout = {
  eventId: string;
  week: number;
  paidPlayers: number;
  totalCollected: number;
  operationsCut: number;
  prizePool: number;
  firstPlaceName: string;
  firstPlacePayout: number;
  secondPlacePayout: number;
  thirdPlacePayout: number;
};

export type RTTPlace = {
  id: string;
  name: string;
  borough: string;
  neighborhood: string;
  location: string;
  indoorOutdoor: string;
  tableCount: number;
  equipmentAvailable: string;
  cost: string;
  hoursNotes: string;
  sourceUrl: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RTTConfig = Record<string, string>;

export type RTTData = {
  ok: boolean;
  updatedAt: string;
  formUrl: string;
  players: RTTPlayer[];
  matches: RTTMatch[];
  weeklyResults: RTTWeeklyResult[];
  payout: RTTPayout | null;
  places: RTTPlace[];
  config: RTTConfig;
  debug?: unknown;
  cache?: unknown;
  warning?: string;
  error?: string;
};

type RawRTTPlayer = Partial<RTTPlayer> & {
  playerId?: string;
  displayName?: string;
  fullName?: string;
  playerName?: string;
  skillLevel?: string;
  instagram?: string;
  photoUrl?: string;
};

type RawRTTMatch = Partial<RTTMatch> & {
  playerAName?: string;
  playerBName?: string;
};

type RawRTTWeeklyResult = Partial<RTTWeeklyResult>;

type RawRTTPayout = Partial<RTTPayout>;

type RawRTTPlace = Partial<RTTPlace> & {
  placeId?: string;
  address?: string;
  addressLocation?: string;
  type?: string;
  tables?: number | string;
  notes?: string;
  source?: string;
  url?: string;
};

type RawRTTData = {
  ok?: boolean;
  success?: boolean;
  updatedAt?: string;
  fetchedAt?: string;
  formUrl?: string;
  players?: RawRTTPlayer[];
  livePlayers?: RawRTTPlayer[];
  matches?: RawRTTMatch[];
  weeklyResults?: RawRTTWeeklyResult[];
  payout?: RawRTTPayout | null;
  places?: RawRTTPlace[];
  config?: unknown;
  data?: {
    players?: RawRTTPlayer[];
    livePlayers?: RawRTTPlayer[];
    matches?: RawRTTMatch[];
    weeklyResults?: RawRTTWeeklyResult[];
    payout?: RawRTTPayout | null;
    places?: RawRTTPlace[];
    config?: unknown;
    formUrl?: string;
    updatedAt?: string;
  };
  debug?: unknown;
  cache?: unknown;
  warning?: string;
  error?: string;
};

const RTT_API_URL = getRTTApiUrl();

const RTT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform";

export async function getRTTData(): Promise<RTTData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(RTT_API_URL, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`RTT API failed with HTTP ${response.status}`);
    }

    const text = await response.text();

    if (!text.trim()) {
      throw new Error("RTT API returned an empty response.");
    }

    let raw: RawRTTData;

    try {
      raw = JSON.parse(text) as RawRTTData;
    } catch {
      throw new Error("RTT API did not return valid JSON.");
    }

    if (raw.ok === false || raw.success === false) {
      throw new Error(raw.error || "RTT API returned ok:false.");
    }

    const rawPlayers =
      raw.players ||
      raw.data?.players ||
      raw.livePlayers ||
      raw.data?.livePlayers ||
      [];

    const rawMatches = raw.matches || raw.data?.matches || [];

    const rawWeeklyResults =
      raw.weeklyResults || raw.data?.weeklyResults || [];

    const rawPayout = raw.payout || raw.data?.payout || null;

    const rawPlaces = raw.places || raw.data?.places || [];

    const rawConfig = raw.config || raw.data?.config || {};

    return {
      ok: true,
      updatedAt:
        raw.updatedAt ||
        raw.data?.updatedAt ||
        raw.fetchedAt ||
        new Date().toISOString(),
      formUrl: raw.formUrl || raw.data?.formUrl || RTT_FORM_URL,
      players: normalizePlayers(rawPlayers),
      matches: normalizeMatches(rawMatches),
      weeklyResults: normalizeWeeklyResults(rawWeeklyResults),
      payout: normalizePayout(rawPayout),
      places: normalizePlaces(rawPlaces),
      config: normalizeConfig(rawConfig),
      debug: raw.debug,
      cache: raw.cache,
      warning: raw.warning,
      error: raw.error,
    };
  } catch (error) {
    clearTimeout(timeout);

    return {
      ok: false,
      updatedAt: new Date().toISOString(),
      formUrl: RTT_FORM_URL,
      players: [],
      matches: [],
      weeklyResults: [],
      payout: null,
      places: [],
      config: {},
      error: error instanceof Error ? error.message : "Unknown RTT data error.",
    };
  }
}

function getRTTApiUrl(): string {
  /*
   * Browser/client calls should use the local Next.js API route.
   */
  if (typeof window !== "undefined") {
    return "/api/rtt";
  }

  /*
   * Server-side production URL.
   * Use this if explicitly provided.
   */
  if (process.env.RTT_INTERNAL_API_URL) {
    return process.env.RTT_INTERNAL_API_URL;
  }

  /*
   * Optional public site URL, recommended for stable production.
   * Example:
   * NEXT_PUBLIC_SITE_URL=https://run-the-table.vercel.app
   */
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/api/rtt`;
  }

  /*
   * Vercel production domain if available.
   */
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/rtt`;
  }

  /*
   * Vercel deployment URL fallback.
   */
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/rtt`;
  }

  /*
   * Local development fallback.
   */
  return "http://localhost:3000/api/rtt";
}

function normalizePlayers(players: RawRTTPlayer[]): RTTPlayer[] {
  return players
    .map((player, index): RTTPlayer => {
      const id =
        clean(player.id) ||
        clean(player.playerId) ||
        `player-${index + 1}`;

      const name =
        clean(player.name) ||
        clean(player.displayName) ||
        clean(player.fullName) ||
        clean(player.playerName) ||
        "Unnamed Player";

      return {
        rank: toNumber(player.rank, index + 1),
        id,
        name,
        skill: clean(player.skill) || clean(player.skillLevel) || "Unranked",
        wins: toNumber(player.wins, 0),
        losses: toNumber(player.losses, 0),
        points: toNumber(player.points, 0),
        gameDiff: toNumber(player.gameDiff ?? player.pointDiff, 0),
        pointDiff: toNumber(player.pointDiff ?? player.gameDiff, 0),
        streak: clean(player.streak),
        handle: clean(player.handle) || clean(player.instagram),
        photo: clean(player.photo) || clean(player.photoUrl),
      };
    })
    .filter((player) => Boolean(player.id && player.name));
}

function normalizeMatches(matches: RawRTTMatch[]): RTTMatch[] {
  return matches.map((match, index): RTTMatch => {
    const scoreA = toNumber(match.scoreA, 0);
    const scoreB = toNumber(match.scoreB, 0);
    const verified = toBoolean(match.verified);

    return {
      row: match.row,
      eventId: clean(match.eventId) || "EVT-001",
      matchId:
        clean(match.matchId) || `M-${String(index + 1).padStart(3, "0")}`,
      type: clean(match.type) || "Street",
      table: clean(match.table) || "Table 1",
      playerAId: clean(match.playerAId),
      playerA: clean(match.playerA) || clean(match.playerAName) || "Player A",
      playerBId: clean(match.playerBId),
      playerB: clean(match.playerB) || clean(match.playerBName) || "Player B",
      scoreA,
      scoreB,
      winnerId: clean(match.winnerId),
      winner: clean(match.winner),
      verified,
      status: clean(match.status) || (verified ? "Final" : "Scheduled"),
      score: clean(match.score) || `${scoreA}-${scoreB}`,
    };
  });
}

function normalizeWeeklyResults(
  results: RawRTTWeeklyResult[]
): RTTWeeklyResult[] {
  return results.map((result): RTTWeeklyResult => {
    return {
      week: toNumber(result.week, 1),
      winner: clean(result.winner) || "TBD",
      players: toNumber(result.players, 0),
      collected: toNumber(result.collected, 0),
      organizerCut: toNumber(result.organizerCut, 0),
      prizePool: toNumber(result.prizePool, 0),
      first: toNumber(result.first, 0),
      second: toNumber(result.second, 0),
      third: toNumber(result.third, 0),
    };
  });
}

function normalizePayout(payout: RawRTTPayout | null): RTTPayout | null {
  if (!payout) return null;

  return {
    eventId: clean(payout.eventId) || "EVT-001",
    week: toNumber(payout.week, 1),
    paidPlayers: toNumber(payout.paidPlayers, 0),
    totalCollected: toNumber(payout.totalCollected, 0),
    operationsCut: toNumber(payout.operationsCut, 0),
    prizePool: toNumber(payout.prizePool, 0),
    firstPlaceName: clean(payout.firstPlaceName) || "TBD",
    firstPlacePayout: toNumber(payout.firstPlacePayout, 0),
    secondPlacePayout: toNumber(payout.secondPlacePayout, 0),
    thirdPlacePayout: toNumber(payout.thirdPlacePayout, 0),
  };
}

function normalizePlaces(places: RawRTTPlace[]): RTTPlace[] {
  return places
    .map((place, index): RTTPlace => {
      const id =
        clean(place.id) ||
        clean(place.placeId) ||
        `PLC-${String(index + 1).padStart(3, "0")}`;

      const name = clean(place.name) || "Unnamed Place";

      return {
        id,
        name,
        borough: clean(place.borough),
        neighborhood: clean(place.neighborhood),
        location:
          clean(place.location) ||
          clean(place.addressLocation) ||
          clean(place.address),
        indoorOutdoor:
          clean(place.indoorOutdoor) ||
          clean(place.type) ||
          "Unknown",
        tableCount: toNumber(place.tableCount ?? place.tables, 0),
        equipmentAvailable: clean(place.equipmentAvailable),
        cost: clean(place.cost) || "Free",
        hoursNotes: clean(place.hoursNotes) || clean(place.notes),
        sourceUrl:
          clean(place.sourceUrl) ||
          clean(place.source) ||
          clean(place.url),
        status: clean(place.status) || "Active",
        featured: toBoolean(place.featured),
        createdAt: clean(place.createdAt),
        updatedAt: clean(place.updatedAt),
      };
    })
    .filter((place) => {
      const status = place.status.toLowerCase();
      return Boolean(
        place.id &&
          place.name &&
          status !== "inactive" &&
          status !== "deleted"
      );
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

function normalizeConfig(config: unknown): RTTConfig {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return {};
  }

  const output: RTTConfig = {};

  Object.entries(config as Record<string, unknown>).forEach(([key, value]) => {
    const cleanKey = clean(key);

    if (!cleanKey) return;

    output[cleanKey] = clean(value);
  });

  return output;
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function toNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toBoolean(value: unknown): boolean {
  if (value === true) return true;
  if (value === false) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "yes" || normalized === "1";
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
}