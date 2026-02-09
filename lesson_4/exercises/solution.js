// ============================================================
// 308A.4 — SOLUTIONS: AJAX & Data Fetching
// ============================================================
// Note: Some exercises require a browser for DOM manipulation.
// Those solutions are included as comments with the HTML context.
//
// For Axios exercises in Node.js:
//   npm install axios
//   const axios = require("axios");
// ============================================================

// Uncomment if running in Node.js:
// const axios = require("axios");


// ------------------------------------------------------------
// Exercise 1: Your First fetch()
// ------------------------------------------------------------

console.log("--- Exercise 1 ---");

async function fetchTodo() {
  // fetch() returns a Response object (NOT the data itself)
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  // response.json() parses the response body as JSON — this is also async!
  const data = await response.json();
  console.log(data);
  // { userId: 1, id: 1, title: 'delectus aut autem', completed: false }

  console.log("Status:", response.status); // 200 = OK
  console.log("OK:", response.ok);         // true when status is 200–299
}

fetchTodo();

// Changing to /todos/5 returns the todo with id: 5 —
// different title and possibly different completed status.


// ------------------------------------------------------------
// Exercise 2: Fetch Multiple Items
// ------------------------------------------------------------

console.log("\n--- Exercise 2 ---");

async function fetchTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await response.json();             // Parse the full array of 200 todos
  console.log(`Total todos: ${todos.length}`);     // 200

  // First 3 — slice(start, end) returns a new array without modifying the original
  console.log("First 3:", todos.slice(0, 3));

  // Only completed todos — filter() creates a new array with elements that pass the test
  const completed = todos.filter((t) => t.completed);
  console.log(`Completed: ${completed.length}`);

  // Only todos from user 1 — filter by the userId property
  const user1Todos = todos.filter((t) => t.userId === 1);
  console.log(`User 1 todos: ${user1Todos.length}`); // 20
}

fetchTodos();


// ------------------------------------------------------------
// Exercise 3: Fetch + DOM Manipulation (Browser Solution)
// ------------------------------------------------------------

// HTML needed:
// <ul id="userList"></ul>

async function loadUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  const list = document.getElementById("userList");

  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.email}) — ${user.address.city}, ${user.company.name}`;
    list.appendChild(li);
  });
}

// loadUsers(); // Run in browser


// ------------------------------------------------------------
// Exercise 4: Error Handling with fetch()
// ------------------------------------------------------------

console.log("\n--- Exercise 4 ---");

async function safeFetch(url) {
  try {
    const response = await fetch(url);
    // IMPORTANT: fetch() does NOT throw on HTTP errors (404, 500, etc.)
    // It only throws on NETWORK errors (no internet, DNS failure, etc.)
    // So we must manually check response.ok:
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      // This throw sends us to the catch block
    }
    return await response.json();        // Parse and return the JSON data
  } catch (error) {
    // Catches BOTH: network errors from fetch() AND our manual throw above
    console.error("Fetch failed:", error.message);
    return null;                         // Return null so calling code can check for failure
  }
}

// Valid URL — returns data
safeFetch("https://jsonplaceholder.typicode.com/todos/1").then((data) =>
  console.log("Valid:", data)
);

// Invalid endpoint — HTTP 404 error
safeFetch("https://jsonplaceholder.typicode.com/invalid").then((data) =>
  console.log("Invalid endpoint:", data) // null
);

// Nonexistent URL — TypeError: fetch failed (network error)
// This is a network-level error, not an HTTP error.
// The request never reaches a server.
safeFetch("https://nonexistent-url-12345.com").then((data) =>
  console.log("Nonexistent:", data) // null
);


// ------------------------------------------------------------
// Exercise 5: POST Request with fetch()
// ------------------------------------------------------------

console.log("\n--- Exercise 5 ---");

async function createTodo(title) {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",                      // Override the default GET method
    headers: {
      "Content-Type": "application/json; charset=UTF-8", // Tell the server we're sending JSON
    },
    body: JSON.stringify({               // Convert the JS object to a JSON string
      title: title,                      // The data to send to the server
      completed: false,
      userId: 1,
    }),
  });

  const data = await response.json();    // Parse the server's response
  console.log("Created:", data);         // Server echoes back our data with a new `id`
  console.log("Status:", response.status); // 201 = Created (success for POST)
}

createTodo("Learn fetch API");

// With completed: true, the response reflects the sent data
// (JSONPlaceholder echoes back what you send).


// ------------------------------------------------------------
// Exercise 6: Introduction to Axios
// ------------------------------------------------------------

console.log("\n--- Exercise 6 ---");

async function fetchWithAxios() {
  // axios.get() returns an object with `data`, `status`, `headers`, etc.
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  );
  console.log(response.data);   // Auto-parsed JSON! No .json() call needed
  console.log(response.status); // 200
}

// fetchWithAxios();

// Key differences from fetch:
// 1. Axios auto-parses JSON — use response.data instead of response.json()
// 2. Axios auto-rejects on HTTP errors (4xx/5xx) — no manual .ok check needed
// 3. Axios auto-sets Content-Type for POST requests

// POST with Axios:
async function createTodoAxios() {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/todos",
    { title: "Learn Axios", completed: false, userId: 1 }
    // ^ Just pass a plain object — Axios calls JSON.stringify for you!
  );
  console.log("Axios POST:", response.data); // Auto-parsed response
  console.log("Status:", response.status);   // 201
}

// createTodoAxios();


// ------------------------------------------------------------
// Exercise 7: Axios vs. Fetch Side-by-Side
// ------------------------------------------------------------

console.log("\n--- Exercise 7 ---");

// FETCH VERSION
async function fetchVersion() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hello", body: "World", userId: 1 }),
  });

  if (!response.ok) throw new Error(`Error: ${response.status}`);

  const data = await response.json();
  return data;
}

// AXIOS VERSION — much shorter!
async function axiosVersion() {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    { title: "Hello", body: "World", userId: 1 }
  );
  return response.data;
}

// Axios requires less code because:
// 1. No manual JSON.stringify
// 2. No manual Content-Type header (auto-detected)
// 3. No manual .ok check (auto-throws on errors)
// 4. No manual .json() call (auto-parsed)


// ------------------------------------------------------------
// Exercise 8: Axios Interceptors
// ------------------------------------------------------------

console.log("\n--- Exercise 8 ---");

let requestCount = 0;                     // Track how many requests have been made

// Request interceptor — runs BEFORE every Axios request is sent
axios.interceptors.request.use((config) => {
  requestCount++;                          // Increment the global counter
  // Attach custom metadata to the config object so the response interceptor can read it
  config.metadata = { startTime: new Date().getTime(), requestNumber: requestCount };
  console.log(`📤 [#${requestCount}] Request to ${config.url}`);
  return config;                           // MUST return config — otherwise the request is blocked
});

// Response interceptor — runs AFTER every Axios response is received
axios.interceptors.response.use(
  (response) => {                          // Success handler (2xx status codes)
    // Calculate how long the request took using the metadata we attached earlier
    const duration = new Date().getTime() - response.config.metadata.startTime;
    console.log(
      `📥 [#${response.config.metadata.requestNumber}] Response from ${response.config.url} took ${duration}ms`
    );
    return response;                       // MUST return response — otherwise the caller gets undefined
  },
  (error) => {                             // Error handler (4xx/5xx or network errors)
    if (error.config && error.config.metadata) {
      const duration = new Date().getTime() - error.config.metadata.startTime;
      console.log(
        `❌ [#${error.config.metadata.requestNumber}] Error from ${error.config.url} after ${duration}ms`
      );
    }
    return Promise.reject(error);          // Re-throw so the caller's catch block still runs
  }
);

async function testInterceptors() {
  await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  await axios.get("https://jsonplaceholder.typicode.com/users/1");
  console.log(`Total requests made: ${requestCount}`);
}

// testInterceptors();


// ------------------------------------------------------------
// Exercise 9: Building a Dynamic <select> (Browser Solution)
// ------------------------------------------------------------

// HTML needed:
// <select id="userSelect"><option value="">-- Select a User --</option></select>
// <div id="userInfo"></div>

async function loadUserSelect() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();               // Parse the array of user objects
  const select = document.getElementById("userSelect"); // Get the <select> element from the DOM

  users.forEach((user) => {
    const option = document.createElement("option");  // Create a new <option> element
    option.value = user.id;                            // Set the value attribute (sent on form submit)
    option.textContent = user.name;                    // Set the visible text in the dropdown
    select.appendChild(option);                        // Append the <option> to the <select>
  });
}

// Event listener with loading state
// document.getElementById("userSelect").addEventListener("change", async (e) => {
//   const userId = e.target.value;
//   const infoDiv = document.getElementById("userInfo");
//   if (!userId) { infoDiv.innerHTML = ""; return; }
//
//   infoDiv.innerHTML = "<p>Loading...</p>";
//
//   const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
//   const user = await response.json();
//
//   infoDiv.innerHTML = `
//     <h3>${user.name}</h3>
//     <p>Email: ${user.email}</p>
//     <p>Phone: ${user.phone}</p>
//     <p>City: ${user.address.city}</p>
//     <p>Company: ${user.company.name}</p>
//   `;
// });

// loadUserSelect();


// ------------------------------------------------------------
// Exercise 10: Concurrent API Calls with Promise.all
// ------------------------------------------------------------

console.log("\n--- Exercise 10 ---");

async function fetchUserWithPosts(userId) {
  console.time(`fetchUserWithPosts(${userId})`);

  // Promise.all fires all three fetches AT THE SAME TIME
  const [user, posts, todos] = await Promise.all([
    // Each fetch().then(r => r.json()) is a two-step pattern:
    // Step 1: fetch() returns a Response object
    // Step 2: .then(r => r.json()) parses the body as JSON
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((r) =>
      r.json()
    ),
    fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    ).then((r) => r.json()),
    fetch(
      `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
    ).then((r) => r.json()),
  ]);
  // ^ Destructuring: the resolved array is unpacked into user, posts, todos

  console.timeEnd(`fetchUserWithPosts(${userId})`);

  return { ...user, posts, todos };      // Spread user's properties and add posts + todos
}

fetchUserWithPosts(1).then((data) => {
  console.log(`${data.name} has ${data.posts.length} posts and ${data.todos.length} todos`);
});

// Sequential comparison (slower):
async function fetchUserWithPostsSequential(userId) {
  console.time("sequential");
  const userResp = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  const user = await userResp.json();    // Must finish before the next fetch starts
  const postsResp = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  const posts = await postsResp.json();  // Each await BLOCKS the next line
  const todosResp = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
  const todos = await todosResp.json();
  console.timeEnd("sequential");         // Much slower! (sum of all three request times)
  return { ...user, posts, todos };
}


// ------------------------------------------------------------
// Exercise 11: DELETE and Toggle Pattern
// ------------------------------------------------------------

console.log("\n--- Exercise 11 ---");

let favorites = new Set();               // A Set stores unique values — perfect for tracking favorites

// Fetch version
async function toggleFavorite(postId) {
  if (favorites.has(postId)) {            // Check if postId is already in the Set
    // DELETE — remove from server
    await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE",                   // HTTP DELETE method to remove the resource
    });
    favorites.delete(postId);             // Remove from local Set to keep UI in sync
    console.log(`❌ Removed post ${postId} from favorites`);
  } else {
    // POST — add to server
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),   // Send the postId to the server
    });
    favorites.add(postId);                // Add to local Set
    console.log(`⭐ Added post ${postId} to favorites`);
  }
  console.log("Current favorites:", [...favorites]); // Spread Set into array for logging
}

// Axios version
async function toggleFavoriteAxios(postId) {
  if (favorites.has(postId)) {
    await axios.delete(                   // Axios shorthand — no config object needed
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    favorites.delete(postId);
    console.log(`❌ Removed post ${postId} from favorites`);
  } else {
    await axios.post("https://jsonplaceholder.typicode.com/posts", { postId });
    // ^ Axios auto-sets Content-Type and auto-stringifies the object
    favorites.add(postId);
    console.log(`⭐ Added post ${postId} to favorites`);
  }
}

// Test toggle behavior
async function testToggle() {
  await toggleFavorite(1); // ⭐ Added post 1
  await toggleFavorite(2); // ⭐ Added post 2
  await toggleFavorite(1); // ❌ Removed post 1
  await toggleFavorite(3); // ⭐ Added post 3
}

// testToggle();

// For UI feedback (browser), update button text:
// button.textContent = favorites.has(postId) ? "♥ Unfavourite" : "♡ Favourite";
// button.classList.toggle("active", favorites.has(postId));
