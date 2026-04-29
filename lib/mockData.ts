export const players = [
  {
    id: "jay-morales",
    name: "Jay Morales",
    handle: "@jayloops",
    skill: "Intermediate",
    rank: 1,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    wins: 24,
    losses: 11,
    points: 83,
    streak: "3W",
    gameDiff: 18,
    pointDiff: 124,
  },
  {
    id: "mike-reyes",
    name: "Mike Reyes",
    handle: "@mikeruns",
    skill: "Advanced",
    rank: 2,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    wins: 22,
    losses: 9,
    points: 75,
    streak: "1L",
    gameDiff: 14,
    pointDiff: 88,
  },
  {
    id: "luis-carter",
    name: "Luis Carter",
    handle: "@luisrtt",
    skill: "Intermediate",
    rank: 3,
    photo: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&w=800&q=80",
    wins: 19,
    losses: 13,
    points: 70,
    streak: "2W",
    gameDiff: 9,
    pointDiff: 46,
  },
  {
    id: "tone-williams",
    name: "Tone Williams",
    handle: "@tonetable",
    skill: "Beginner",
    rank: 4,
    photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=800&q=80",
    wins: 14,
    losses: 15,
    points: 57,
    streak: "1W",
    gameDiff: -3,
    pointDiff: -22,
  }
];

export const weeklyResults = [
  { week: 12, winner: "Jay Morales", players: 20, collected: 300, prizePool: 240, organizerCut: 60, first: 120, second: 72, third: 48 },
  { week: 11, winner: "Mike Reyes", players: 18, collected: 270, prizePool: 216, organizerCut: 54, first: 108, second: 65, third: 43 },
  { week: 10, winner: "Jay Morales", players: 22, collected: 330, prizePool: 264, organizerCut: 66, first: 132, second: 79, third: 53 }
];

export const matches = [
  { playerA: "Jay Morales", playerB: "Mike Reyes", winner: "Jay Morales", score: "11-7, 11-9", type: "Final" },
  { playerA: "Luis Carter", playerB: "Tone Williams", winner: "Luis Carter", score: "11-5, 7-11, 11-8", type: "Pod" },
  { playerA: "Mike Reyes", playerB: "Luis Carter", winner: "Mike Reyes", score: "11-8, 11-6", type: "Challenge" }
];
