import { ApiMatch, buildFeatures } from "./featureBuilder";

export function getGoalThreatScore(match: ApiMatch) {
  const f = buildFeatures(match);

  const attacksA = Number(match.teamA.stats?.attacks?.d_5 ?? 0);
  const attacksB = Number(match.teamB.stats?.attacks?.d_5 ?? 0);
  const shotsA = Number(match.teamA.stats?.shoots?.on_5 ?? 0);
  const shotsB = Number(match.teamB.stats?.shoots?.on_5 ?? 0);
  const cornersA = Number(match.teamA.stats?.corners?.c_5 ?? 0);
  const cornersB = Number(match.teamB.stats?.corners?.c_5 ?? 0);

  return (
    (attacksA + attacksB) * 1.4 +
    (shotsA + shotsB) * 4 +
    (cornersA + cornersB) * 2 +
    Math.max(0, 90 - f.minute) * 0.03
  );
}

export function getGoalThreatLabel(score: number) {
  if (score >= 18) return "High goal threat";
  if (score >= 10) return "Warming up";
  return "Low threat";
}

export function getGoalThreatColor(score: number) {
  if (score >= 18) return "bg-red-500";
  if (score >= 10) return "bg-yellow-400";
  return "bg-slate-500";
}