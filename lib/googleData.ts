export type RTTPlayer = {
  id: string;
  name: string;
  skill: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  streak: string;
  photo: string;
  handle: string;
  gameDiff: number;
  pointDiff: number;
};

export type RTTMatch = {
  row: number;
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
  status: string;
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
  payout: RTTPayout;
};

const DIRECT_API_URL =
  process.env.NEXT_PUBLIC_RTT_API_URL ||
  "https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec";

const FALLBACK_FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLScGDbgA5YOItre1EjvQIxlvi3pIByBDq10HFW24MAjOw7tZZA/viewform?usp=header";

export async function getRTTData(): Promise<RTTData> {
  const url = typeof window === "undefined" ? DIRECT_API_URL : "/api/rtt";

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("RTT API failed");
    const data = await res.json();

    return {
      ok: Boolean(data.ok),
      updatedAt: data.updatedAt || new Date().toISOString(),
      formUrl: data.formUrl || FALLBACK_FORM_URL,
      players: (data.players || []).map(normalizePlayer),
      matches: (data.matches || []).map(normalizeMatch),
      weeklyResults: (data.weeklyResults || []).map(normalizeWeeklyResult),
      payout: normalizePayout(data.payout || {})
    };
  } catch {
    return {
      ok: false,
      updatedAt: new Date().toISOString(),
      formUrl: FALLBACK_FORM_URL,
      players: [],
      matches: [],
      weeklyResults: [],
      payout: normalizePayout({})
    };
  }
}

function normalizePlayer(p: Partial<RTTPlayer>): RTTPlayer {
  return {
    id: p.id || "",
    name: p.name || "",
    skill: p.skill || "",
    rank: Number(p.rank) || 0,
    wins: Number(p.wins) || 0,
    losses: Number(p.losses) || 0,
    points: Number(p.points) || 0,
    streak: p.streak || "",
    photo: p.photo || "",
    handle: p.handle || "",
    gameDiff: Number(p.gameDiff) || 0,
    pointDiff: Number(p.pointDiff) || 0
  };
}

function normalizeMatch(m: Partial<RTTMatch>): RTTMatch {
  const scoreA = Number(m.scoreA) || 0;
  const scoreB = Number(m.scoreB) || 0;

  return {
    row: Number(m.row) || 0,
    eventId: m.eventId || "",
    matchId: m.matchId || "",
    type: m.type || "",
    table: m.table || "",
    playerAId: m.playerAId || "",
    playerA: m.playerA || "",
    playerBId: m.playerBId || "",
    playerB: m.playerB || "",
    scoreA,
    scoreB,
    winnerId: m.winnerId || "",
    winner: m.winner || "",
    verified: Boolean(m.verified),
    status: m.status || "",
    score: m.score || `${scoreA}-${scoreB}`
  };
}

function normalizeWeeklyResult(w: Partial<RTTWeeklyResult>): RTTWeeklyResult {
  return {
    week: Number(w.week) || 0,
    winner: w.winner || "TBD",
    players: Number(w.players) || 0,
    collected: Number(w.collected) || 0,
    organizerCut: Number(w.organizerCut) || 0,
    prizePool: Number(w.prizePool) || 0,
    first: Number(w.first) || 0,
    second: Number(w.second) || 0,
    third: Number(w.third) || 0
  };
}

function normalizePayout(p: Partial<RTTPayout>): RTTPayout {
  return {
    eventId: p.eventId || "EVT-001",
    week: Number(p.week) || 1,
    paidPlayers: Number(p.paidPlayers) || 0,
    totalCollected: Number(p.totalCollected) || 0,
    operationsCut: Number(p.operationsCut) || 0,
    prizePool: Number(p.prizePool) || 0,
    firstPlaceName: p.firstPlaceName || "TBD",
    firstPlacePayout: Number(p.firstPlacePayout) || 0,
    secondPlacePayout: Number(p.secondPlacePayout) || 0,
    thirdPlacePayout: Number(p.thirdPlacePayout) || 0
  };
}
