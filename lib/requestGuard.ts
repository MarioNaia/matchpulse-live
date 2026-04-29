let requestCount = 0;
let currentDay = new Date().toISOString().slice(0, 10);

export function canMakeApiRequest() {
  const today = new Date().toISOString().slice(0, 10);

  if (today !== currentDay) {
    currentDay = today;
    requestCount = 0;
  }

  const max = Number(process.env.MAX_DAILY_API_REQUESTS ?? 80);
  return requestCount < max;
}

export function recordApiRequest() {
  requestCount += 1;
}

export function getRequestCount() {
  return requestCount;
}