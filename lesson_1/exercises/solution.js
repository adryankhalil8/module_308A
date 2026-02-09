// ============================================================
// 308A.1 — SOLUTIONS: Call Stack & Event Loop
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Trace the Call Stack
// ------------------------------------------------------------

function a() {
  // Stack at [1]: [a]
  b();
  // Stack at [4]: [a]  (b and c have returned)
}

function b() {
  // Stack at [2]: [a, b]
  c();
  // Stack at [3]: [a, b]  (c has returned)
}

function c() {
  // Stack at deepest point: [a, b, c]
  console.log("Hello from c!");
}

a();
// Stack at [5]: []  (empty — a has returned)


// ------------------------------------------------------------
// Exercise 2: Predict the Output
// ------------------------------------------------------------

console.log("\n--- Exercise 2 ---");

function first() { console.log("1"); }
function second() { console.log("2"); }
function third() { console.log("3"); }

second();
first();
third();

// Output: "2", "1", "3"
// Explanation: Functions execute in the order they are called,
// not the order they are defined.


// ------------------------------------------------------------
// Exercise 3: Introduction to setTimeout
// ------------------------------------------------------------

console.log("\n--- Exercise 3 ---");

console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 2000);

console.log("End");

// Output order: "Start", "End", "Timeout callback"
// "End" prints before "Timeout callback" because setTimeout
// sends the callback to the Web API/timer. The synchronous code
// finishes first, then the callback runs after ~2000ms.

// If you change 2000 to 0, the output is STILL:
// "Start", "End", "Timeout callback"
// because even 0ms setTimeout goes through the callback queue
// and must wait for the call stack to clear.


// ------------------------------------------------------------
// Exercise 4: Zero-Delay setTimeout
// ------------------------------------------------------------

console.log("\n--- Exercise 4 ---");

console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");

// Output: "1", "3", "2"
// Explanation: setTimeout(..., 0) does not execute immediately.
// It places the callback in the task queue, which only runs
// after the current call stack is empty. Since console.log("3")
// is synchronous, it runs before the queued callback.


// ------------------------------------------------------------
// Exercise 5: Multiple Timeouts
// ------------------------------------------------------------

console.log("\n--- Exercise 5 ---");

setTimeout(() => console.log("A"), 300);
setTimeout(() => console.log("B"), 100);
setTimeout(() => console.log("C"), 200);
console.log("D");

// Output: "D", "B", "C", "A"
// "D" is synchronous so it runs first.
// Then the callbacks fire in order of their delay: B(100), C(200), A(300).


// ------------------------------------------------------------
// Exercise 6: Blocking the Stack
// ------------------------------------------------------------

console.log("\n--- Exercise 6 ---");

console.log("Before loop");
const start = Date.now();          // Record the current timestamp in milliseconds
while (Date.now() - start < 3000) { // Keep looping until 3000ms have elapsed
  // This is a "busy wait" — the while loop hogs the call stack
  // the entire time, preventing ANY other code from running.
}
console.log("After loop");          // Only prints once the loop finishes

// Answers:
// 1. No, you cannot click anything during those 3 seconds because
//    the call stack is occupied — the event loop cannot process
//    any other events (clicks, timers, etc.).
// 2. JavaScript is single-threaded. While the while loop runs,
//    nothing else can execute — the call stack is blocked.
// 3. alert() similarly blocks the call stack. No other JS can run
//    and the browser UI freezes until the alert is dismissed.


// ------------------------------------------------------------
// Exercise 7: Callbacks and the Queue
// ------------------------------------------------------------

console.log("\n--- Exercise 7 ---");

function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

console.log("Start");

greet("Alice", () => {
  console.log("Callback executed");
});

console.log("End");

// Output: "Start", "Hello, Alice!", "Callback executed", "End"
// The callback is SYNCHRONOUS because it's called directly inside
// greet() — not via setTimeout or any async API.

// Async version:
function greetAsync(name, callback) {
  console.log(`Hello, ${name}!`);  // Runs immediately (synchronous)
  setTimeout(callback, 0);          // Sends callback to the Web API timer,
                                     // which places it in the task queue.
                                     // It will only execute AFTER the current
                                     // call stack is completely empty.
}

greetAsync("Bob", () => {            // Call greetAsync — "Hello, Bob!" prints now
  console.log("Async callback executed"); // This is the deferred callback
});
console.log("After greetAsync call"); // This runs BEFORE the callback because
                                       // the call stack isn't empty yet

// Output: "Hello, Bob!", "After greetAsync call", "Async callback executed"


// ------------------------------------------------------------
// Exercise 8: Recursive Call Stack Depth
// ------------------------------------------------------------

console.log("\n--- Exercise 8 ---");

let count = 0;                  // Counter lives outside the function (in global scope)

function countUp() {
  count++;                      // Increment the counter each time we recurse
  countUp();                    // Recursive call with NO base case — this will
                                // keep adding frames to the call stack until
                                // the engine runs out of memory.
}

try {
  countUp();                    // Start the infinite recursion
} catch (e) {                   // The engine throws a RangeError when the stack overflows
  console.log(`Error: ${e.message}`);
  console.log(`Stack depth reached: ${count}`); // Shows how many frames fit on the stack
}

// Typical results:
// - Chrome/Node: ~10,000–16,000 (varies by engine and environment)
// - Firefox: ~10,000–40,000
// - Results will differ between machines and browsers because
//   stack size depends on the engine's memory allocation.


// ------------------------------------------------------------
// Exercise 9: Simple Trampoline
// ------------------------------------------------------------

console.log("\n--- Exercise 9 ---");

// Part A: Simple recursive countdown
function countdownRecursive(n) {
  if (n <= 0) {
    console.log("Done!");
    return;
  }
  console.log(n);
  countdownRecursive(n - 1);
}

countdownRecursive(5);

// Part B: Trampoline function
function trampoline(fn) {
  let result = fn;                       // Start with the initial function (thunk)
  while (typeof result === "function") { // Keep going as long as we get back a function
    result = result();                   // Call the function — this pops the old frame
                                         // off the stack and pushes a new one, so the
                                         // stack depth never grows beyond 1 frame.
  }
  return result;                         // When result is NOT a function, we're done
}

// Part C: Trampolined countdown
function countdownTrampolined(n) {
  if (n <= 0) return "Done!";            // Base case: return a VALUE (not a function)
  console.log(n);                        // Do the work for this step
  return () => countdownTrampolined(n - 1); // Return a THUNK (a function that wraps
                                             // the next recursive call). This avoids
                                             // adding to the call stack — the trampoline
                                             // will call it in the next loop iteration.
}

console.log(trampoline(() => countdownTrampolined(5)));

// Challenge: This works with n = 100000 because each call returns
// a function instead of adding to the stack. The trampoline loop
// calls it iteratively, so the stack never grows beyond 1 frame.
// console.log(trampoline(() => countdownTrampolined(100000)));


// ------------------------------------------------------------
// Exercise 10: Deferred Rendering (Browser Solution)
// ------------------------------------------------------------

console.log("\n--- Exercise 10 ---");

// Version 1 answer: The alert appears BEFORE the numbers are visible
// because the browser hasn't had a chance to repaint. All the DOM
// mutations happen synchronously, then alert() blocks before repaint.

// Version 2: Deferred rendering solution
function addNumber(i, max) {
  if (i > max) {                          // Base case: all numbers rendered
    console.log("Done!");                 // In browser: alert("Done!")
    return;
  }
  // In browser: output.innerHTML += `<p>${i}</p>`;
  console.log(`Rendering number: ${i}`);  // Render the current number
  setTimeout(() => addNumber(i + 1, max), 0); // Schedule the NEXT number
  // ^ setTimeout(..., 0) yields control back to the browser's event loop.
  //   This lets the browser REPAINT the screen before processing the next
  //   number. Without this, all DOM changes would happen synchronously
  //   and the user wouldn't see anything until the entire loop finishes.
}

addNumber(1, 10); // Using 10 for console demo (use 100 in browser)

// Now the alert appears AFTER all numbers are visible because
// each setTimeout yields control back to the browser, allowing
// it to repaint between iterations.


// ------------------------------------------------------------
// Exercise 11: Event Loop Visualization (Loupe)
// ------------------------------------------------------------

// Summary: The event loop continuously checks if the call stack
// is empty. If it is, it takes the first callback from the task
// queue and pushes it onto the call stack for execution. This is
// why asynchronous callbacks (setTimeout, fetch, etc.) always run
// AFTER all synchronous code has finished.


// ============================================================
// 🎯 Checkpoint Answers:
// ============================================================
// [✓] The call stack is a LIFO data structure that tracks which
//     function is currently executing and what called it.
// [✓] setTimeout callbacks always run after synchronous code,
//     even with a 0ms delay.
// [✓] setTimeout(..., 0) goes through the Web API → task queue →
//     event loop. It can only execute when the call stack is empty.
// [✓] A trampoline converts recursion into iteration by returning
//     functions instead of making direct recursive calls.
// [✓] setTimeout(..., 0) yields control to the browser between
//     iterations, allowing repaint/rendering to occur.
