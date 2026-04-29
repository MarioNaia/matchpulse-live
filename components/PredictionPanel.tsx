import { Prediction } from "@/lib/types";

type Props = {
  title: string;
  prediction: Prediction;
  homeTeam: string;
  awayTeam: string;
};

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function PredictionPanel({
  title,
  prediction,
  homeTeam,
  awayTeam,
}: Props) {
  const rows = [
    { label: homeTeam, value: prediction.homeWin },
    { label: "Draw", value: prediction.draw },
    { label: awayTeam, value: prediction.awayWin },
  ];

  const maxValue = Math.max(...rows.map((r) => r.value));

  return (
    <div className="rounded-2xl border border-slate-600 bg-slate-900 p-4 shadow-sm">
      <h3 className="mb-4 font-bold text-white">{title}</h3>

      <div className="space-y-4">
        {rows.map((row) => {
          const isBest = row.value === maxValue;

          return (
            <div key={row.label}>
              <div className="mb-1 flex justify-between text-sm text-white">
                <span>{row.label}</span>
                <span className="font-bold">{pct(row.value)}</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={`h-3 rounded-full ${
                    isBest ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{ width: pct(row.value) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}