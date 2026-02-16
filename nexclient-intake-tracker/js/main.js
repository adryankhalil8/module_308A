import { store } from "./state/store.js";
import { fetchLeads, createLead, patchLead, checkBackendHealth } from "./api/leadsApi.js";
import { fetchKeywordSuggestions } from "./api/enrichApi.js";
import { renderLeadList, renderPills } from "./ui/render.js";

const leadForm = document.getElementById("leadForm");
const formMsg = document.getElementById("formMsg");

const companyName = document.getElementById("companyName");
const contactName = document.getElementById("contactName");
const email = document.getElementById("email");
const website = document.getElementById("website");
const industry = document.getElementById("industry");
const notes = document.getElementById("notes");

const enrichBox = document.getElementById("enrichBox");

const leadList = document.getElementById("leadList");
const listMsg = document.getElementById("listMsg");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const refreshBtn = document.getElementById("refreshBtn");

/* --------------------------
   Event loop control helpers
--------------------------- */
function debounce(fn, ms = 300) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/* --------------------------
   Load list (GET) with enhanced error handling
--------------------------- */
async function loadLeads() {
  const requestId = ++store.latestListRequestId;
  listMsg.textContent = "Loading leads...";
  listMsg.className = "muted";

  try {
    const { items } = await fetchLeads({
      page: store.page,
      limit: store.limit,
      search: store.search,
    });

    // Ignore stale/out-of-order responses
    if (requestId !== store.latestListRequestId) return;

    // Client-side status filter (reliable even if API search differs)
    const filtered = (store.status === "all")
      ? items
      : items.filter((x) => (x.status || "new") === store.status);

    store.leads = filtered;

    renderLeadList(leadList, store.leads, handleLeadAction);

    pageInfo.textContent = `Page ${store.page}`;
    listMsg.textContent = "";

    // Update button states
    prevBtn.disabled = store.page <= 1;
    nextBtn.disabled = filtered.length < store.limit;

  } catch (err) {
    if (requestId !== store.latestListRequestId) return;
    
    listMsg.className = "muted error";
    listMsg.innerHTML = `
      ⚠️ ${err.message}
      ${err.message.includes('backend') || err.message.includes('timeout') 
        ? '<br><small>Make sure your backend server is running on port 3001</small>' 
        : ''}
    `;
    
    // Show empty state on error
    leadList.innerHTML = '<div class="muted">Unable to load leads.</div>';
  }
}

/* --------------------------
   POST: Create lead with validation
--------------------------- */
leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "Saving...";
  formMsg.className = "muted";

  const payload = {
    companyName: companyName.value.trim(),
    contactName: contactName.value.trim(),
    email: email.value.trim(),
    website: website.value.trim(),
    industry: industry.value.trim(),
    notes: notes.value.trim(),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  // Client-side validation
  if (!payload.companyName || !payload.contactName || !payload.email) {
    formMsg.textContent = "Please fill in required fields";
    formMsg.className = "muted error";
    setTimeout(() => (formMsg.textContent = ""), 2000);
    return;
  }

  try {
    await createLead(payload);
    formMsg.textContent = "✅ Lead saved successfully!";
    formMsg.className = "muted success";
    leadForm.reset();

    // Clear enrichment suggestions
    renderPills(enrichBox, []);

    // Reset list view and reload
    store.page = 1;
    await loadLeads();
  } catch (err) {
    formMsg.textContent = `❌ ${err.message}`;
    formMsg.className = "muted error";
  } finally {
    setTimeout(() => (formMsg.textContent = ""), 3000);
  }
});

/* --------------------------
   PATCH: Update lead status
--------------------------- */
async function handleLeadAction(lead, action) {
  const [type, value] = action.split(":");
  if (type !== "status") return;

  // Optimistic UI update
  const originalStatus = lead.status;
  lead.status = value;
  renderLeadList(leadList, store.leads, handleLeadAction);

  listMsg.textContent = "Updating status...";
  listMsg.className = "muted";

  try {
    await patchLead(lead.id, { status: value });
    await loadLeads();
    listMsg.textContent = "";
  } catch (err) {
    // Revert on error
    lead.status = originalStatus;
    renderLeadList(leadList, store.leads, handleLeadAction);
    
    listMsg.textContent = `❌ ${err.message}`;
    listMsg.className = "muted error";
    setTimeout(() => (listMsg.textContent = ""), 3000);
  }
}

/* --------------------------
   Search + filter (GET)
--------------------------- */
const debouncedSearch = debounce(async () => {
  store.search = searchInput.value.trim();
  store.page = 1;
  await loadLeads();
}, 350);

searchInput.addEventListener("input", debouncedSearch);

statusFilter.addEventListener("change", async () => {
  store.status = statusFilter.value;
  store.page = 1;
  await loadLeads();
});

/* --------------------------
   Pagination
--------------------------- */
prevBtn.addEventListener("click", async () => {
  if (store.page > 1) {
    store.page--;
    await loadLeads();
  }
});

nextBtn.addEventListener("click", async () => {
  store.page++;
  await loadLeads();
});

refreshBtn.addEventListener("click", async () => {
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Refreshing...";
  await loadLeads();
  refreshBtn.disabled = false;
  refreshBtn.textContent = "Refresh";
});

/* --------------------------
   External GET enrichment (Datamuse)
   - abort previous
   - ignore stale
   - graceful degradation
--------------------------- */
const debouncedEnrich = debounce(async () => {
  const q = companyName.value.trim();

  // Clear if empty
  if (!q || q.length < 2) {
    renderPills(enrichBox, []);
    return;
  }

  // Abort previous request
  if (store.enrichAbort) store.enrichAbort.abort();
  const controller = new AbortController();
  store.enrichAbort = controller;

  const requestId = ++store.latestEnrichRequestId;

  try {
    const words = await fetchKeywordSuggestions(q, { signal: controller.signal });

    // Ignore stale responses
    if (requestId !== store.latestEnrichRequestId) return;

    renderPills(enrichBox, words);
  } catch (err) {
    // Silent failure for enrichment (non-critical feature)
    if (err.name === "AbortError") return;
    if (requestId === store.latestEnrichRequestId) {
      renderPills(enrichBox, []);
    }
  }
}, 350);

companyName.addEventListener("input", debouncedEnrich);

/* --------------------------
   Startup: Check backend health
--------------------------- */
async function initialize() {
  renderPills(enrichBox, []);
  
  // Check if backend is accessible
  const isHealthy = await checkBackendHealth();
  
  if (!isHealthy) {
    listMsg.innerHTML = `
      ⚠️ Cannot connect to backend server
      <br><small>Make sure your backend is running on http://localhost:3001</small>
    `;
    listMsg.className = "muted error";
    leadList.innerHTML = '<div class="muted">Backend unavailable</div>';
    return;
  }
  
  await loadLeads();
}

initialize();