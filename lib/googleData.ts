export type RTTPlayer = {
  id: string;
  name: string;
  skill: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  streak: string;
  photo?: string;
  handle?: string;
  gameDiff?: number;
  pointDiff?: number;
};

export type RTTMatch = {
  playerA: string;
  playerB: string;
  winner: string;
  score: string;
  type: string;
};

export type RTTWeeklyResult = {
  winner: string;
  players: number;
  collected: number;
  prizePool: number;
  first: number;
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
    players: data.players || [],
    matches: data.matches || [],
    weeklyResults: data.weeklyResults || [],
    formUrl: data.formUrl || "",
  };
}