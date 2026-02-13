function badgeClass(status) {
  return `badge ${status || "new"}`;
}

export function renderLeadList(container, leads, onAction) {
  container.innerHTML = "";

  if (!leads.length) {
    container.innerHTML = `<div class="muted">No leads found.</div>`;
    return;
  }

  for (const lead of leads) {
    const el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `
      <div class="itemTop">
        <div>
          <div style="font-weight:700; font-size:1.05rem;">${escapeHtml(lead.companyName || "—")}</div>
          <div class="muted">${escapeHtml(lead.contactName || "—")} • ${escapeHtml(lead.email || "—")}</div>
          <div class="muted">${escapeHtml(lead.website || "")}</div>
        </div>
        <div class="${badgeClass(lead.status)}">${escapeHtml(lead.status || "new")}</div>
      </div>

      <div class="muted" style="margin-top:10px;">
        <strong>Industry:</strong> ${escapeHtml(lead.industry || "—")} <br/>
        <strong>Notes:</strong> ${escapeHtml(lead.notes || "—")}
      </div>

      <div class="actions">
        <button class="small" data-action="status:new">Mark New</button>
        <button class="small" data-action="status:qualified">Qualified</button>
        <button class="small" data-action="status:contacted">Contacted</button>
        <button class="small" data-action="status:closed">Closed</button>
      </div>
    `;

    el.querySelectorAll("button[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => onAction(lead, btn.dataset.action));
    });

    container.appendChild(el);
  }
}

export function renderPills(container, words) {
  container.innerHTML = "";
  if (!words.length) {
    container.innerHTML = `<span class="muted">Type a company name to see suggestions.</span>`;
    return;
  }
  for (const w of words) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = w;
    container.appendChild(pill);
  }
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
