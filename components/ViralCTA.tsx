import Link from "next/link";

export function ViralCTA({
  formUrl,
  compact = false,
}: {
  formUrl: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "grid gap-3" : "mt-7 grid grid-cols-1 gap-3 sm:flex"}>
      <a href={formUrl} target="_blank" rel="noopener noreferrer" className="rtt-cta">
        Join Next Battle
      </a>

      <Link href="/live" className="rtt-secondary">
        Watch Live
      </Link>

      <Link href="/standings" className="rtt-secondary">
        View The Board
      </Link>
    </div>
  );
}
