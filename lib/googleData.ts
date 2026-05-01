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
  playerA: string;
  playerB: string;
  winner: string;
  score: string;
  type: string;
};

export type RTTWeeklyResult = {
  week: number;
  winner: string;
  players: number;
  collected: number;
  prizePool: number;
  organizerCut: number;
  first: number;
  second: number;
  third: number;
};

export type RTTData = {
  players: RTTPlayer[];
  matches: RTTMatch[];
  weeklyResults: RTTWeeklyResult[];
  formUrl: string;
};

const API_URL =
  "https://script.google.com/macros/s/AKfycbycnGdAqxQUpqLAyO9sQ1DfrSzDk94_sf0wBzCVZgDVrqVjZQ3xxIS6AZ39U07Stodd/exec";

export async function getRTTData(): Promise<RTTData> {
  const res = await fetch(API_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("RTT API failed");
  }

  const data = await res.json();

  return {
    players: (data.players || []).map((p: Partial<RTTPlayer>) => ({
      id: p.id || "",
      name: p.name || "",
      skill: p.skill || "",
      rank: p.rank || 0,
      wins: p.wins || 0,
      losses: p.losses || 0,
      points: p.points || 0,
      streak: p.streak || "",
      photo: p.photo || "",
      handle: p.handle || "",
      gameDiff: p.gameDiff || 0,
      pointDiff: p.pointDiff || 0,
    })),
    matches: data.matches || [],
    weeklyResults: (data.weeklyResults || []).map((w: Partial<RTTWeeklyResult>) => ({
      week: w.week || 0,
      winner: w.winner || "TBD",
      players: w.players || 0,
      collected: w.collected || 0,
      prizePool: w.prizePool || 0,
      organizerCut: w.organizerCut || 0,
      first: w.first || 0,
      second: w.second || 0,
      third: w.third || 0,
    })),
    formUrl: data.formUrl || "",
  };
}