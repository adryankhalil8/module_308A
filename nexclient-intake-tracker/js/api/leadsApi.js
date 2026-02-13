export const LEADS_API_BASE = "http://localhost:3001"; // CHANGE THIS
const RESOURCE = "leads";

function toQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
  });
  return usp.toString();
}

// GET list (with pagination + optional search)
export async function fetchLeads({ page, limit, search }) {
  // MockAPI supports page/limit + sort in many setups. If yours differs, we can adapt.
  const qs = toQuery({ page, limit, sortBy: "createdAt", order: "desc", search });

  const res = await fetch(`${LEADS_API_BASE}/${RESOURCE}?${qs}`);
  if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);
  const data = await res.json();

  // MockAPI may not return total count reliably. We'll approximate with length.
  return { items: data, total: data.length };
}

export async function createLead(payload) {
  const res = await fetch(`${LEADS_API_BASE}/${RESOURCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to create lead (${res.status})`);
  return res.json();
}

export async function patchLead(id, patch) {
  const res = await fetch(`${LEADS_API_BASE}/${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Failed to update lead (${res.status})`);
  return res.json();
}
