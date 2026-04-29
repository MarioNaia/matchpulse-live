import { NextResponse } from "next/server";
import { smartFormulaPredict } from "@/lib/smartFormula";
import { mlPredict } from "@/lib/mlModel";
import { PredictionMode } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json();

  const mode = (body.mode ?? "compare") as PredictionMode;
  const features = body.features;

  if (!features) {
    return NextResponse.json(
      { error: "Missing features" },
      { status: 400 }
    );
  }

  if (mode === "formula") {
    return NextResponse.json({
      mode,
      prediction: smartFormulaPredict(features),
    });
  }

  if (mode === "ml") {
    return NextResponse.json({
      mode,
      prediction: mlPredict(features),
    });
  }

  return NextResponse.json({
    mode: "compare",
    formula: smartFormulaPredict(features),
    ml: mlPredict(features),
  });
}