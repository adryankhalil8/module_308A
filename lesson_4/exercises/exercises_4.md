# 308A.4 — Bite-Size Exercises: AJAX & Data Fetching

> These exercises build progressively toward the skills needed for **R-ALAB 308A.4.1** and the **SBA capstone**.

---

## Exercise 1: Your First `fetch()`

**Goal:** Make a basic GET request and see the response.

```javascript
async function fetchTodo() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await response.json();
  console.log(data);
}

fetchTodo();
```

**Tasks:**
1. Run this and observe the output.
2. Change the URL to `/todos/5` — what changes?
3. Log `response.status` and `response.ok` — what are their values?

---

## Exercise 2: Fetch Multiple Items

**Goal:** Fetch an array of items and work with the data.

```javascript
async function fetchTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await response.json();
  console.log(`Total todos: ${todos.length}`);
  console.log("First 3:", todos.slice(0, 3));
}

fetchTodos();
```

**Tasks:**
1. How many todos are returned?
2. Filter to show only **completed** todos.
3. Filter to show only todos from **user 1**.

---

## Exercise 3: Fetch + DOM Manipulation

**Goal:** Display fetched data on a webpage. **Directly prepares for the Assignment.**

```html
<ul id="userList"></ul>

<script>
async function loadUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  const list = document.getElementById("userList");

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.email})`;
    list.appendChild(li);
  });
}

loadUsers();
</script>
```

**Tasks:**
1. Run this and see the user list appear.
2. Add each user's city and company name.
3. Style the list items with CSS.

---

## Exercise 4: Error Handling with `fetch()`

**Goal:** Handle failed requests gracefully.

```javascript
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error.message);
    return null;
  }
}
```

**Tasks:**
1. Call `safeFetch` with a valid URL — see the success case.
2. Call `safeFetch` with `"https://jsonplaceholder.typicode.com/invalid"` — see the error handling.
3. Call `safeFetch` with `"https://nonexistent-url-12345.com"` — what kind of error is this?

---

## Exercise 5: POST Request with `fetch()`

**Goal:** Send data to a server.

```javascript
async function createTodo(title) {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      title: title,
      completed: false,
      userId: 1,
    }),
  });

  const data = await response.json();
  console.log("Created:", data);
  console.log("Status:", response.status);  // Should be 201
}

createTodo("Learn fetch API");
```

**Tasks:**
1. Run this and observe the `201` status code.
2. Create a todo with your own title.
3. Add a `completed: true` property — does the response change?

---

## Exercise 6: Introduction to Axios

**Goal:** Make the same requests with Axios and compare.

Include Axios via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

```javascript
async function fetchWithAxios() {
  const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  console.log(response.data);  // Note: .data, not .json()!
  console.log(response.status);
}

fetchWithAxios();
```

**Tasks:**
1. Compare with the `fetch` version — what's different?
2. Try `axios.get` with an invalid URL — does it reject automatically?
3. Make a POST request with `axios.post()`.

---

## Exercise 7: Axios vs. Fetch Side-by-Side

**Goal:** Understand the practical differences.

Convert this fetch code to Axios:

```javascript
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
```

```javascript
// AXIOS VERSION — fill in the blanks!
async function axiosVersion() {
  const response = await axios.post(/* ??? */);
  return response.data;
}
```

**Question:** Which version requires less code? Why?

---

## Exercise 8: Axios Interceptors

**Goal:** Log request timing. **Directly prepares for Assignment Task 4.**

```javascript
// Request interceptor
axios.interceptors.request.use((config) => {
  config.metadata = { startTime: new Date().getTime() };
  console.log(`📤 Request to ${config.url}`);
  return config;
});

// Response interceptor
axios.interceptors.response.use((response) => {
  const duration = new Date().getTime() - response.config.metadata.startTime;
  console.log(`📥 Response from ${response.config.url} took ${duration}ms`);
  return response;
});

// Test it!
async function testInterceptors() {
  await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  await axios.get("https://jsonplaceholder.typicode.com/users/1");
}

testInterceptors();
```

**Tasks:**
1. Run this and observe the timing logs.
2. Add a request counter that increments with each request.
3. Add error timing to the response interceptor's error handler.

---

## Exercise 9: Building a Dynamic `<select>` from API Data

**Goal:** Directly prepares for **Assignment Task 1** (breed select).

```html
<select id="userSelect">
  <option value="">-- Select a User --</option>
</select>
<div id="userInfo"></div>

<script>
async function loadUserSelect() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  const select = document.getElementById("userSelect");

  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    select.appendChild(option);
  });
}

document.getElementById("userSelect").addEventListener("change", async (e) => {
  const userId = e.target.value;
  if (!userId) return;

  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  const user = await response.json();
  document.getElementById("userInfo").innerHTML = `
    <h3>${user.name}</h3>
    <p>Email: ${user.email}</p>
    <p>City: ${user.address.city}</p>
  `;
});

loadUserSelect();
</script>
```

**Tasks:**
1. Run this and test the select dropdown.
2. Add the user's phone and company name to the info display.
3. Add a loading state while fetching.

---

## Exercise 10: Concurrent API Calls with `Promise.all`

**Goal:** Fetch data from multiple endpoints efficiently. **Critical for the SBA.**

```javascript
async function fetchUserWithPosts(userId) {
  const [user, posts] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then(r => r.json()),
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then(r => r.json()),
  ]);

  return {
    ...user,
    posts: posts,
  };
}

fetchUserWithPosts(1).then(data => {
  console.log(`${data.name} has ${data.posts.length} posts`);
});
```

**Tasks:**
1. Run this and verify the combined data.
2. Add the user's todos to the combined object.
3. Time it with `console.time()` — compare to sequential requests.

---

## Exercise 11: DELETE and Toggle Pattern

**Goal:** Prepares for **Assignment Task 7** (favourites toggle).

```javascript
let favorites = new Set();

async function toggleFavorite(postId) {
  if (favorites.has(postId)) {
    // DELETE
    await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE",
    });
    favorites.delete(postId);
    console.log(`Removed post ${postId} from favorites`);
  } else {
    // POST (simulating a favorite)
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    favorites.add(postId);
    console.log(`Added post ${postId} to favorites`);
  }
}
```

**Tasks:**
1. Call `toggleFavorite(1)` twice — see the toggle behavior.
2. Convert to Axios.
3. Add UI feedback (change a button's text/color).

---

## 🎯 Checkpoint: Ready for the Assignment?

Before starting **R-ALAB 308A.4.1**, make sure you can:

- [ ] Make GET requests with both `fetch` and Axios
- [ ] Make POST and DELETE requests
- [ ] Handle errors in both `fetch` and Axios
- [ ] Build DOM elements dynamically from API data
- [ ] Create `<select>` dropdowns populated from an API
- [ ] Set up Axios interceptors
- [ ] Use `Promise.all` for concurrent requests
- [ ] Implement toggle behavior (POST/DELETE)

---

*These exercises prepare you for R-ALAB 308A.4.1 and the SBA 308A capstone project.*
