import { MatchFeatures, Prediction } from "./types";

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function explainPrediction(
  features: MatchFeatures,
  prediction: Prediction,
  homeTeam: string,
  awayTeam: string
) {
  const winner =
    prediction.homeWin >= prediction.draw && prediction.homeWin >= prediction.awayWin
      ? homeTeam
      : prediction.awayWin >= prediction.draw
        ? awayTeam
        : "the draw";

  const reasons: string[] = [];

  if (features.scoreDiff > 0) {
    reasons.push(`${homeTeam} is leading`);
  } else if (features.scoreDiff < 0) {
    reasons.push(`${awayTeam} is leading`);
  } else {
    reasons.push("the match is currently level");
  }

  if (features.minute >= 70) {
    reasons.push("there is limited time left");
  }

  if (features.shotsOnTargetDiff > 0) {
    reasons.push(`${homeTeam} has more shots on target`);
  } else if (features.shotsOnTargetDiff < 0) {
    reasons.push(`${awayTeam} has more shots on target`);
  }

  if (features.possessionDiff > 10) {
    reasons.push(`${homeTeam} has more possession`);
  } else if (features.possessionDiff < -10) {
    reasons.push(`${awayTeam} has more possession`);
  }

  if (features.redCardDiff > 0) {
    reasons.push(`${homeTeam} has more red cards`);
  } else if (features.redCardDiff < 0) {
    reasons.push(`${awayTeam} has more red cards`);
  }

  return `The model currently favors ${winner}. ${reasons.join(", ")}. Probabilities: ${homeTeam} ${pct(
    prediction.homeWin
  )}, draw ${pct(prediction.draw)}, ${awayTeam} ${pct(prediction.awayWin)}.`;
}