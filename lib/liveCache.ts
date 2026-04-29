type CacheEntry = {
  data: unknown;
  timestamp: number;
};

let cache: CacheEntry | null = null;

export function getCachedLiveData() {
  const cacheSeconds = Number(process.env.API_CACHE_SECONDS ?? 120);

  if (!cache) return null;

  const ageMs = Date.now() - cache.timestamp;
  const isFresh = ageMs < cacheSeconds * 1000;

  return isFresh ? cache.data : null;
}

export function setCachedLiveData(data: unknown) {
  cache = {
    data,
    timestamp: Date.now(),
  };
}