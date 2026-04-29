import { canMakeApiRequest, recordApiRequest } from "./requestGuard";

const BASE_URL = process.env.RAPIDAPI_BASE_URL!;
const API_KEY = process.env.RAPIDAPI_KEY!;
const HOST = process.env.RAPIDAPI_HOST!;

export async function footballFetch(path: string) {
  if (!canMakeApiRequest()) {
    throw new Error("Daily API request limit reached");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": HOST,
    },
    cache: "no-store",
  });

  recordApiRequest();

  if (!res.ok) {
    throw new Error(`Football API error: ${res.status}`);
  }

  return res.json();
}