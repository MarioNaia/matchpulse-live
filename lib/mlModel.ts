import { MatchFeatures, Prediction } from "./types";

type Coefficients = {
  minute: number;
  scoreDiff: number;
  shotsDiff: number;
  shotsOnTargetDiff: number;
  possessionDiff: number;
  redCardDiff: number;
  dangerousAttacksDiff: number;
  dangerousAttacksLast5Diff: number;
  cornersDiff: number;
  cornersLast5Diff: number;
  intercept: number;
};

const COEFFICIENTS: Record<"homeWin" | "draw" | "awayWin", Coefficients> = {
  homeWin: {
    minute: 0.10672501603703266,
    scoreDiff: 3.868192812232546,
    shotsDiff: 0.19576950128200066,
    shotsOnTargetDiff: 0.8615972828638908,
    possessionDiff: 0.25684158346746033,
    redCardDiff: 0.6052625329692309,
    dangerousAttacksDiff: 0.28269766564589155,
    dangerousAttacksLast5Diff: 0.4361685641449562,
    cornersDiff: 0.134880189388507,
    cornersLast5Diff: 0.1972646996525086,
    intercept: 0.8329155234752245,
  },
  draw: {
    minute: -0.1856498312584606,
    scoreDiff: -0.08746003573929804,
    shotsDiff: -0.04943886181303276,
    shotsOnTargetDiff: -0.00851231932699595,
    possessionDiff: 0.04522658823589725,
    redCardDiff: 0.007839047853093438,
    dangerousAttacksDiff: 0.06737514721820079,
    dangerousAttacksLast5Diff: 0.004838070601934115,
    cornersDiff: -0.0005547862540801977,
    cornersLast5Diff: -0.0312310843251402,
    intercept: -0.17682262942020788,
  },
  awayWin: {
    minute: 0.07892481522142805,
    scoreDiff: -3.780732776493249,
    shotsDiff: -0.14633063946896768,
    shotsOnTargetDiff: -0.8530849635368952,
    possessionDiff: -0.3020681717033585,
    redCardDiff: -0.6131015808223237,
    dangerousAttacksDiff: -0.35007281286409214,
    dangerousAttacksLast5Diff: -0.44100663474688984,
    cornersDiff: -0.1343254031344272,
    cornersLast5Diff: -0.16603361532736907,
    intercept: -0.6560928940550111,
  },
};

function dot(f: MatchFeatures, c: Coefficients) {
  return (
    c.intercept +
    f.minute * c.minute +
    f.scoreDiff * c.scoreDiff +
    f.shotsDiff * c.shotsDiff +
    f.shotsOnTargetDiff * c.shotsOnTargetDiff +
    f.possessionDiff * c.possessionDiff +
    f.redCardDiff * c.redCardDiff +
    f.dangerousAttacksDiff * c.dangerousAttacksDiff +
    f.dangerousAttacksLast5Diff * c.dangerousAttacksLast5Diff +
    f.cornersDiff * c.cornersDiff +
    f.cornersLast5Diff * c.cornersLast5Diff
  );
}

function softmax(values: number[]) {
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((acc, value) => acc + value, 0);
  return exps.map((value) => value / sum);
}

export function mlPredict(f: MatchFeatures): Prediction {
  const scores = [
    dot(f, COEFFICIENTS.homeWin),
    dot(f, COEFFICIENTS.draw),
    dot(f, COEFFICIENTS.awayWin),
  ];

  const [homeWin, draw, awayWin] = softmax(scores);

  return { homeWin, draw, awayWin };
}