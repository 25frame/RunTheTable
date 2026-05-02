"use client";

import { useEffect, useState } from "react";

type Props = {
  winner: string;
};

export default function WinScreen({ winner }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="win-overlay">
      <div className="win-text">
        <div className="label">WINNER</div>
        <div className="name">{winner}</div>
      </div>
    </div>
  );
}