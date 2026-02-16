// External API GET (no key) with improved error handling and timeout
export async function fetchKeywordSuggestions(query, { signal } = {}) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(query)}&max=8`;

  try {
    // Add timeout to prevent hanging requests
    const timeoutId = setTimeout(() => {
      if (signal && !signal.aborted) {
        console.warn('Datamuse request timeout after 5s');
      }
    }, 5000);

    const res = await fetch(url, { 
      signal,
      // Add headers for better compatibility
      headers: {
        'Accept': 'application/json',
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Datamuse API error: ${res.status} ${res.statusText}`);
      throw new Error(`Enrich API failed (${res.status})`);
    }

    const data = await res.json();

    // Validate response structure
    if (!Array.isArray(data)) {
      console.warn('Unexpected Datamuse response format:', data);
      return [];
    }

    // Datamuse returns [{word, score, ...}]
    return data
      .filter(x => x && x.word) // Filter out invalid entries
      .map(x => x.word)
      .slice(0, 8); // Ensure max 8 results

  } catch (err) {
    // Don't log abort errors (they're expected)
    if (err.name !== 'AbortError') {
      console.error('Datamuse fetch error:', err.message);
    }
    // Return empty array on any error to gracefully degrade
    return [];
  }
}