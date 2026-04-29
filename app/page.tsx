import { MatchCard } from "@/components/MatchCard";
import { ApiMatch } from "@/lib/featureBuilder";
import { getGoalThreatScore } from "@/lib/hotGame";

async function getLiveMatches() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/live`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function HomePage() {
  const live = await getLiveMatches();
  const matches: ApiMatch[] = live.data?.result ?? [];

  const sortedMatches = [...matches].sort(
    (a, b) => getGoalThreatScore(b) - getGoalThreatScore(a)
  );

  const hotMatches = sortedMatches.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
            Live football intelligence
          </p>
          <h1 className="mt-2 text-5xl font-black tracking-tight">
            MatchPulse Live
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Real-time football win probability with goal-threat detection.
          </p>

          <div className="mt-4 text-sm text-slate-400">
            Source: {live.source} · API requests used today: {live.requestCount}
          </div>
        </div>

        {hotMatches.length > 0 && (
          <section className="mb-8 rounded-2xl border border-cyan-700 bg-slate-900 p-5">
            <h2 className="text-xl font-bold">Hot games right now</h2>
            <p className="mt-1 text-sm text-slate-400">
              Ranked by recent dangerous attacks, shots on target and corners.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {hotMatches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                >
                  <div className="text-xs uppercase text-cyan-400">
                    {match.championship?.name}
                  </div>

                  <div className="mt-2 font-bold">
                    {match.teamA.name} vs {match.teamB.name}
                  </div>

                  <div className="mt-2 text-2xl font-black">
                    {match.teamA.score?.f ?? "0"} -{" "}
                    {match.teamB.score?.f ?? "0"}
                  </div>

                  <div className="mt-2 text-sm text-slate-400">
                    Goal threat: {Math.round(getGoalThreatScore(match))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            No live matches returned right now.
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}