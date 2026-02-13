export const store = {
  leads: [],
  page: 1,
  limit: 6,
  total: 0,

  search: "",
  status: "all",

  // event-loop safety
  latestListRequestId: 0,
  latestEnrichRequestId: 0,
  enrichAbort: null,
};
