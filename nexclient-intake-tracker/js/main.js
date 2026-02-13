import { store } from "./state/store.js";
import { fetchLeads, createLead, patchLead } from "./api/leadsApi.js";
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
   Load list (GET) with safety
--------------------------- */
async function loadLeads() {
  const requestId = ++store.latestListRequestId;
  listMsg.textContent = "Loading leads...";

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
  } catch (err) {
    if (requestId !== store.latestListRequestId) return;
    listMsg.textContent = `Error: ${err.message}`;
  }
}

/* --------------------------
   POST: Create lead
--------------------------- */
leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "Saving...";

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

  try {
    await createLead(payload);
    formMsg.textContent = "Saved ✅";
    leadForm.reset();

    // reset list view and reload
    store.page = 1;
    await loadLeads();
  } catch (err) {
    formMsg.textContent = `Error: ${err.message}`;
  } finally {
    setTimeout(() => (formMsg.textContent = ""), 1500);
  }
});

/* --------------------------
   PATCH: Update lead status
--------------------------- */
async function handleLeadAction(lead, action) {
  const [type, value] = action.split(":");
  if (type !== "status") return;

  listMsg.textContent = "Updating status...";

  try {
    await patchLead(lead.id, { status: value });
    await loadLeads();
    listMsg.textContent = "";
  } catch (err) {
    listMsg.textContent = `Error: ${err.message}`;
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

refreshBtn.addEventListener("click", loadLeads);

/* --------------------------
   External GET enrichment (Datamuse)
   - abort previous
   - ignore stale
--------------------------- */
const debouncedEnrich = debounce(async () => {
  const q = companyName.value.trim();

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
    if (err.name === "AbortError") return;
    renderPills(enrichBox, []);
  }
}, 350);

companyName.addEventListener("input", debouncedEnrich);

/* --------------------------
   Start
--------------------------- */
renderPills(enrichBox, []);
loadLeads();
