import { LiveScoreboard } from "@/components/LiveScoreboard";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function LiveScoresPage() { return <main className="rtt-grid min-h-screen px-4 py-8 text-white md:px-5"><LiveScoreboard /></main>; }
