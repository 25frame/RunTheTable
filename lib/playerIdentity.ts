import type { RTTMatch, RTTPlayer } from "@/lib/googleData";

export type RTTTier =
  | "UNRANKED"
  | "RUNNER"
  | "STRIKER"
  | "CONTENDER"
  | "KILLER"
  | "KING"
  | "LEGEND";

export type RTTHeat = "COLD" | "NEUTRAL" | "HOT" | "ON FIRE";

export type RTTStatus =
  | "NEW BLOOD"
  | "READY"
  | "UP NEXT"
  | "PLAYING NOW"
  | "ON A RUN"
  | "TABLE OWNER"
  | "HUNTED"
  | "HUNGRY";

export type RTTMoment =
  | "UPSET KING"
  | "CLOSER"
  | "SWEEP"
  | "COMEBACK"
  | "LOCKDOWN"
  | "EDGE KILL"
  | "STATEMENT WIN";

export function getDisplayName(player: Pick<RTTPlayer, "name" | "handle">) {
  return player.handle || player.name || "UNKNOWN";
}

export function getTier(
  player: Pick<RTTPlayer, "rank" | "wins" | "losses" | "points" | "pointDiff">
): RTTTier {
  const total = player.wins + player.losses;
  const winPct = total ? player.wins / total : 0;

  if (player.rank === 1 && player.wins >= 3) return "LEGEND";
  if (player.rank === 1) return "KING";
  if (player.rank <= 3 && player.wins >= 2) return "KILLER";
  if (player.wins >= 5 && winPct >= 0.6) return "CONTENDER";
  if (player.wins >= 3) return "STRIKER";
  if (player.wins >= 1) return "RUNNER";

  return "UNRANKED";
}

export function getHeat(
  player: Pick<RTTPlayer, "wins" | "losses" | "pointDiff">
): RTTHeat {
  if (player.wins >= 3 && player.pointDiff >= 5) return "ON FIRE";
  if (player.wins >= 2 && player.pointDiff > 0) return "HOT";
  if (player.losses > player.wins) return "COLD";
  return "NEUTRAL";
}

export function getStatus(
  player: Pick<RTTPlayer, "rank" | "wins" | "losses" | "pointDiff">,
  liveMatch?: RTTMatch
): RTTStatus {
  if (liveMatch) return "PLAYING NOW";
  if (player.rank === 1) return "TABLE OWNER";
  if (player.rank <= 3) return "HUNTED";
  if (player.wins >= 2 && player.pointDiff > 0) return "ON A RUN";
  if (player.wins === 0 && player.losses === 0) return "NEW BLOOD";
  if (player.losses > player.wins) return "HUNGRY";
  return "READY";
}

export function getMomentTitle(match: RTTMatch, players: RTTPlayer[] = []): RTTMoment | "" {
  if (!match.verified || !match.winner) return "";

  const winner = players.find((p) => p.id === match.winnerId || p.name === match.winner);
  const loserName = match.winner === match.playerA ? match.playerB : match.playerA;
  const loser = players.find((p) => p.name === loserName);

  const diff = Math.abs(match.scoreA - match.scoreB);
  const maxScore = Math.max(match.scoreA, match.scoreB);
  const minScore = Math.min(match.scoreA, match.scoreB);

  if (maxScore >= 11 && minScore >= 10) return "CLOSER";
  if (diff >= 7) return "LOCKDOWN";
  if (winner && loser && winner.rank > loser.rank) return "UPSET KING";
  if (diff === 1 || diff === 2) return "EDGE KILL";
  if (winner && winner.rank <= 3) return "STATEMENT WIN";

  return "";
}

export function getHeatClass(heat: RTTHeat) {
  switch (heat) {
    case "ON FIRE":
      return "border-red-500/50 bg-red-500/15 text-red-100 shadow-[0_0_35px_rgba(225,6,0,0.32)]";
    case "HOT":
      return "border-orange-400/40 bg-orange-400/10 text-orange-100";
    case "COLD":
      return "border-blue-300/25 bg-blue-300/10 text-blue-100";
    default:
      return "border-white/10 bg-white/5 text-white/65";
  }
}

export function formatRecord(player: Pick<RTTPlayer, "wins" | "losses">) {
  return `${player.wins}W ${player.losses}L`;
}
