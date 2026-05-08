import { getRTTData } from "@/lib/googleData";
import { cfg } from "@/lib/siteConfig";
import { PageHero } from "@/components/PageHero";

export const dynamic = "force-dynamic";

const DEFAULT_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/Ping+Pong+Table%F0%9F%8F%93/@40.7007572,-74.0276943,13z/data=!3m1!4b1?entry=ttu";

export default async function PlacesPage() {
  const data = await getRTTData();
  const config = data.config;
  const places = data.places || [];

  const featured = places.filter((place) => place.featured);
  const regular = places.filter((place) => !place.featured);

  const googleMapsUrl = cfg(
    config,
    "places.googleMapsUrl",
    DEFAULT_GOOGLE_MAPS_URL
  );

  const googleMapsLabel = cfg(
    config,
    "places.googleMapsLabel",
    "Find More Tables"
  );

  return (
    <main className="rtt-page">
      <section className="rtt-page-inner">
        <PageHero
          kicker={cfg(config, "places.kicker", "Where To Play")}
          tagline={cfg(config, "site.tagline", "NYC Street Table Tennis")}
          title={cfg(config, "places.title", "Places")}
          subtitle={cfg(
            config,
            "places.subtitle",
            "Verified and known table tennis spots around NYC."
          )}
        />

        <section className="grid gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rtt-secondary text-center"
          >
            {googleMapsLabel}
          </a>
        </section>

        {featured.length ? (
          <section className="rtt-section">
            <p className="rtt-mini-kicker">
              {cfg(config, "places.featuredLabel", "Featured Spots")}
            </p>

            <div className="mt-4 rtt-list">
              {featured.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  sourceLabel={cfg(config, "places.sourceButton", "Source")}
                  directionsLabel={cfg(
                    config,
                    "places.directionsButton",
                    "Directions"
                  )}
                  hot
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="rtt-section">
          <p className="rtt-mini-kicker">
            {cfg(config, "places.allLabel", "All Places")}
          </p>

          <div className="mt-4 rtt-list">
            {regular.length || featured.length ? (
              regular.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  sourceLabel={cfg(config, "places.sourceButton", "Source")}
                  directionsLabel={cfg(
                    config,
                    "places.directionsButton",
                    "Directions"
                  )}
                />
              ))
            ) : (
              <div className="rtt-mobile-card">
                <p className="font-black uppercase text-white/60">
                  {cfg(config, "places.empty", "No places loaded yet.")}
                </p>

                {data.error ? (
                  <p className="mt-2 text-xs text-red-300">
                    Feed error: {data.error}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function PlaceCard({
  place,
  sourceLabel,
  directionsLabel,
  hot = false,
}: {
  place: {
    id: string;
    name: string;
    borough: string;
    neighborhood: string;
    location: string;
    indoorOutdoor: string;
    tableCount: number;
    equipmentAvailable: string;
    cost: string;
    hoursNotes: string;
    sourceUrl: string;
    status: string;
    featured: boolean;
  };
  sourceLabel: string;
  directionsLabel: string;
  hot?: boolean;
}) {
  const mapsQuery = encodeURIComponent(
    [place.name, place.location, place.borough, "NYC"].filter(Boolean).join(" ")
  );

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <article
      className={hot ? "rtt-mobile-card rtt-mobile-card-hot" : "rtt-mobile-card"}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="rtt-mini-kicker">
            {place.borough || "NYC"} / {place.indoorOutdoor || "Unknown"}
          </p>

          <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em]">
            {place.name}
          </h2>
        </div>

        {place.featured ? (
          <span className="shrink-0 rounded-full bg-rtt-red px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white">
            Featured
          </span>
        ) : null}
      </div>

      {place.neighborhood || place.location ? (
        <p className="mt-3 text-sm font-bold leading-6 text-white/55">
          {[place.neighborhood, place.location].filter(Boolean).join(" — ")}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <MiniDetail label="Tables" value={place.tableCount || "?"} />
        <MiniDetail label="Cost" value={place.cost || "Check"} />
        <MiniDetail label="Status" value={place.status || "Active"} />
      </div>

      {place.equipmentAvailable || place.hoursNotes ? (
        <div className="mt-4 rounded-2xl bg-black/40 p-4">
          {place.equipmentAvailable ? (
            <p className="text-sm font-bold leading-6 text-white/60">
              {place.equipmentAvailable}
            </p>
          ) : null}

          {place.hoursNotes ? (
            <p className="mt-2 text-sm font-bold leading-6 text-white/45">
              {place.hoursNotes}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="rtt-secondary text-center"
        >
          {directionsLabel}
        </a>

        {place.sourceUrl ? (
          <a
            href={place.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="rtt-secondary text-center"
          >
            {sourceLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function MiniDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-black/45 px-3 py-3">
      <p className="truncate text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black uppercase text-white">
        {value}
      </p>
    </div>
  );
}