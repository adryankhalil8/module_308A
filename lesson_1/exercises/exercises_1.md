# 308A.1 — Bite-Size Exercises: Call Stack & Event Loop

> These exercises build progressively toward the skills needed for **ALAB 308A.1.1** and the **SBA capstone**.

---

## Exercise 1: Trace the Call Stack (Pencil & Paper)

**Goal:** Understand how the call stack grows and shrinks.

For the following code, **draw or write out the call stack** at each numbered comment:

```javascript
function a() {
  // Stack at [1]?
  b();
  // Stack at [4]?
}

function b() {
  // Stack at [2]?
  c();
  // Stack at [3]?
}

function c() {
  console.log("Hello from c!");
}

a();
// Stack at [5]?
```

✅ **Check:** Your call stack at `[2]` should show `c → b → a`.

---

## Exercise 2: Predict the Output

**Goal:** Identify synchronous execution order.

```javascript
console.log("A");
console.log("B");
console.log("C");
```

Now make it slightly trickier:

```javascript
function first() { console.log("1"); }
function second() { console.log("2"); }
function third() { console.log("3"); }

second();
first();
third();
```

✅ **Check:** Output should be `2`, `1`, `3`.

---

## Exercise 3: Introduction to `setTimeout`

**Goal:** See asynchronous behavior for the first time.

**Predict** the output, then **run** to verify:

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 2000);

console.log("End");
```

**Follow-up:** What happens if you change `2000` to `0`? Try it!

---

## Exercise 4: Zero-Delay setTimeout

**Goal:** Understand that `setTimeout(..., 0)` is NOT immediate.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
```

**Write a 2-sentence explanation** of why `"2"` prints last even though the delay is `0` milliseconds.

---

## Exercise 5: Multiple Timeouts

**Goal:** Predict ordering with multiple async callbacks.

```javascript
setTimeout(() => console.log("A"), 300);
setTimeout(() => console.log("B"), 100);
setTimeout(() => console.log("C"), 200);
console.log("D");
```

**Predict the output order**, then run to verify.

✅ **Check:** `D`, `B`, `C`, `A`

---

## Exercise 6: Blocking the Stack

**Goal:** Experience what happens when the call stack is blocked.

```javascript
console.log("Before loop");

// WARNING: This will freeze your browser tab briefly!
const start = Date.now();
while (Date.now() - start < 3000) {
  // Blocking for 3 seconds
}

console.log("After loop");
```

**Questions:**
1. Can you click anything on the page during those 3 seconds?
2. Why does this happen?
3. How does this relate to `alert()` blocking behavior?

---

## Exercise 7: Callbacks and the Queue

**Goal:** Understand how callbacks enter the queue.

```javascript
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

console.log("Start");

greet("Alice", () => {
  console.log("Callback executed");
});

console.log("End");
```

**Question:** Is the callback in this example synchronous or asynchronous? Why?

Now **modify** it to make the callback asynchronous using `setTimeout`.

---

## Exercise 8: Recursive Call Stack Depth

**Goal:** Directly prepares for **Assignment Part 1** (Stack Overflow).

```javascript
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
```

**Run this and record your result.** Compare with a neighbor — are the numbers the same?

---

## Exercise 9: Simple Trampoline

**Goal:** Directly prepares for **Assignment Part 2** (Trampolines).

First, write a simple recursive countdown:

```javascript
function countdown(n) {
  if (n <= 0) {
    console.log("Done!");
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(5);
```

Now **convert** it to a trampolined version:

```javascript
function trampoline(fn) {
  let result = fn;
  while (typeof result === "function") {
    result = result();
  }
  return result;
}

function countdown(n) {
  if (n <= 0) return "Done!";
  console.log(n);
  return () => countdown(n - 1);  // Return a function instead of calling directly
}

console.log(trampoline(() => countdown(5)));
```

**Challenge:** Try running the trampolined version with `n = 100000`. Does it crash?

---

## Exercise 10: Deferred Rendering

**Goal:** Directly prepares for **Assignment Part 3** (Deferred Execution).

Create an HTML file with:

```html
<div id="output"></div>
<script>
  const output = document.getElementById("output");

  // Version 1: All at once (no deferred execution)
  for (let i = 1; i <= 100; i++) {
    output.innerHTML += `<p>${i}</p>`;
  }
  alert("Done!");
</script>
```

**Observe:** Does the alert appear before or after the numbers?

Now **rewrite** using `setTimeout` to defer each number:

```javascript
function addNumber(i, max) {
  if (i > max) {
    alert("Done!");
    return;
  }
  output.innerHTML += `<p>${i}</p>`;
  setTimeout(() => addNumber(i + 1, max), 0);
}

addNumber(1, 100);
```

**Observe:** Now when does the alert appear? Can you see numbers appearing one by one?

---

## Exercise 11: Event Loop Visualization (Loupe)

**Goal:** Solidify mental model of the event loop.

Go to [Loupe](http://latentflip.com/loupe/) and paste each of these snippets. **Watch the visualization** and make sure you understand each step:

1. Simple function calls (synchronous)
2. A single `setTimeout`
3. Multiple `setTimeout`s with different delays
4. A `setTimeout` inside a `setTimeout`

---

## 🎯 Checkpoint: Ready for the Assignment?

Before starting **ALAB 308A.1.1**, make sure you can:

- [ ] Explain the call stack in your own words
- [ ] Predict output order with `setTimeout`
- [ ] Explain why `setTimeout(..., 0)` still runs after synchronous code
- [ ] Write a basic trampoline function
- [ ] Use `setTimeout` to defer execution and allow browser rendering

---

*These exercises prepare you for ALAB 308A.1.1 and the SBA 308A capstone project.*
