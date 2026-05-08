type PageHeroProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  tagline?: string;
};

export function PageHero({
  kicker,
  title,
  subtitle,
  tagline,
}: PageHeroProps) {
  const titleLines = splitTitle(title);

  return (
    <section className="rtt-hero">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="rtt-hero-kicker">{kicker}</p>

          {tagline ? (
            <p className="mt-2 max-w-xl text-[10px] font-black uppercase leading-5 tracking-[0.22em] text-white/35">
              {tagline}
            </p>
          ) : null}
        </div>
      </div>

      <h1 className="rtt-hero-title">
        {titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      {subtitle ? <p className="rtt-hero-subtitle">{subtitle}</p> : null}
    </section>
  );
}

function splitTitle(title: string): string[] {
  const cleanTitle = title.trim();

  if (!cleanTitle) return [""];

  if (cleanTitle.includes("\n")) {
    return cleanTitle
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const lower = cleanTitle.toLowerCase();

  const knownSplits: Record<string, string[]> = {
    "run the table": ["Run The", "Table"],
    "get on the board": ["Get On", "The Board"],
    "table check": ["Table", "Check"],
    "watch live": ["Watch", "Live"],
    "live battle": ["Live", "Battle"],
    "the board": ["The", "Board"],
    "table code": ["Table", "Code"],
    "the crew": ["The", "Crew"],
    "scan to join": ["Scan", "To Join"],
    "welcome to rtt": ["Welcome", "To RTT"],
    "battle history": ["Battle", "History"],
  };

  if (knownSplits[lower]) {
    return knownSplits[lower];
  }

  const words = cleanTitle.split(/\s+/);

  if (words.length <= 2) {
    return [cleanTitle];
  }

  const midpoint = Math.ceil(words.length / 2);

  return [
    words.slice(0, midpoint).join(" "),
    words.slice(midpoint).join(" "),
  ];
}