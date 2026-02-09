// ============================================================
// 308A.1 — Exercises: Call Stack & Event Loop
// ============================================================
// These exercises build progressively toward the skills needed
// for ALAB 308A.1.1 and the SBA capstone.
//
// Instructions:
//   - Complete each TODO section.
//   - Run this file with Node.js:  node exercise.js
//   - Some exercises require a browser (noted in comments).
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Trace the Call Stack (Pencil & Paper)
// ------------------------------------------------------------
// Goal: Understand how the call stack grows and shrinks.
//
// For the code below, write out the call stack at each
// numbered comment as a comment (e.g., // Stack: [a]).

function a() {
  // TODO: What is the call stack at [1]?
  // Stack at [1]: ???
  b();
  // TODO: What is the call stack at [4]?
  // Stack at [4]: ???
}

function b() {
  // TODO: What is the call stack at [2]?
  // Stack at [2]: ???
  c();
  // TODO: What is the call stack at [3]?
  // Stack at [3]: ???
}

function c() {
  console.log("Hello from c!");
}

a();
// TODO: What is the call stack at [5]?
// Stack at [5]: ???


// ------------------------------------------------------------
// Exercise 2: Predict the Output
// ------------------------------------------------------------
// Goal: Identify synchronous execution order.
//
// TODO: Before running, write your predicted output as comments
// below each console.log group. Then run to verify.

console.log("\n--- Exercise 2 ---");

function first() { console.log("1"); }
function second() { console.log("2"); }
function third() { console.log("3"); }

second();
first();
third();

// Predicted output:
// ???


// ------------------------------------------------------------
// Exercise 3: Introduction to setTimeout
// ------------------------------------------------------------
// Goal: See asynchronous behavior for the first time.
//
// TODO: Predict the output order, then run to verify.

console.log("\n--- Exercise 3 ---");

console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 2000);

console.log("End");

// TODO: Predicted output order:
// ???

// TODO: What happens if you change 2000 to 0? Write your answer:
// ???


// ------------------------------------------------------------
// Exercise 4: Zero-Delay setTimeout
// ------------------------------------------------------------
// Goal: Understand that setTimeout(..., 0) is NOT immediate.

console.log("\n--- Exercise 4 ---");

console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");

// TODO: Write a 2-sentence explanation of why "2" prints last
//       even though the delay is 0 milliseconds.
// ???


// ------------------------------------------------------------
// Exercise 5: Multiple Timeouts
// ------------------------------------------------------------
// Goal: Predict ordering with multiple async callbacks.

console.log("\n--- Exercise 5 ---");

setTimeout(() => console.log("A"), 300);
setTimeout(() => console.log("B"), 100);
setTimeout(() => console.log("C"), 200);
console.log("D");

// TODO: Predicted output order:
// ???


// ------------------------------------------------------------
// Exercise 6: Blocking the Stack
// ------------------------------------------------------------
// Goal: Experience what happens when the call stack is blocked.
//
// WARNING: This will freeze your environment briefly!
// Uncomment to test, then re-comment.

console.log("\n--- Exercise 6 ---");

// console.log("Before loop");
// const start = Date.now();
// while (Date.now() - start < 3000) {
//   // Blocking for 3 seconds
// }
// console.log("After loop");

// TODO: Answer these questions as comments:
// 1. Can you click anything on the page during those 3 seconds?
//    ???
// 2. Why does this happen?
//    ???
// 3. How does this relate to alert() blocking behavior?
//    ???


// ------------------------------------------------------------
// Exercise 7: Callbacks and the Queue
// ------------------------------------------------------------
// Goal: Understand how callbacks enter the queue.

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

// TODO: Is the callback in this example synchronous or asynchronous? Why?
// ???

// TODO: Modify the greet function below to make the callback asynchronous
//       using setTimeout.

function greetAsync(name, callback) {
  // TODO: Implement this so the callback runs asynchronously
}

// greetAsync("Bob", () => {
//   console.log("Async callback executed");
// });
// console.log("After greetAsync call");


// ------------------------------------------------------------
// Exercise 8: Recursive Call Stack Depth
// ------------------------------------------------------------
// Goal: Directly prepares for Assignment Part 1 (Stack Overflow).

console.log("\n--- Exercise 8 ---");

let count = 0;

function countUp() {
  count++;
  countUp(); // recursive call
}

try {
  countUp();
} catch (e) {
  console.log(`Error: ${e.message}`);
  console.log(`Stack depth reached: ${count}`);
}

// TODO: Run this and record your result:
// My stack depth: ???
// Compare with a neighbor — are the numbers the same?


// ------------------------------------------------------------
// Exercise 9: Simple Trampoline
// ------------------------------------------------------------
// Goal: Directly prepares for Assignment Part 2 (Trampolines).

console.log("\n--- Exercise 9 ---");

// Part A: Simple recursive countdown (provided)
function countdownRecursive(n) {
  if (n <= 0) {
    console.log("Done!");
    return;
  }
  console.log(n);
  countdownRecursive(n - 1);
}

countdownRecursive(5);

// Part B: TODO — Implement the trampoline function
function trampoline(fn) {
  // TODO: Implement the trampoline
  // Keep calling fn() while the result is a function
  // Return the final non-function result
}

// Part C: TODO — Convert the countdown to a trampolined version
function countdownTrampolined(n) {
  // TODO: Instead of calling itself directly,
  //       return a FUNCTION that calls itself.
  //       Base case should return a value, not a function.
}

// Uncomment when ready:
// console.log(trampoline(() => countdownTrampolined(5)));

// Challenge: Try running with n = 100000. Does it crash?
// console.log(trampoline(() => countdownTrampolined(100000)));


// ------------------------------------------------------------
// Exercise 10: Deferred Rendering (Browser Exercise)
// ------------------------------------------------------------
// Goal: Directly prepares for Assignment Part 3.
//
// NOTE: This exercise requires a browser. Create an HTML file
// with <div id="output"></div> and a <script> tag.

// Version 1: All at once (no deferred execution)
// TODO: Copy this into an HTML file and observe — does the alert
//       appear before or after the numbers?
//
// const output = document.getElementById("output");
// for (let i = 1; i <= 100; i++) {
//   output.innerHTML += `<p>${i}</p>`;
// }
// alert("Done!");

// Version 2: TODO — Rewrite using setTimeout to defer each number
// so the browser can render between iterations.
function addNumber(i, max) {
  // TODO: Implement deferred rendering
  // - If i > max, alert "Done!" and return
  // - Otherwise, append a <p> tag with the number
  // - Use setTimeout(..., 0) to schedule the next call
}

// Uncomment in browser:
// addNumber(1, 100);


// ------------------------------------------------------------
// Exercise 11: Event Loop Visualization (Loupe)
// ------------------------------------------------------------
// Goal: Solidify mental model of the event loop.
//
// Go to http://latentflip.com/loupe/ and paste each snippet below.
// Watch the visualization and understand each step.

// Snippet 1: Simple function calls
// function multiply(a, b) { return a * b; }
// function square(n) { return multiply(n, n); }
// console.log(square(5));

// Snippet 2: A single setTimeout
// console.log("Hi");
// setTimeout(() => console.log("There"), 1000);
// console.log("Bye");

// Snippet 3: Multiple setTimeouts with different delays
// setTimeout(() => console.log("A"), 300);
// setTimeout(() => console.log("B"), 100);
// setTimeout(() => console.log("C"), 200);

// Snippet 4: Nested setTimeout
// setTimeout(() => {
//   console.log("First");
//   setTimeout(() => console.log("Second"), 500);
// }, 500);

// TODO: After watching all 4 in Loupe, write a 1-sentence summary
//       of what the event loop does:
// ???


// ============================================================
// 🎯 Checkpoint: Ready for the Assignment?
// ============================================================
// Before starting ALAB 308A.1.1, make sure you can:
//   [ ] Explain the call stack in your own words
//   [ ] Predict output order with setTimeout
//   [ ] Explain why setTimeout(..., 0) still runs after sync code
//   [ ] Write a basic trampoline function
//   [ ] Use setTimeout to defer execution and allow browser rendering
