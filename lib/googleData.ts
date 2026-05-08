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

export type RTTData = {
  ok: boolean;
  updatedAt: string;
  formUrl: string;
  players: RTTPlayer[];
  matches: RTTMatch[];
  weeklyResults: RTTWeeklyResult[];
  payout: RTTPayout | null;
  debug?: unknown;
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

type RawRTTData = {
  ok?: boolean;
  success?: boolean;
  updatedAt?: string;
  formUrl?: string;
  players?: RawRTTPlayer[];
  livePlayers?: RawRTTPlayer[];
  matches?: RawRTTMatch[];
  weeklyResults?: RawRTTWeeklyResult[];
  payout?: RawRTTPayout | null;
  data?: {
    players?: RawRTTPlayer[];
    livePlayers?: RawRTTPlayer[];
    matches?: RawRTTMatch[];
    weeklyResults?: RawRTTWeeklyResult[];
    payout?: RawRTTPayout | null;
    formUrl?: string;
  };
  debug?: unknown;
  error?: string;
};

const RTT_API_URL =
  process.env.NEXT_PUBLIC_RTT_API_URL ||
  process.env.RTT_INTERNAL_API_URL ||
  "/api/rtt";

const RTT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform";

export async function getRTTData(): Promise<RTTData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(RTT_API_URL, {
      signal: controller.signal,
      next: { revalidate: 30 },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`RTT API failed with HTTP ${res.status}`);
    }

    const text = await res.text();

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

    const rawMatches =
      raw.matches ||
      raw.data?.matches ||
      [];

    const rawWeeklyResults =
      raw.weeklyResults ||
      raw.data?.weeklyResults ||
      [];

    const rawPayout =
      raw.payout ||
      raw.data?.payout ||
      null;

    return {
      ok: true,
      updatedAt: raw.updatedAt || new Date().toISOString(),
      formUrl: raw.formUrl || raw.data?.formUrl || RTT_FORM_URL,
      players: normalizePlayers(rawPlayers),
      matches: normalizeMatches(rawMatches),
      weeklyResults: normalizeWeeklyResults(rawWeeklyResults),
      payout: normalizePayout(rawPayout),
      debug: raw.debug || raw,
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
      error: error instanceof Error ? error.message : "Unknown RTT data error.",
    };
  }
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
      matchId: clean(match.matchId) || `M-${String(index + 1).padStart(3, "0")}`,
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

function normalizeWeeklyResults(results: RawRTTWeeklyResult[]): RTTWeeklyResult[] {
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

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function toNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toBoolean(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}