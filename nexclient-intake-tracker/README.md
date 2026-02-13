# Client Intake Tracker (NexClient Intake Tracker – Class Build)

A lightweight client lead intake and tracking web app built to demonstrate advanced asynchronous JavaScript concepts. The app allows users to create leads, view them in a list, search/filter, paginate results, and update lead status. It also demonstrates consuming an external API for enrichment data.

This version is built for class using **JSON Server** as a local REST API.

---

## Features

- **Create Leads (POST)**  
  Submit a new lead via the intake form.

- **View Leads (GET)**  
  Fetches and displays leads from a REST endpoint.

- **Search + Filter + Pagination (GET + UI state)**  
  - Search by free-text query  
  - Filter by status  
  - Paginate through results

- **Update Lead Status (PATCH)**  
  Update the status of a lead (New → Qualified → Contacted → Closed).

- **External API Enrichment (GET)**  
  Uses an external public API (Datamuse) to fetch keyword suggestions based on the company name input.

- **Async Safety (Event Loop / Race Condition Prevention)**
  - Debounced search/enrichment inputs
  - AbortController for cancelling outdated enrichment requests
  - Request ID checks to ignore stale list responses

- **Modular Code Organization**
  JavaScript is split into multiple module files under `/js`.

---

## Tech Stack

- HTML / CSS
- JavaScript (ES Modules)
- JSON Server (local REST API for CRUD)
- Fetch API for network requests

---

## Project Structure

.
├── index.html
├── styles.css
├── db.json
└── js
├── main.js
├── api
│ ├── leadsApi.js
│ └── enrichApi.js
├── state
│ └── store.js
└── ui
└── render.js


---

---

## Rubric Requirements Checklist (How This Project Meets Them)

### 1) Use fetch API or Axios with an external web API (20%)
✅ **Met**  
This app uses the **Fetch API** to communicate with an external public API (Datamuse) and uses that data to populate an enrichment feature in the UI.

- External API: Datamuse (keyword suggestion service)
- Where:
  - `js/api/enrichApi.js` → `fetchKeywordSuggestions()`
  - `js/main.js` → debounced enrichment handler on company name input
  - `js/ui/render.js` → `renderPills()` displays results in the page

**User-facing result:** As the user types a company name, the app shows suggestion “pills” populated from external API data.

---

### 2) Create user interaction with the API via search/pagination/gallery using GET (15%)
✅ **Met**  
This app uses **GET** requests with user-driven interaction in two areas:

**A) Lead list retrieval (GET)**
- Fetches leads from the local REST API (`json-server`)
- Supports pagination via `_page` and `_limit`
- Supports search via `q` (full text search)
- Where:
  - `js/api/leadsApi.js` → `fetchLeads()`
  - `js/main.js` → `loadLeads()` called by pagination + search inputs

**B) External enrichment retrieval (GET)**
- Fetches keyword suggestions from Datamuse based on the company name input
- Where:
  - `js/api/enrichApi.js` → external GET call

**User-facing result:** Search, pagination, and enrichment are all driven by user actions and use GET requests to retrieve associated data.

---

### 3) Enable user manipulation of API data via POST / PUT / PATCH (15%)
✅ **Met**  
This app supports **creating and updating data** in the API.

- **POST**: create a new lead record
- **PATCH**: update an existing lead’s status (New → Qualified → Contacted → Closed)

Where:
- `js/api/leadsApi.js` → `createLead()` and `patchLead()`
- `js/main.js` → form submission handler + status action handler

**User-facing result:** Users can add leads and update their pipeline status, and those changes persist in the database.

---

### 4) Use Promises and async/await (15%)
✅ **Met**  
Async operations use `async/await` syntax throughout, and Promises are utilized via the Fetch API and debounced event logic.

Where:
- `js/api/leadsApi.js` → async CRUD operations
- `js/api/enrichApi.js` → async external API request
- `js/main.js` → async UI workflows and request handling

---

### 5) Organize code into at least 3 modules using imports/exports (3%)
✅ **Met**  
This project uses **multiple ES modules** (more than the minimum requirement) and imports functions/data across files.

Modules:
- `js/main.js`
- `js/api/leadsApi.js`
- `js/api/enrichApi.js`
- `js/state/store.js`
- `js/ui/render.js`

---

### 6) Avoid event loop issues (race conditions/out-of-order responses) (5%)
✅ **Met**  
This project implements multiple safeguards to prevent common async UI bugs:

- **Debouncing** to reduce request spam
- **AbortController** to cancel outdated enrichment requests
- **Request ID checks** to ignore stale/out-of-order responses

Where:
- `js/state/store.js` → request IDs + abort controller references
- `js/main.js` → request ID guards and abort logic

---

### 7) Engage user experience using HTML/CSS (5%)
✅ **Met**  
The interface is designed as a simple dashboard with:
- Clear layout (intake form + leads panel)
- Status badges
- One-click pipeline actions
- Feedback messaging for save/update states

Where:
- `index.html`
- `styles.css`

---

### 8) Run without errors / comment out blockers (partial credit) (10%)
✅ **Met (when API is running)**  
The app runs cleanly with the local JSON Server API running.

If errors occur, they are typically due to the API not running. Start the API with:

```bash
json-server --watch db.json --port 3001
