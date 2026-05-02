"use client";

import { useEffect, useState } from "react";

type Props = {
  playerA: string;
  playerB: string;
  onComplete?: () => void;
};

export default function MatchIntro({ playerA, playerB, onComplete }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 3500);

    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="intro-overlay">
      <div className="intro-content">
        <div className="player left">{playerA}</div>
        <div className="vs">VS</div>
        <div className="player right">{playerB}</div>
      </div>
    </div>
  );
}