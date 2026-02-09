// ============================================================
// 308A.3 — Exercises: Promises & Async/Await
// ============================================================
// These exercises build progressively toward the skills needed
// for ALAB 308A.3.1 and the SBA capstone.
//
// Instructions:
//   - Complete each TODO section.
//   - Run this file with Node.js:  node exercise.js
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Your First Promise
// ------------------------------------------------------------
// Goal: Create and consume a basic Promise.

console.log("--- Exercise 1 ---");

const myPromise = new Promise((resolve, reject) => {
  resolve("Hello from a Promise!");
});

myPromise.then((message) => {
  console.log(message);
});

// TODO 1: Run this code — what gets logged?

// TODO 2: Change resolve to reject — what happens?
//         (Don't forget to change it back after testing!)

// TODO 3: Add a .catch() to handle the rejection.


// ------------------------------------------------------------
// Exercise 2: Delayed Promise
// ------------------------------------------------------------
// Goal: Simulate async behavior with setTimeout.

console.log("\n--- Exercise 2 ---");

function delayedGreeting(name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hello, ${name}!`);
    }, 1000);
  });
}

delayedGreeting("Alice").then((msg) => console.log(msg));
console.log("This prints first!");

// TODO 1: Predict the output order, then run to verify.
// Predicted order: ???

// TODO 2: Create a delayedAdd(a, b) function that returns
//         a Promise resolving to a + b after 500ms.

function delayedAdd(a, b) {
  // TODO: Implement this
}

// TODO 3: Chain a .then() that doubles the result.
// delayedAdd(3, 4).then(/* ??? */).then(/* ??? */);


// ------------------------------------------------------------
// Exercise 3: Promise States
// ------------------------------------------------------------
// Goal: Understand pending, fulfilled, and rejected states.

console.log("\n--- Exercise 3 ---");

const p1 = new Promise((resolve) => setTimeout(resolve, 2000, "Done!"));

// TODO 1: Log p1 immediately — observe the "pending" state.

// TODO 2: Log it again after 3 seconds — observe "fulfilled."

// TODO 3: Create a promise that rejects and observe "rejected."


// ------------------------------------------------------------
// Exercise 4: Chaining .then()
// ------------------------------------------------------------
// Goal: Chain multiple transformations.

console.log("\n--- Exercise 4 ---");

Promise.resolve(5)
  .then((val) => val * 2)
  .then((val) => val + 3)
  .then((val) => val.toString())
  .then((val) => console.log(`Result: ${val}`));

// TODO 1: Predict the final output, then verify.
// Predicted: ???

// TODO 2: Add another .then() that prepends "$" to the string.

// TODO 3: What happens if one .then() doesn't return a value?
//         Try it and write your answer:
// ???


// ------------------------------------------------------------
// Exercise 5: Error Handling with .catch()
// ------------------------------------------------------------
// Goal: Handle promise rejections gracefully.

console.log("\n--- Exercise 5 ---");

function riskyOperation(value) {
  return new Promise((resolve, reject) => {
    if (value > 0.5) {
      resolve(`Success: ${value}`);
    } else {
      reject(`Failure: ${value}`);
    }
  });
}

// TODO 1: Call riskyOperation with Math.random(), add .then() and .catch()

// TODO 2: Add .finally(() => console.log("Operation complete"))

// TODO 3: Chain a second .then() after the first — does it run
//         after a rejection? Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 6: Promise.all()
// ------------------------------------------------------------
// Goal: Run multiple promises concurrently.
// DIRECTLY PREPARES for Assignment performance requirement.

console.log("\n--- Exercise 6 ---");

function fetchUser() {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Alice" }), 100)
  );
}

function fetchPosts() {
  return new Promise((resolve) =>
    setTimeout(() => resolve(["post1", "post2"]), 150)
  );
}

function fetchComments() {
  return new Promise((resolve) =>
    setTimeout(() => resolve(["comment1"]), 80)
  );
}

// TODO 1: Use Promise.all() to run all three simultaneously.
//         Destructure the results into [user, posts, comments].

async function fetchAllData() {
  // TODO: Implement using Promise.all
}

// TODO 2: Time it — all three should complete in ~150ms (not 330ms).
//         Use console.time() / console.timeEnd().

// TODO 3: Make one promise reject — what happens to Promise.all()?
//         Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 7: Promise.race() and Promise.any()
// ------------------------------------------------------------
// Goal: Understand the different composition tools.

console.log("\n--- Exercise 7 ---");

const slow = new Promise((resolve) => setTimeout(resolve, 500, "slow"));
const fast = new Promise((resolve) => setTimeout(resolve, 100, "fast"));
const fail = new Promise((_, reject) => setTimeout(reject, 50, "failed"));

// TODO 1: What does Promise.race([slow, fast]) resolve to?

// TODO 2: What does Promise.race([slow, fast, fail]) return?
//         (Hint: fail is fastest)

// TODO 3: What does Promise.any([slow, fast, fail]) resolve to?
//         (Hint: it ignores rejections)


// ------------------------------------------------------------
// Exercise 8: Basic async/await
// ------------------------------------------------------------
// Goal: Convert promise chains to async/await.

console.log("\n--- Exercise 8 ---");

// Promise chain version (provided):
// fetchUser()
//   .then((user) => {
//     console.log(user);
//     return fetchPosts();
//   })
//   .then((posts) => {
//     console.log(posts);
//   });

// TODO 1: Write the async/await version:
async function getData() {
  // TODO: Use await to get user, log it, then get posts, log it
}

// TODO 2: Add fetchComments() to the chain.

// TODO 3: Challenge — Use Promise.all with await to run them
//         concurrently instead of sequentially.


// ------------------------------------------------------------
// Exercise 9: Error Handling with try/catch
// ------------------------------------------------------------
// Goal: Handle errors in async functions.

console.log("\n--- Exercise 9 ---");

async function riskyFetch() {
  // TODO: Wrap riskyOperation(Math.random()) in try/catch/finally
  //   - try: await the result and log it
  //   - catch: log "Caught: " + the error
  //   - finally: log "Cleanup complete"
}

// TODO 1: Run riskyFetch() several times.

// TODO 2: What code runs regardless of success/failure?
//         Write your answer as a comment.

// TODO 3: Create an async function that makes 3 risky calls.
//         If any fail, log the error but continue with the rest.

async function threeRiskyCalls() {
  // TODO: Implement — each call should be individually wrapped
}


// ------------------------------------------------------------
// Exercise 10: Sequential vs. Concurrent
// ------------------------------------------------------------
// Goal: Know when to use each pattern.
// CRITICAL for the Assignment.

console.log("\n--- Exercise 10 ---");

// TODO 1: Implement the sequential version
//         (each await waits for the previous)
async function sequential() {
  console.time("sequential");
  // TODO: await fetchUser(), then fetchPosts(), then fetchComments()
  console.timeEnd("sequential"); // Should be ~330ms
}

// TODO 2: Implement the concurrent version
//         (all run at the same time with Promise.all)
async function concurrent() {
  console.time("concurrent");
  // TODO: use Promise.all to run all three at once
  console.timeEnd("concurrent"); // Should be ~150ms
}

// TODO 3: Answer these questions as comments:
// When MUST you use sequential?
// ???
// When SHOULD you use concurrent?
// ???


// ------------------------------------------------------------
// Exercise 11: Microtask Queue Challenge
// ------------------------------------------------------------
// Goal: Predict event loop behavior with promises.

console.log("\n--- Exercise 11 ---");

console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

// TODO: Predict the output, then verify.
// Predicted order: ???

// TODO: Explain why "3" comes before "2":
// ???


// ------------------------------------------------------------
// Exercise 12: Build a Data Assembler
// ------------------------------------------------------------
// Goal: Directly prepares for ALAB 308A.3.1.

console.log("\n--- Exercise 12 ---");

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

// TODO 1: Write an async function assembleUser(id) that fetches
//         all three and combines them into a single object.
//         Use Promise.all so it completes in ~100ms, not ~300ms.

async function assembleUser(id) {
  // TODO: Implement this
}

// TODO 2: Call assembleUser(1) and log the combined result.

// TODO 3: Add error handling for invalid IDs.


// ============================================================
// 🎯 Checkpoint: Ready for the Assignment?
// ============================================================
// Before starting ALAB 308A.3.1, make sure you can:
//   [ ] Create and consume Promises
//   [ ] Chain .then(), .catch(), and .finally()
//   [ ] Use Promise.all() for concurrent execution
//   [ ] Write async functions with await
//   [ ] Handle errors with try/catch in async functions
//   [ ] Know when to use sequential vs. concurrent patterns
//   [ ] Explain why Promise.all can be faster than individual awaits
