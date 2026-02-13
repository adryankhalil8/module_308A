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

## Setup & Run (Local)

### 1) Install Dependencies
You need Node.js installed. Then install JSON Server:

```bash
npm install -g json-server
2) Create db.json
In the project root, create a file called db.json:

{
  "leads": []
}
3) Start the API Server
From the project root:

json-server --watch db.json --port 3001
Confirm it works by visiting:

http://localhost:3001/leads
Expected output: []

4) Run the Frontend
Use VS Code Live Server (or any static server).
Typical Live Server URL:

http://127.0.0.1:5500/

Configuration
Local API Base URL
In js/api/leadsApi.js:

export const LEADS_API_BASE = "http://localhost:3001";
const RESOURCE = "leads";
External Enrichment API
In js/api/enrichApi.js, enrichment uses Datamuse (no key required):

https://api.datamuse.com/words?ml=<query>&max=8

API Endpoints Used (JSON Server)
GET /leads — fetch list of leads

POST /leads — create a new lead

PATCH /leads/:id — update a lead’s status

Pagination params:

_page

_limit

Search param:

q (full text search)

What Changes When This Gets Attached to the Real Nexoria Website
This class build uses a local JSON Server database. When attaching to a real Nexoria environment, the storage layer must be swapped to a hosted backend.

1) Replace Local Storage API (JSON Server) with a Real Backend
Current (class):

LEADS_API_BASE = http://localhost:3001

Production options:

Supabase (recommended for Nexoria)

Firebase / Firestore

Custom Node/Express API

A hosted REST DB (temporary) like MockAPI (not ideal for production)

Required capabilities for the production backend:

GET /leads (list)

POST /leads (create)

PATCH /leads/:id (update status)

Optional: authentication and role-based access

2) Add Authentication / Admin Gating (Required for Real Use)
For Nexoria, this should not be public access.
Add one of the following:

Admin login + protected routes

Server-side auth (JWT/session)

Supabase Auth and Row Level Security (RLS)

3) Update Environment Configuration
Move API URLs and keys to environment variables:

LEADS_API_BASE

any external API keys (if enrichment becomes PageSpeed/Clearbit/etc.)

In production, never hardcode secrets inside frontend JS.

4) Replace “Demo Enrichment” With Business Enrichment (Optional Upgrade)
For class, enrichment uses Datamuse keyword suggestions.

For Nexoria, replace it with meaningful enrichment such as:

PageSpeed Insights performance snapshot (SEO, performance)

Tech stack detection (Wappalyzer/BuiltWith)

Company metadata (Clearbit or similar)

5) Add Operational Fields for Nexoria Workflow (Recommended)
To align with Nexoria’s pipeline, add fields like:

lead source (form, referral, DM, cold email)

priority score

assigned rep

next follow-up date

notes timeline (activity log)

6) Hosting
Frontend can be hosted on:

Vercel / Netlify / GitHub Pages (static)
Backend can be hosted on:

Supabase / Firebase / Render / Railway / Fly.io

Notes
If you see 404 Not Found from the leads endpoint, confirm:

JSON Server is running

db.json exists in the folder you launched the server from

the endpoint http://localhost:3001/leads returns []