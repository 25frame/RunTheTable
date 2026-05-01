import Link from "next/link";

const links = [
  ["/play", "Play"],
  ["/live", "Live"],
  ["/standings", "Standings"],
  ["/results", "Results"],
  ["/players", "Players"],
  ["/rules", "Rules"],
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rtt-red text-xl font-black italic">R</div>
          <div className="leading-none">
            <div className="text-2xl font-black italic tracking-tight text-white">RTT NYC</div>
            <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-white/45">Run The Table</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-black uppercase tracking-[0.12em] text-white/65 md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">{label}</Link>
          ))}
        </nav>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white/70 md:hidden">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2">{label}</Link>
        ))}
      </nav>
    </header>
  );
}
