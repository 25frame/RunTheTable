export const fallbackPlayers = [
  { id: "PLY-001", name: "Jay Morales", handle: "@jayloops", skill: "Intermediate", rank: 1, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80", wins: 6, losses: 1, points: 19, streak: "3W", gameDiff: 0, pointDiff: 42 },
  { id: "PLY-002", name: "Mike Reyes", handle: "@mikeruns", skill: "Advanced", rank: 2, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80", wins: 5, losses: 2, points: 17, streak: "1L", gameDiff: 0, pointDiff: 31 },
  { id: "PLY-003", name: "Luis Carter", handle: "@luisrtt", skill: "Intermediate", rank: 3, photo: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=900&q=80", wins: 4, losses: 3, points: 15, streak: "2W", gameDiff: 0, pointDiff: 18 },
  { id: "PLY-004", name: "Tone Williams", handle: "@tonetable", skill: "Beginner", rank: 4, photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=80", wins: 2, losses: 5, points: 11, streak: "1W", gameDiff: 0, pointDiff: -12 }
];

export const fallbackWeeklyResults = [
  { week: 1, winner: "Jay Morales", players: 4, collected: 30, prizePool: 24, organizerCut: 6, first: 12, second: 7, third: 5 }
];

export const fallbackMatches = [
  { playerA: "Jay Morales", playerB: "Mike Reyes", winner: "Jay Morales", score: "11-8", type: "Final" },
  { playerA: "Luis Carter", playerB: "Tone Williams", winner: "Tone Williams", score: "9-11", type: "Pool" }
];
