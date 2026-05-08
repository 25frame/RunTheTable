type PageHeroProps = {
  kicker: string;
  title: string;
  subtitle?: string;
};

export function PageHero({ kicker, title, subtitle }: PageHeroProps) {
  return (
    <section className="rtt-hero">
      <p className="rtt-hero-kicker">{kicker}</p>

      <h1 className="rtt-hero-title">
        {title.split(" ").map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h1>

      {subtitle ? <p className="rtt-hero-subtitle">{subtitle}</p> : null}
    </section>
  );
}