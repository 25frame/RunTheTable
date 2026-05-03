import { LiveScoreboard } from "@/components/LiveScoreboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LivePage() {
  return (
    <main className="rtt-shell text-white">
      <LiveScoreboard />
    </main>
  );
}
