import { getRTTData } from "@/lib/googleData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JoinPage() {
  const data = await getRTTData();
  const formUrl = data?.formUrl || "#";

  return (
    <main className="rtt-shell text-white">
      <section className="rtt-max">
        <p className="rtt-kicker">Join</p>

        <h1 className="rtt-title">
          Get On
          <br />
          The Board
        </h1>

        <p className="rtt-subtitle">
          Sign up, show up, play tracked battles, and climb the board.
        </p>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xl font-black uppercase">
            First step: register.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/55">
            After you register, admin can place you into a match and your
            record will appear on the board.
          </p>

          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rtt-cta mt-6 w-full"
          >
            Open Registration
          </a>
        </div>
      </section>
    </main>
  );
}