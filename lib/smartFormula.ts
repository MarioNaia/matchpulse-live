import { MatchFeatures, Prediction } from "./types";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function softmax(scores: number[]) {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((x) => x / sum);
}

export function smartFormulaPredict(f: MatchFeatures): Prediction {
  const timeFactor = clamp(f.minute / 90, 0, 1);

  const homeScore =
    1.0 * f.scoreDiff * (0.6 + timeFactor) +
    0.04 * f.shotsDiff +
    0.12 * f.shotsOnTargetDiff +
    0.01 * f.possessionDiff -
    0.55 * f.redCardDiff +
    0.025 * f.dangerousAttacksDiff +
    0.08 * f.dangerousAttacksLast5Diff +
    0.04 * f.cornersDiff +
    0.08 * f.cornersLast5Diff;

  const drawScore =
    -1.1 * Math.abs(f.scoreDiff) +
    0.45 * (1 - timeFactor) -
    0.02 * Math.abs(f.shotsOnTargetDiff) -
    0.02 * Math.abs(f.dangerousAttacksLast5Diff);

  const awayScore = -homeScore;

  const [homeWin, draw, awayWin] = softmax([
    homeScore,
    drawScore,
    awayScore,
  ]);

  return { homeWin, draw, awayWin };
}