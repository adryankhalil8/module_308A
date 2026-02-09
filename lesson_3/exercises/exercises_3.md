# 308A.3 — Bite-Size Exercises: Promises & Async/Await

> These exercises build progressively toward the skills needed for **ALAB 308A.3.1** and the **SBA capstone**.

---

## Exercise 1: Your First Promise

**Goal:** Create and consume a basic Promise.

```javascript
const myPromise = new Promise((resolve, reject) => {
  resolve("Hello from a Promise!");
});

myPromise.then((message) => {
  console.log(message);
});
```

**Tasks:**
1. Run this code — what gets logged?
2. Change `resolve` to `reject` — what happens?
3. Add a `.catch()` to handle the rejection.

---

## Exercise 2: Delayed Promise

**Goal:** Simulate async behavior with `setTimeout`.

```javascript
function delayedGreeting(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hello, ${name}!`);
    }, 1000);
  });
}

delayedGreeting("Alice").then((msg) => console.log(msg));
console.log("This prints first!");
```

**Tasks:**
1. Predict the output order, then run to verify.
2. Create a `delayedAdd(a, b)` function that returns a Promise resolving to `a + b` after 500ms.
3. Chain a `.then()` that doubles the result.

---

## Exercise 3: Promise States

**Goal:** Understand pending, fulfilled, and rejected states.

```javascript
const p1 = new Promise((resolve) => setTimeout(resolve, 2000, "Done!"));

console.log(p1);         // What state is this?
setTimeout(() => console.log(p1), 3000);  // What about now?
```

**Tasks:**
1. Log the promise immediately — observe the "pending" state.
2. Log it again after 3 seconds — observe "fulfilled."
3. Create a promise that rejects and observe the "rejected" state.

---

## Exercise 4: Chaining `.then()`

**Goal:** Chain multiple transformations.

```javascript
Promise.resolve(5)
  .then((val) => val * 2)
  .then((val) => val + 3)
  .then((val) => val.toString())
  .then((val) => console.log(`Result: ${val}`));
```

**Tasks:**
1. Predict the final output, then verify.
2. Add another `.then()` that prepends "$" to the string.
3. What happens if one `.then()` doesn't return a value? Try it!

---

## Exercise 5: Error Handling with `.catch()`

**Goal:** Handle promise rejections gracefully.

```javascript
function riskyOperation(value) {
  return new Promise((resolve, reject) => {
    if (value > 0.5) {
      resolve(`Success: ${value}`);
    } else {
      reject(`Failure: ${value}`);
    }
  });
}

riskyOperation(Math.random())
  .then((msg) => console.log(msg))
  .catch((err) => console.error(err));
```

**Tasks:**
1. Run this several times — notice the different outcomes.
2. Add `.finally(() => console.log("Operation complete"))`.
3. Chain a second `.then()` after the first — does it run after a rejection?

---

## Exercise 6: `Promise.all()`

**Goal:** Run multiple promises concurrently. **Directly prepares for Assignment performance requirement.**

```javascript
function fetchUser() {
  return new Promise((resolve) => setTimeout(() => resolve({ name: "Alice" }), 100));
}

function fetchPosts() {
  return new Promise((resolve) => setTimeout(() => resolve(["post1", "post2"]), 150));
}

function fetchComments() {
  return new Promise((resolve) => setTimeout(() => resolve(["comment1"]), 80));
}
```

**Tasks:**
1. Use `Promise.all()` to run all three simultaneously:
   ```javascript
   const [user, posts, comments] = await Promise.all([
     fetchUser(), fetchPosts(), fetchComments()
   ]);
   ```
2. Time it — all three should complete in ~150ms (not 330ms).
3. Make one promise reject — what happens to `Promise.all()`?

---

## Exercise 7: `Promise.race()` and `Promise.any()`

**Goal:** Understand the different composition tools.

```javascript
const slow = new Promise((resolve) => setTimeout(resolve, 500, "slow"));
const fast = new Promise((resolve) => setTimeout(resolve, 100, "fast"));
const fail = new Promise((_, reject) => setTimeout(reject, 50, "failed"));
```

**Tasks:**
1. `Promise.race([slow, fast])` — what resolves?
2. `Promise.race([slow, fast, fail])` — what happens? (Hint: `fail` is fastest)
3. `Promise.any([slow, fast, fail])` — what resolves? (Hint: ignores rejections)

---

## Exercise 8: Basic `async`/`await`

**Goal:** Convert promise chains to async/await.

Convert this promise chain:

```javascript
fetchUser()
  .then((user) => {
    console.log(user);
    return fetchPosts();
  })
  .then((posts) => {
    console.log(posts);
  });
```

To `async`/`await`:

```javascript
async function getData() {
  const user = await fetchUser();
  console.log(user);
  const posts = await fetchPosts();
  console.log(posts);
}
```

**Tasks:**
1. Write the async version and verify it works.
2. Add `fetchComments()` to the chain.
3. **Challenge:** Use `Promise.all` with `await` to run them concurrently.

---

## Exercise 9: Error Handling with `try`/`catch`

**Goal:** Handle errors in async functions.

```javascript
async function riskyFetch() {
  try {
    const result = await riskyOperation(Math.random());
    console.log(result);
  } catch (error) {
    console.error("Caught:", error);
  } finally {
    console.log("Cleanup complete");
  }
}
```

**Tasks:**
1. Run `riskyFetch()` several times.
2. What code runs regardless of success/failure?
3. Create an async function that makes 3 risky calls — if any fail, log the error but continue with the remaining calls.

---

## Exercise 10: Sequential vs. Concurrent

**Goal:** Understand when to use each pattern. **Critical for the Assignment.**

```javascript
// Sequential — each waits for the previous
async function sequential() {
  console.time("sequential");
  const a = await fetchUser();     // 100ms
  const b = await fetchPosts();    // 150ms
  const c = await fetchComments(); // 80ms
  console.timeEnd("sequential");   // ~330ms total
}

// Concurrent — all run at the same time
async function concurrent() {
  console.time("concurrent");
  const [a, b, c] = await Promise.all([
    fetchUser(), fetchPosts(), fetchComments()
  ]);
  console.timeEnd("concurrent");   // ~150ms total
}
```

**Tasks:**
1. Run both and compare the times.
2. When MUST you use sequential? (When result B depends on result A)
3. When SHOULD you use concurrent? (When results are independent)

---

## Exercise 11: Microtask Queue Challenge

**Goal:** Predict event loop behavior with promises.

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");
```

**Predict the output**, then verify. Explain why `"3"` comes before `"2"`.

---

## Exercise 12: Build a Data Assembler

**Goal:** Directly prepares for **ALAB 308A.3.1**.

Create functions simulating databases:

```javascript
function getBasicInfo(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, username: `user_${id}` }), 100);
  });
}

function getContactInfo(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ email: `user${id}@example.com`, phone: "555-0100" }), 100);
  });
}

function getPreferences(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ theme: "dark", language: "en" }), 100);
  });
}
```

**Tasks:**
1. Write an `async` function `assembleUser(id)` that fetches all three and combines them into a single object.
2. Use `Promise.all` so it completes in ~100ms, not ~300ms.
3. Add error handling for invalid IDs.

---

## 🎯 Checkpoint: Ready for the Assignment?

Before starting **ALAB 308A.3.1**, make sure you can:

- [ ] Create and consume Promises
- [ ] Chain `.then()`, `.catch()`, and `.finally()`
- [ ] Use `Promise.all()` for concurrent execution
- [ ] Write `async` functions with `await`
- [ ] Handle errors with `try`/`catch` in async functions
- [ ] Know when to use sequential vs. concurrent patterns
- [ ] Explain why `Promise.all` can be faster than awaiting each promise individually

---

*These exercises prepare you for ALAB 308A.3.1 and the SBA 308A capstone project.*
