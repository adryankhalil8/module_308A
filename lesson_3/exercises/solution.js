// ============================================================
// 308A.3 — SOLUTIONS: Promises & Async/Await
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Your First Promise
// ------------------------------------------------------------

console.log("--- Exercise 1 ---");

// Resolve version
const myPromise = new Promise((resolve, reject) => {
  // The function passed to `new Promise()` is called the "executor"
  // It receives two functions: resolve (success) and reject (failure)
  resolve("Hello from a Promise!"); // Calling resolve() transitions the promise to "fulfilled"
});

myPromise.then((message) => {         // .then() registers a callback for when the promise fulfills
  console.log(message);                // `message` is whatever was passed to resolve()
});

// Reject version with .catch()
const rejectedPromise = new Promise((resolve, reject) => {
  reject("Something went wrong!");     // Calling reject() transitions the promise to "rejected"
});

rejectedPromise
  .then((message) => console.log(message))   // SKIPPED because the promise was rejected
  .catch((error) => console.error("Caught:", error)); // .catch() handles the rejection
// Output: "Caught: Something went wrong!"


// ------------------------------------------------------------
// Exercise 2: Delayed Promise
// ------------------------------------------------------------

console.log("\n--- Exercise 2 ---");

function delayedGreeting(name) {
  return new Promise((resolve) => {     // Return a new promise that will resolve later
    setTimeout(() => {                   // setTimeout schedules the callback after 1000ms
      resolve(`Hello, ${name}!`);        // After 1s, resolve the promise with the greeting
    }, 1000);
  });
}

delayedGreeting("Alice").then((msg) => console.log(msg)); // Runs 1s later: "Hello, Alice!"
console.log("This prints first!");  // Runs immediately (synchronous)
// Output order: "This prints first!", then "Hello, Alice!" (after 1s)

// delayedAdd function
function delayedAdd(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);                    // Resolve with the sum after 500ms
    }, 500);
  });
}

// Chain a .then() that doubles the result
delayedAdd(3, 4)
  .then((sum) => {                       // First .then() receives the resolved value (7)
    console.log(`Sum: ${sum}`);          // 7
    return sum * 2;                      // Return a value → wraps it in a resolved promise
  })
  .then((doubled) => {                   // Second .then() receives the returned value (14)
    console.log(`Doubled: ${doubled}`);  // 14
  });


// ------------------------------------------------------------
// Exercise 3: Promise States
// ------------------------------------------------------------

console.log("\n--- Exercise 3 ---");

// A promise starts as "pending", then becomes either "fulfilled" or "rejected"
const p1 = new Promise((resolve) => setTimeout(resolve, 2000, "Done!"));
// setTimeout(resolve, 2000, "Done!") calls resolve("Done!") after 2 seconds

// 1. Log immediately — shows "pending"
console.log("Immediately:", p1); // Promise { <pending> }

// 2. Log after 3 seconds — shows "fulfilled"
setTimeout(() => console.log("After 3s:", p1), 3000); // Promise { 'Done!' }

// 3. Rejected promise
const p2 = new Promise((_, reject) => setTimeout(reject, 1000, "Oops"));
// ^ The underscore _ is a convention meaning "I don't need this parameter" (resolve)
p2.catch(() => {}); // Attach an empty .catch() to prevent "UnhandledPromiseRejection" warning
                     // Without this, Node.js would crash or warn about the unhandled rejection
setTimeout(() => console.log("Rejected:", p2), 2000); // Promise { <rejected> 'Oops' }


// ------------------------------------------------------------
// Exercise 4: Chaining .then()
// ------------------------------------------------------------

console.log("\n--- Exercise 4 ---");

Promise.resolve(5)
  .then((val) => val * 2)     // 10
  .then((val) => val + 3)     // 13
  .then((val) => val.toString()) // "13"
  .then((val) => "$" + val)   // "$13"
  .then((val) => console.log(`Result: ${val}`)); // "Result: $13"

// If a .then() doesn't return a value, the next .then() receives
// undefined. The chain continues, but with undefined as the value.


// ------------------------------------------------------------
// Exercise 5: Error Handling with .catch()
// ------------------------------------------------------------

console.log("\n--- Exercise 5 ---");

function riskyOperation(value) {
  return new Promise((resolve, reject) => {
    if (value > 0.5) {
      resolve(`Success: ${value}`);      // Math.random() > 0.5 → fulfill the promise
    } else {
      reject(`Failure: ${value}`);       // Math.random() <= 0.5 → reject the promise
    }
  });
}

riskyOperation(Math.random())
  .then((msg) => {                       // Runs only if the promise resolved
    console.log(msg);
    return "Next step";                  // Pass a value to the next .then()
  })
  .then((msg) => console.log("Second then:", msg)) // Receives "Next step"
  .catch((err) => console.error(err))    // Catches rejection — skips BOTH .then()s above
  .finally(() => console.log("Operation complete")); // Runs no matter what

// If the promise rejects, the .catch() runs and the second .then()
// is SKIPPED. The .finally() always runs regardless.


// ------------------------------------------------------------
// Exercise 6: Promise.all()
// ------------------------------------------------------------

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

async function fetchAllData() {
  console.time("Promise.all");
  // Promise.all() takes an array of promises and returns a SINGLE promise
  // that resolves when ALL of them have fulfilled
  const [user, posts, comments] = await Promise.all([
    fetchUser(),     // 100ms
    fetchPosts(),    // 150ms  — all three start at the SAME time
    fetchComments(), // 80ms
  ]);
  // ^ Array destructuring: the resolved array [userResult, postsResult, commentsResult]
  //   is unpacked into three separate variables
  console.timeEnd("Promise.all"); // ~150ms (max of all three, NOT 100+150+80=330ms)

  console.log("User:", user);
  console.log("Posts:", posts);
  console.log("Comments:", comments);
}

fetchAllData();

// If one promise rejects, the ENTIRE Promise.all rejects immediately.
// The other promises continue running, but their results are discarded.
// Use Promise.allSettled() if you want all results regardless of failures.


// ------------------------------------------------------------
// Exercise 7: Promise.race() and Promise.any()
// ------------------------------------------------------------

console.log("\n--- Exercise 7 ---");

const slow = new Promise((resolve) => setTimeout(resolve, 500, "slow")); // Resolves in 500ms
const fast = new Promise((resolve) => setTimeout(resolve, 100, "fast")); // Resolves in 100ms
const fail = new Promise((_, reject) => setTimeout(reject, 50, "failed")); // Rejects in 50ms

// 1. Promise.race() — returns the FIRST promise to SETTLE (resolve OR reject)
Promise.race([slow, fast]).then((val) => console.log("race(slow,fast):", val));
// "fast" wins because it settles first (100ms < 500ms)

// 2. Promise.race() with a rejection that settles first
Promise.race([slow, fast, fail]).catch((err) => console.log("race(all):", err));
// "failed" settles first at 50ms — race() returns that rejection

// 3. Promise.any() — returns the FIRST promise to FULFILL (ignores rejections)
Promise.any([slow, fast, fail]).then((val) => console.log("any(all):", val));
// "fast" wins (100ms) — the rejection at 50ms is IGNORED by any()


// ------------------------------------------------------------
// Exercise 8: Basic async/await
// ------------------------------------------------------------

console.log("\n--- Exercise 8 ---");

// Sequential version
async function getData() {             // `async` makes this function return a promise
  const user = await fetchUser();      // `await` pauses execution until fetchUser() resolves
  console.log("User:", user);          // Only runs AFTER fetchUser() has completed

  const posts = await fetchPosts();    // Waits for fetchPosts() (doesn't start until user is done)
  console.log("Posts:", posts);

  const comments = await fetchComments(); // Waits for fetchComments()
  console.log("Comments:", comments);
  // Total time: 100 + 150 + 80 = 330ms (sequential — each waits for the previous)
}

// Concurrent version with Promise.all
async function getDataConcurrent() {
  // All three promises start at the SAME TIME
  const [user, posts, comments] = await Promise.all([
    fetchUser(),                       // These three run concurrently
    fetchPosts(),
    fetchComments(),
  ]);
  // Total time: ~150ms (the slowest one)
  console.log("User:", user);
  console.log("Posts:", posts);
  console.log("Comments:", comments);
}


// ------------------------------------------------------------
// Exercise 9: Error Handling with try/catch
// ------------------------------------------------------------

console.log("\n--- Exercise 9 ---");

async function riskyFetch() {
  try {
    // `await` unwraps the promise — if it rejects, the error is thrown
    const result = await riskyOperation(Math.random());
    console.log(result);                 // Only runs if the promise resolved
  } catch (error) {
    // If riskyOperation() rejects, execution jumps HERE
    console.error("Caught:", error);     // `error` is whatever was passed to reject()
  } finally {
    // `finally` ALWAYS runs — whether try succeeded or catch ran
    // Use it for cleanup: closing connections, hiding spinners, etc.
    console.log("Cleanup complete");
  }
}

riskyFetch();

// The finally block runs regardless of success or failure.

// Three risky calls — each individually wrapped
async function threeRiskyCalls() {
  for (let i = 0; i < 3; i++) {
    try {
      const result = await riskyOperation(Math.random());
      console.log(`Call ${i + 1}: ${result}`);
    } catch (error) {
      console.error(`Call ${i + 1} failed: ${error}`);
      // Continue to next call — don't re-throw
    }
  }
  console.log("All three calls attempted.");
}

threeRiskyCalls();


// ------------------------------------------------------------
// Exercise 10: Sequential vs. Concurrent
// ------------------------------------------------------------

console.log("\n--- Exercise 10 ---");

// Sequential — each waits for the previous
async function sequential() {
  console.time("sequential");
  const user = await fetchUser();         // 100ms
  const posts = await fetchPosts();       // +150ms
  const comments = await fetchComments(); // +80ms
  console.timeEnd("sequential");          // ~330ms total
  return { user, posts, comments };
}

// Concurrent — all run at the same time
async function concurrent() {
  console.time("concurrent");
  const [user, posts, comments] = await Promise.all([
    fetchUser(),      // 100ms
    fetchPosts(),     // 150ms  (running simultaneously)
    fetchComments(),  // 80ms   (running simultaneously)
  ]);
  console.timeEnd("concurrent"); // ~150ms total (max of all three)
  return { user, posts, comments };
}

// sequential();
// concurrent();

// When MUST you use sequential?
// When result B depends on result A. For example, if you need the
// userId from fetchUser() to call fetchPosts(userId).

// When SHOULD you use concurrent?
// When the results are independent of each other. All three fetches
// in this example are independent, so they can run in parallel.


// ------------------------------------------------------------
// Exercise 11: Microtask Queue Challenge
// ------------------------------------------------------------

console.log("\n--- Exercise 11 ---");

console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

// Output: "1", "4", "3", "2"
//
// Explanation:
// - "1" and "4" are synchronous — they run first.
// - Promise.then() callbacks go to the MICROTASK queue.
// - setTimeout callbacks go to the MACROTASK (task) queue.
// - The microtask queue is processed BEFORE the macrotask queue.
// - So "3" (microtask) prints before "2" (macrotask).


// ------------------------------------------------------------
// Exercise 12: Build a Data Assembler
// ------------------------------------------------------------

console.log("\n--- Exercise 12 ---");

function getBasicInfo(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) return reject(new Error(`Invalid ID: ${id}`));
    setTimeout(() => resolve({ id, username: `user_${id}` }), 100);
  });
}

function getContactInfo(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) return reject(new Error(`Invalid ID: ${id}`));
    setTimeout(() => resolve({ email: `user${id}@example.com`, phone: "555-0100" }), 100);
  });
}

function getPreferences(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) return reject(new Error(`Invalid ID: ${id}`));
    setTimeout(() => resolve({ theme: "dark", language: "en" }), 100);
  });
}

async function assembleUser(id) {
  try {
    console.time(`assembleUser(${id})`);

    // Fire all three requests concurrently — they don't depend on each other
    const [basic, contact, prefs] = await Promise.all([
      getBasicInfo(id),                  // Returns { id, username }
      getContactInfo(id),                // Returns { email, phone }
      getPreferences(id),                // Returns { theme, language }
    ]);
    // If ANY of these rejects, Promise.all rejects immediately
    // and execution jumps to the catch block

    console.timeEnd(`assembleUser(${id})`); // ~100ms (not 300ms)

    // Spread operator (...) merges all three objects into one
    // { id, username, email, phone, theme, language }
    return { ...basic, ...contact, ...prefs };
  } catch (error) {
    console.error(`Failed to assemble user ${id}:`, error.message);
    return null;                         // Return null so the caller can handle the failure
  }
}

// Test with valid ID
assembleUser(1).then((user) => console.log("Assembled user:", user));
// { id: 1, username: 'user_1', email: 'user1@example.com', phone: '555-0100', theme: 'dark', language: 'en' }

// Test with invalid ID
assembleUser(-1).then((user) => console.log("Invalid result:", user));
// "Failed to assemble user -1: Invalid ID: -1"
// null
