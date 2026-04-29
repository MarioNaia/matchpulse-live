import Link from "next/link";
import { ApiMatch } from "@/lib/featureBuilder";
import {
  getGoalThreatColor,
  getGoalThreatLabel,
  getGoalThreatScore,
} from "@/lib/hotGame";

type Props = {
  match: ApiMatch;
};

export function MatchCard({ match }: Props) {
  const matchId = encodeURIComponent(String(match.id));
  const score = getGoalThreatScore(match);

  return (
    <Link
      href={`/match/${matchId}`}
      className="block overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-white shadow hover:border-cyan-400 transition"
    >
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-5 py-2 text-xs uppercase tracking-wide text-slate-300">
        <span>{match.championship?.name ?? "Unknown competition"}</span>

        <span className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${getGoalThreatColor(score)}`}
          />
          {getGoalThreatLabel(score)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-4">
        <div className="font-bold">{match.teamA.name}</div>

        <div className="rounded bg-white px-5 py-2 text-xl font-black text-slate-950">
          {match.teamA.score?.f ?? "0"} - {match.teamB.score?.f ?? "0"}
        </div>

        <div className="text-right font-bold">{match.teamB.name}</div>
      </div>

      <div className="flex items-center justify-between bg-slate-950 px-5 py-2 text-xs text-slate-300">
        <span>
          {match.timer ?? "Live"} · {match.in_play ? "In play" : "Live"}
        </span>

        <span>Goal threat score: {Math.round(score)}</span>
      </div>
    </Link>
  );
}