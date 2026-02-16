export const LEADS_API_BASE = "http://localhost:3001";
const RESOURCE = "leads";
const REQUEST_TIMEOUT = 10000; // 10 seconds

function toQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
  });
  return usp.toString();
}

// Helper: fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timeout - is your backend running?');
    }
    throw err;
  }
}

// Helper: enhanced error messages
function getErrorMessage(status, action) {
  const messages = {
    400: `Bad request - invalid ${action} data`,
    401: 'Unauthorized - check API credentials',
    403: 'Forbidden - access denied',
    404: `${action} not found`,
    500: 'Server error - try again later',
    502: 'Bad gateway - backend may be down',
    503: 'Service unavailable - backend may be down',
  };
  return messages[status] || `Failed to ${action} (${status})`;
}

// GET list (with pagination + optional search)
export async function fetchLeads({ page, limit, search }) {
  const qs = toQuery({ 
    page, 
    limit, 
    sortBy: "createdAt", 
    order: "desc", 
    search 
  });

  try {
    const res = await fetchWithTimeout(`${LEADS_API_BASE}/${RESOURCE}?${qs}`);
    
    if (!res.ok) {
      throw new Error(getErrorMessage(res.status, 'fetch leads'));
    }
    
    const data = await res.json();

    // Validate response
    if (!Array.isArray(data)) {
      console.warn('Unexpected API response format:', data);
      return { items: [], total: 0 };
    }

    return { 
      items: data, 
      total: data.length 
    };
  } catch (err) {
    console.error('fetchLeads error:', err);
    throw new Error(err.message || 'Network error - check your connection');
  }
}

export async function createLead(payload) {
  try {
    const res = await fetchWithTimeout(
      `${LEADS_API_BASE}/${RESOURCE}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error(getErrorMessage(res.status, 'create lead'));
    }

    return await res.json();
  } catch (err) {
    console.error('createLead error:', err);
    throw new Error(err.message || 'Failed to save lead');
  }
}

export async function patchLead(id, patch) {
  try {
    const res = await fetchWithTimeout(
      `${LEADS_API_BASE}/${RESOURCE}/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }
    );

    if (!res.ok) {
      throw new Error(getErrorMessage(res.status, 'update lead'));
    }

    return await res.json();
  } catch (err) {
    console.error('patchLead error:', err);
    throw new Error(err.message || 'Failed to update lead');
  }
}

// Helper: Check if backend is reachable
export async function checkBackendHealth() {
  try {
    const res = await fetchWithTimeout(`${LEADS_API_BASE}/${RESOURCE}?limit=1`, {}, 3000);
    return res.ok;
  } catch {
    return false;
  }
}