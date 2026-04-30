import { fallbackPlayers, fallbackWeeklyResults, fallbackMatches } from "./mockData";

export type RTTPlayer = {
  id: string; name: string; handle: string; skill: string; rank: number; photo: string;
  wins: number; losses: number; points: number; streak: string; gameDiff: number; pointDiff: number;
};

export type RTTWeeklyResult = {
  week: number; winner: string; players: number; collected: number; prizePool: number;
  organizerCut: number; first: number; second: number; third: number;
};

export type RTTMatch = { playerA: string; playerB: string; winner: string; score: string; type: string; };

export type RTTData = {
  players: RTTPlayer[];
  weeklyResults: RTTWeeklyResult[];
  matches: RTTMatch[];
  formUrl?: string;
};

const fallback: RTTData = {
  players: fallbackPlayers,
  weeklyResults: fallbackWeeklyResults,
  matches: fallbackMatches,
  formUrl: process.env.NEXT_PUBLIC_GOOGLE_FORM_URL
};

export async function getRTTData(): Promise<RTTData> {
  const apiUrl = process.env.NEXT_PUBLIC_RTT_API_URL;
  if (!apiUrl) return fallback;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!response.ok) return fallback;
    const data = await response.json();
    return {
      players: Array.isArray(data.players) && data.players.length ? data.players : fallback.players,
      weeklyResults: Array.isArray(data.weeklyResults) && data.weeklyResults.length ? data.weeklyResults : fallback.weeklyResults,
      matches: Array.isArray(data.matches) && data.matches.length ? data.matches : fallback.matches,
      formUrl: data.formUrl || process.env.NEXT_PUBLIC_GOOGLE_FORM_URL
    };
  } catch {
    return fallback;
  }
}
