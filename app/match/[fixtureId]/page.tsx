import Link from "next/link";
import { PredictionPanel } from "@/components/PredictionPanel";
import { ApiMatch, buildFeatures } from "@/lib/featureBuilder";
import { smartFormulaPredict } from "@/lib/smartFormula";
import { mlPredict } from "@/lib/mlModel";
import { explainPrediction } from "@/lib/explainPrediction";
import { getGoalThreatLabel, getGoalThreatScore } from "@/lib/hotGame";

async function getLiveMatches() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/live`, {
    cache: "no-store",
  });

  return res.json();
}

function Stat({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number | null | undefined;
  away: string | number | null | undefined;
}) {
  return (
    <div className="grid grid-cols-[1fr_160px_1fr] border-b border-slate-800 py-2 text-sm">
      <div className="text-left font-semibold">{home ?? "-"}</div>
      <div className="text-center text-slate-400">{label}</div>
      <div className="text-right font-semibold">{away ?? "-"}</div>
    </div>
  );
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ fixtureId: string }>;
}) {
  const { fixtureId } = await params;
  const decodedFixtureId = decodeURIComponent(fixtureId);

  const live = await getLiveMatches();
  const matches: ApiMatch[] = live.data?.result ?? [];

  const match = matches.find(
    (m) => String(m.id).trim() === decodedFixtureId.trim()
  );

  if (!match) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <Link href="/" className="text-sm underline">
          Back to matches
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          Match not found in current live data.
        </div>
      </main>
    );
  }

  const features = buildFeatures(match);
  const formulaPrediction = smartFormulaPredict(features);
  const mlPrediction = mlPredict(features);

  const homeTeam = match.teamA.name ?? "Home";
  const awayTeam = match.teamB.name ?? "Away";
  const goalThreat = getGoalThreatScore(match);

  const explanation = explainPrediction(
    features,
    mlPrediction,
    homeTeam,
    awayTeam
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm text-cyan-400 underline">
          Back to matches
        </Link>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow">
          <div className="border-b border-slate-700 bg-slate-800 px-6 py-3 text-sm uppercase tracking-wide text-slate-300">
            {match.championship?.name ?? "Unknown competition"} ·{" "}
            {match.championship?.country ?? ""}
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 px-6 py-8">
            <h1 className="text-3xl font-black">{homeTeam}</h1>

            <div className="rounded bg-white px-8 py-3 text-4xl font-black text-slate-950">
              {match.teamA.score?.f ?? "0"} - {match.teamB.score?.f ?? "0"}
            </div>

            <h1 className="text-right text-3xl font-black">{awayTeam}</h1>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-6 py-3 text-sm text-slate-300">
            <span>Minute: {features.minute} min</span>
            <span>Source: {live.source}</span>
            <span>Requests: {live.requestCount}</span>
            <span>
              Goal threat: {Math.round(goalThreat)} ·{" "}
              {getGoalThreatLabel(goalThreat)}
            </span>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <PredictionPanel
            title="Smart Formula"
            prediction={formulaPrediction}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />

          <PredictionPanel
            title="ML Model"
            prediction={mlPrediction}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">Explanation</h2>
          <p className="mt-2 text-slate-300">{explanation}</p>
        </section>

<section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
  <h2 className="text-xl font-bold">Live match details</h2>

  <div className="mt-4">
    <Stat
      label="Possession"
      home={match.teamA.stats?.possession}
      away={match.teamB.stats?.possession}
    />
    <Stat
      label="Shots"
      home={match.teamA.stats?.shoots?.t}
      away={match.teamB.stats?.shoots?.t}
    />
    <Stat
      label="Shots on target"
      home={match.teamA.stats?.shoots?.on}
      away={match.teamB.stats?.shoots?.on}
    />
    <Stat
      label="Dangerous attacks"
      home={match.teamA.stats?.attacks?.d}
      away={match.teamB.stats?.attacks?.d}
    />
    <Stat
      label="Dangerous attacks last 5"
      home={match.teamA.stats?.attacks?.d_5}
      away={match.teamB.stats?.attacks?.d_5}
    />
  </div>

  <details className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4">
    <summary className="cursor-pointer font-semibold text-cyan-400">
      Show all live stats
    </summary>

    <div className="mt-4">
      <Stat label="Attacks" home={match.teamA.stats?.attacks?.n} away={match.teamB.stats?.attacks?.n} />
      <Stat label="Attacks last 15" home={match.teamA.stats?.attacks?.n_15} away={match.teamB.stats?.attacks?.n_15} />
      <Stat label="Attacks last 5" home={match.teamA.stats?.attacks?.n_5} away={match.teamB.stats?.attacks?.n_5} />
      <Stat label="Dangerous attacks last 15" home={match.teamA.stats?.attacks?.d_15} away={match.teamB.stats?.attacks?.d_15} />
      <Stat label="Shots off target" home={match.teamA.stats?.shoots?.off} away={match.teamB.stats?.shoots?.off} />
      <Stat label="Shots off target last 15" home={match.teamA.stats?.shoots?.off_15} away={match.teamB.stats?.shoots?.off_15} />
      <Stat label="Shots off target last 5" home={match.teamA.stats?.shoots?.off_5} away={match.teamB.stats?.shoots?.off_5} />
      <Stat label="Shots on target last 15" home={match.teamA.stats?.shoots?.on_15} away={match.teamB.stats?.shoots?.on_15} />
      <Stat label="Shots on target last 5" home={match.teamA.stats?.shoots?.on_5} away={match.teamB.stats?.shoots?.on_5} />
      <Stat label="Corners" home={match.teamA.stats?.corners?.t} away={match.teamB.stats?.corners?.t} />
      <Stat label="Corners first half" home={match.teamA.stats?.corners?.h} away={match.teamB.stats?.corners?.h} />
      <Stat label="Corners last 15" home={match.teamA.stats?.corners?.c_15} away={match.teamB.stats?.corners?.c_15} />
      <Stat label="Corners last 5" home={match.teamA.stats?.corners?.c_5} away={match.teamB.stats?.corners?.c_5} />
      <Stat label="Fouls" home={match.teamA.stats?.fouls?.t} away={match.teamB.stats?.fouls?.t} />
      <Stat label="Yellow cards" home={match.teamA.stats?.fouls?.y_c} away={match.teamB.stats?.fouls?.y_c} />
      <Stat label="Second yellow / red" home={match.teamA.stats?.fouls?.y_t_r_c} away={match.teamB.stats?.fouls?.y_t_r_c} />
      <Stat label="Red cards" home={match.teamA.stats?.fouls?.r_c} away={match.teamB.stats?.fouls?.r_c} />
      <Stat label="Penalties" home={match.teamA.stats?.penalties} away={match.teamB.stats?.penalties} />
      <Stat label="Substitutions" home={match.teamA.stats?.substitutions} away={match.teamB.stats?.substitutions} />
      <Stat label="Injuries" home={match.teamA.stats?.injuries} away={match.teamB.stats?.injuries} />
      <Stat label="Dominance avg 2.5" home={match.teamA.stats?.dominance_avg_2_5} away={match.teamB.stats?.dominance_avg_2_5} />
    </div>
  </details>

  <details className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4">
    <summary className="cursor-pointer font-semibold text-cyan-400">
      Show team form and performance data
    </summary>

    <div className="mt-4">
      <Stat label="League position" home={match.teamA.position} away={match.teamB.position} />
      <Stat label="Last 5 matches" home={match.teamA.perf?.l_5_matches} away={match.teamB.perf?.l_5_matches} />
      <Stat label="Avg game goals" home={match.teamA.perf?.avg_game_goals} away={match.teamB.perf?.avg_game_goals} />
      <Stat label="Avg goals scored" home={match.teamA.perf?.avg_goals_scored} away={match.teamB.perf?.avg_goals_scored} />
      <Stat label="Avg goals conceded" home={match.teamA.perf?.avg_goals_conceded} away={match.teamB.perf?.avg_goals_conceded} />
      <Stat label="BTTS %" home={match.teamA.perf?.btts} away={match.teamB.perf?.btts} />
      <Stat label="Total goals scored" home={match.teamA.perf?.tot_goals_scored} away={match.teamB.perf?.tot_goals_scored} />
      <Stat label="Total goals conceded" home={match.teamA.perf?.tot_goals_conceded} away={match.teamB.perf?.tot_goals_conceded} />
    </div>
  </details>
</section>

<section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
  <details>
    <summary className="cursor-pointer text-xl font-bold text-cyan-400">
      Raw endpoint data
    </summary>

    <pre className="mt-4 max-h-[500px] overflow-auto rounded bg-slate-950 p-4 text-xs text-slate-300">
      {JSON.stringify(match, null, 2)}
    </pre>
  </details>
</section>
      </div>
    </main>
  );
}