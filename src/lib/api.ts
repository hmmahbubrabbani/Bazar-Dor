const BASE_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
const BASE_URL_2 = "https://api.abcz.workers.dev/api/bazardor";


export async function fetchBazarApi(endpoint: string) {
  const urls = [`${BASE_URL_1}${endpoint}`, `${BASE_URL_2}${endpoint}`];

  for (const url of urls) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch from ${url}`);
      }

      return await res.json();
    } catch (error) {
      console.warn(`Primary API failed, trying alternative URL...`, error);
    }
  }

  throw new Error("All API endpoints failed!");
}