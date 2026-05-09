type RTTSkinHeroProps = {
  tagline?: string;
  wordmarkAlt?: string;
  crownSrc?: string;
  wordmarkSrc?: string;
};

export function RTTSkinHero({
  tagline = "CHECK IN. COMPETE. RUN THE TABLE.",
  wordmarkAlt = "Run The Table",
  crownSrc = "/assets/skins/rtt/rtt-crown.svg",
  wordmarkSrc = "/assets/skins/rtt/rtt-wordmark-run-the-table.svg",
}: RTTSkinHeroProps) {
  return (
    <section className="rttb-hero" aria-label="Run The Table hero">
      <img className="rttb-crown" src={crownSrc} alt="" aria-hidden="true" />
      <img className="rttb-wordmark" src={wordmarkSrc} alt={wordmarkAlt} />
      <p className="rttb-tagline">{tagline}</p>
    </section>
  );
}
