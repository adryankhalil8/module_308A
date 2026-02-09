// ============================================================
// 308A.4 — Exercises: AJAX & Data Fetching
// ============================================================
// These exercises build progressively toward the skills needed
// for R-ALAB 308A.4.1 and the SBA capstone.
//
// Instructions:
//   - Complete each TODO section.
//   - Exercises 1-2, 4-8, 10 can run in Node 18+ (native fetch).
//   - Exercises 3, 9, 11 require a browser (DOM manipulation).
//   - For Axios exercises, include via CDN in HTML or:
//       npm install axios
//       const axios = require("axios"); (or import)
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Your First fetch()
// ------------------------------------------------------------
// Goal: Make a basic GET request and see the response.

console.log("--- Exercise 1 ---");

async function fetchTodo() {
  // TODO: Fetch from "https://jsonplaceholder.typicode.com/todos/1"
  //       Parse the JSON and log it.
  //       Also log response.status and response.ok.
}

// fetchTodo();

// TODO: Change the URL to /todos/5 — what changes?


// ------------------------------------------------------------
// Exercise 2: Fetch Multiple Items
// ------------------------------------------------------------
// Goal: Fetch an array of items and work with the data.

console.log("\n--- Exercise 2 ---");

async function fetchTodos() {
  // TODO: Fetch from "https://jsonplaceholder.typicode.com/todos"
  //       Log the total number of todos.
  //       Log the first 3 todos.
}

// fetchTodos();

// TODO: Filter to show only completed todos.

// TODO: Filter to show only todos from user 1.


// ------------------------------------------------------------
// Exercise 3: Fetch + DOM Manipulation (Browser Exercise)
// ------------------------------------------------------------
// Goal: Display fetched data on a webpage.
// NOTE: This exercise requires an HTML file with:
//   <ul id="userList"></ul>
//   <script type="module" src="exercise.js"></script>

async function loadUsers() {
  // TODO: Fetch from "https://jsonplaceholder.typicode.com/users"
  //       For each user, create an <li> element with:
  //         user.name (user.email)
  //       Append each <li> to the #userList element.
}

// TODO: Add each user's city and company name.

// TODO: Style the list items with CSS.


// ------------------------------------------------------------
// Exercise 4: Error Handling with fetch()
// ------------------------------------------------------------
// Goal: Handle failed requests gracefully.

console.log("\n--- Exercise 4 ---");

async function safeFetch(url) {
  // TODO: Implement error handling:
  //   - Use try/catch
  //   - Check response.ok — if false, throw an Error with the status
  //   - On success, return the parsed JSON
  //   - On error, log the error message and return null
}

// TODO 1: Test with a valid URL:
// safeFetch("https://jsonplaceholder.typicode.com/todos/1")

// TODO 2: Test with an invalid endpoint:
// safeFetch("https://jsonplaceholder.typicode.com/invalid")

// TODO 3: Test with a totally nonexistent URL:
// safeFetch("https://nonexistent-url-12345.com")
// What kind of error is this? Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 5: POST Request with fetch()
// ------------------------------------------------------------
// Goal: Send data to a server.

console.log("\n--- Exercise 5 ---");

async function createTodo(title) {
  // TODO: Make a POST request to
  //       "https://jsonplaceholder.typicode.com/todos"
  //       with the following options:
  //         method: "POST"
  //         headers: { "Content-Type": "application/json; charset=UTF-8" }
  //         body: JSON.stringify({ title, completed: false, userId: 1 })
  //       Log the response data and the status code (should be 201).
}

// createTodo("Learn fetch API");

// TODO: Create a todo with your own title.

// TODO: Add completed: true — does the response change?


// ------------------------------------------------------------
// Exercise 6: Introduction to Axios
// ------------------------------------------------------------
// Goal: Make the same requests with Axios and compare.
//
// In browser: <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
// In Node.js: const axios = require("axios");

// Uncomment the line below if using Node.js:
// const axios = require("axios");

console.log("\n--- Exercise 6 ---");

async function fetchWithAxios() {
  // TODO: Use axios.get() to fetch
  //       "https://jsonplaceholder.typicode.com/todos/1"
  //       Log response.data (note: .data, not .json()!)
  //       Log response.status
}

// fetchWithAxios();

// TODO: Compare with the fetch version — what's different?
//       Write your answer as a comment.

// TODO: Try axios.get with an invalid URL — does it reject automatically?

// TODO: Make a POST request with axios.post().


// ------------------------------------------------------------
// Exercise 7: Axios vs. Fetch Side-by-Side
// ------------------------------------------------------------
// Goal: Understand the practical differences.

console.log("\n--- Exercise 7 ---");

// FETCH VERSION (provided for reference):
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

// TODO: Convert the fetch version above to Axios:
async function axiosVersion() {
  // TODO: Use axios.post() with the same data.
  //       Note: no need for JSON.stringify, no need to check .ok,
  //       no need to call .json().
}

// TODO: Which version requires less code? Why?
//       Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 8: Axios Interceptors
// ------------------------------------------------------------
// Goal: Log request timing. Prepares for Assignment Task 4.

console.log("\n--- Exercise 8 ---");

// TODO: Set up a request interceptor that:
//   - Stores the start time in config.metadata
//   - Logs "📤 Request to [url]"

// TODO: Set up a response interceptor that:
//   - Calculates duration from config.metadata.startTime
//   - Logs "📥 Response from [url] took Xms"

async function testInterceptors() {
  // TODO: Make 2 GET requests and observe the timing logs
}

// testInterceptors();

// TODO: Add a request counter that increments with each request.

// TODO: Add error timing to the response interceptor's error handler.


// ------------------------------------------------------------
// Exercise 9: Building a Dynamic <select> from API Data
//             (Browser Exercise)
// ------------------------------------------------------------
// Goal: Prepares for Assignment Task 1 (breed select).
//
// NOTE: Requires HTML with:
//   <select id="userSelect"><option value="">-- Select a User --</option></select>
//   <div id="userInfo"></div>

async function loadUserSelect() {
  // TODO: Fetch users from "https://jsonplaceholder.typicode.com/users"
  //       For each user, create an <option> element with:
  //         value = user.id
  //         textContent = user.name
  //       Append to the #userSelect element.
}

// TODO: Add an event listener on #userSelect for "change":
//   - Get the selected userId
//   - Fetch that user's data from /users/{id}
//   - Display name, email, and city in #userInfo

// TODO: Add a loading state while fetching.


// ------------------------------------------------------------
// Exercise 10: Concurrent API Calls with Promise.all
// ------------------------------------------------------------
// Goal: Fetch from multiple endpoints efficiently.
// CRITICAL for the SBA.

console.log("\n--- Exercise 10 ---");

async function fetchUserWithPosts(userId) {
  // TODO: Use Promise.all to fetch BOTH of these concurrently:
  //   - https://jsonplaceholder.typicode.com/users/{userId}
  //   - https://jsonplaceholder.typicode.com/posts?userId={userId}
  // Combine them into a single object: { ...user, posts }
}

// fetchUserWithPosts(1).then(data => {
//   console.log(`${data.name} has ${data.posts.length} posts`);
// });

// TODO: Add the user's todos to the combined object.

// TODO: Time it with console.time() — compare to sequential requests.


// ------------------------------------------------------------
// Exercise 11: DELETE and Toggle Pattern (Browser Exercise)
// ------------------------------------------------------------
// Goal: Prepares for Assignment Task 7 (favourites toggle).

console.log("\n--- Exercise 11 ---");

let favorites = new Set();

async function toggleFavorite(postId) {
  // TODO: If postId is already in favorites:
  //   - Make a DELETE request to /posts/{postId}
  //   - Remove from the Set
  //   - Log "Removed post X from favorites"
  // Otherwise:
  //   - Make a POST request to /posts with { postId }
  //   - Add to the Set
  //   - Log "Added post X to favorites"
}

// TODO 1: Call toggleFavorite(1) twice — see the toggle behavior.

// TODO 2: Convert to Axios.

// TODO 3: Add UI feedback (change a button's text/color).


// ============================================================
// 🎯 Checkpoint: Ready for the Assignment?
// ============================================================
// Before starting R-ALAB 308A.4.1, make sure you can:
//   [ ] Make GET requests with both fetch and Axios
//   [ ] Make POST and DELETE requests
//   [ ] Handle errors in both fetch and Axios
//   [ ] Build DOM elements dynamically from API data
//   [ ] Create <select> dropdowns populated from an API
//   [ ] Set up Axios interceptors
//   [ ] Use Promise.all for concurrent requests
//   [ ] Implement toggle behavior (POST/DELETE)
