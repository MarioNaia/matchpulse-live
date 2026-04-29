export type MatchFeatures = {
  minute: number;
  homeGoals: number;
  awayGoals: number;
  scoreDiff: number;
  shotsDiff: number;
  shotsOnTargetDiff: number;
  possessionDiff: number;
  redCardDiff: number;
  dangerousAttacksDiff: number;
  dangerousAttacksLast5Diff: number;
  cornersDiff: number;
  cornersLast5Diff: number;
};

export type Prediction = {
  homeWin: number;
  draw: number;
  awayWin: number;
};

export type PredictionMode = "formula" | "ml" | "compare";