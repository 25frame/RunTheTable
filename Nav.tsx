import Link from "next/link";

const links = [
  ["/", "Home"],
  ["/play", "Play"],
  ["/standings", "Standings"],
  ["/results", "Results"],
  ["/players", "Players"],
  ["/rules", "Rules"],
  ["/admin", "Admin"],
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-black uppercase tracking-tight">
          <span className="text-white">RTT</span><span className="text-rtt-red"> NYC</span>
        </Link>
        <nav className="hidden gap-5 text-xs font-bold uppercase tracking-[0.18em] text-white/65 md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
