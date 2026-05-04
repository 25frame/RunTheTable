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
};

export async function getRTTData(): Promise<RTTData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("/api/rtt", {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("RTT API failed");

    return await res.json();
  } catch {
    clearTimeout(timeout);

    return {
      ok: false,
      updatedAt: new Date().toISOString(),
      formUrl: "",
      players: [],
      matches: [],
      weeklyResults: [],
      payout: null,
    };
  }
}