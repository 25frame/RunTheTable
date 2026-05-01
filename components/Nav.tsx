import Link from "next/link";

const links = [
  ["/play", "Play"],
  ["/standings", "Standings"],
  ["/results", "Results"],
  ["/players", "Players"],
  ["/rules", "Rules"],
  ["/admin", "Admin"],
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rtt-red text-lg font-black italic">
            R
          </div>
          <div className="leading-none">
            <div className="text-xl font-black italic tracking-tight text-white">
              RTT NYC
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
              Run The Table
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-black uppercase tracking-[0.12em] text-white/65 md:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
