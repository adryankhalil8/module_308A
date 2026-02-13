// External API GET (no key)
export async function fetchKeywordSuggestions(query, { signal } = {}) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=8`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Enrich API failed (${res.status})`);
  const data = await res.json();

  // Datamuse returns [{word, score, ...}]
  return data.map((x) => x.word);
}
