# 308A.1.2 — Trampolines: Solving Stack Overflow with Iteration

> **React Developer Curriculum** · Lesson 1 Supplement

---

## Learning Objectives

By the end of this lesson, learners should be able to:

- Explain why deep recursion causes a stack overflow.
- Define what a "thunk" is and why it matters.
- Implement a trampoline function from scratch.
- Convert any recursive function into a trampolined version.

---

## The Problem: Recursion and the Call Stack

From the main lesson, we know that every function call gets pushed onto the call stack and only gets removed once it returns. Recursive functions call *themselves*, which means each recursive call adds **another frame** to the stack before the previous one has returned.

```javascript
function countDown(n) {
  if (n === 0) return "Done!";
  return countDown(n - 1);
}

countDown(5); // Works fine — only 5 frames deep
```

This works for small values of `n`. But what happens with large values?

```javascript
countDown(100000); // 💥 RangeError: Maximum call stack size exceeded
```

The call stack has a finite size (typically ~10,000–16,000 frames). When recursion goes deeper than that limit, JavaScript throws a **stack overflow** error.

> 📌 **Key insight:** The stack overflow happens because every recursive call *waits* for the next one to return. None of them can be removed from the stack until the very last call resolves, and then they all unwind in reverse order.

---

## The Solution: Trampolining

A **trampoline** is a technique that converts deep recursion into a flat loop. Instead of a function calling itself directly (adding to the stack), it **returns a function** that *would* make the next call. An outer loop then calls that returned function, one at a time, keeping the stack at a constant depth of 1.

Think of it like a literal trampoline: instead of stacking people on top of each other (recursion), each person bounces up (returns a function), lands (the loop catches it), and the next person bounces (the loop calls it).

---

## Building a Trampoline: Step by Step

### Step 1 — Understand the "Thunk"

A **thunk** is a function that wraps a computation to delay its execution. Instead of *doing* something, it *returns a function that will do something* when called.

```javascript
// This DOES the work immediately:
countDown(n - 1);

// This WRAPS the work in a function (a thunk):
() => countDown(n - 1);
```

The thunk doesn't execute `countDown(n - 1)` — it just holds onto the idea of doing so. Someone else (the trampoline) will call it later.

---

### Step 2 — The Trampoline Function (Line by Line)

```javascript
function trampoline(fn) {        // [1]
  let result = fn();             // [2]
  while (typeof result === "function") {  // [3]
    result = result();           // [4]
  }
  return result;                 // [5]
}
```

Let's break down every line:

| Line | Code | What It Does |
|------|------|-------------|
| **[1]** | `function trampoline(fn)` | Defines the trampoline. It accepts `fn`, which is a **function to kick things off** (the first thunk). |
| **[2]** | `let result = fn()` | Calls the initial function. The return value is stored in `result`. This could be either a **final value** (like a number or string) or a **thunk** (another function to call). |
| **[3]** | `while (typeof result === "function")` | Checks: did we get back a function (thunk)? If yes, there's more work to do. If no, we're done. |
| **[4]** | `result = result()` | Calls the thunk, which executes one step of the recursion and returns either the next thunk or a final value. **Crucially:** the previous call is already off the stack before this one runs. The stack never grows beyond 1 frame. |
| **[5]** | `return result` | Once the loop ends (we got a non-function value), return the final result. |

> 📌 **Why this works:** Each call to `result()` on line [4] completes and returns *before* the next call happens. The stack depth never exceeds 1, no matter how many iterations occur.

---

### Step 3 — Convert a Recursive Function

Here's a normal recursive function:

```javascript
// BEFORE: Standard recursion (will overflow at ~15,000)
function sumTo(n, acc = 0) {
  if (n === 0) return acc;
  return sumTo(n - 1, acc + n);   // ← Direct recursive call
}
```

To make it trampoline-safe, change the recursive call to return a **thunk** instead:

```javascript
// AFTER: Trampoline-safe (works for ANY value of n)
function sumTo(n, acc = 0) {
  if (n === 0) return acc;             // Base case: return a VALUE
  return () => sumTo(n - 1, acc + n);  // Recursive case: return a FUNCTION
}
```

The **only change** is on the last line: instead of `return sumTo(...)` we write `return () => sumTo(...)`. That arrow function is the thunk.

---

### Step 4 — Use the Trampoline to Run It

```javascript
const result = trampoline(() => sumTo(100000));
console.log(result); // 5000050000 ✅ No stack overflow!
```

We pass `() => sumTo(100000)` (a thunk) to `trampoline`, which handles the rest.

---

## Complete Walkthrough: Tracing Execution

Let's trace `trampoline(() => sumTo(3))` step by step to see exactly what happens:

```
trampoline(() => sumTo(3))

Step 1: result = fn()
        result = sumTo(3, 0)
        → n=3, not 0 → return () => sumTo(2, 3)
        result is a FUNCTION ✅ loop continues

Step 2: result = result()
        result = sumTo(2, 3)
        → n=2, not 0 → return () => sumTo(1, 5)
        result is a FUNCTION ✅ loop continues

Step 3: result = result()
        result = sumTo(1, 5)
        → n=1, not 0 → return () => sumTo(0, 6)
        result is a FUNCTION ✅ loop continues

Step 4: result = result()
        result = sumTo(0, 6)
        → n=0! → return 6
        result is a NUMBER ❌ loop ends

return 6 ✅
```

Notice: at **every step**, the call stack only has one frame (`sumTo`). The previous `sumTo` call has already returned before the next one begins.

---

## Another Example: Recursive Countdown (Line by Line)

```javascript
// The trampoline (reusable for any trampolined function)
function trampoline(fn) {                         // [1] Accept an initial thunk
  let result = fn();                              // [2] Call it to get the first result
  while (typeof result === "function") {          // [3] While we keep getting thunks back...
    result = result();                            // [4] ...call the thunk to get the next result
  }                                               //
  return result;                                  // [5] Return the final non-function value
}

// The recursive function (returns thunks instead of calling itself)
function countdown(n) {                           // [6] Takes the current count
  if (n <= 0) {                                   // [7] Base case: stop when we reach 0
    return "Liftoff!";                            // [8] Return a VALUE (not a function)
  }                                               //
  console.log(n);                                 // [9] Do the work for this step
  return () => countdown(n - 1);                  // [10] Return a THUNK for the next step
}                                                 //      (NOT a direct recursive call)

// Kick it off
const message = trampoline(() => countdown(5));   // [11] Pass the first thunk to trampoline
console.log(message);                             // [12] Log the final return value
```

**Output:**
```
5
4
3
2
1
Liftoff!
```

| Line | Purpose |
|------|---------|
| **[6]** | Our function signature — same as normal recursion |
| **[7–8]** | Base case returns a **plain value**, which tells the trampoline to stop looping |
| **[9]** | The actual work this step needs to do (logging the number) |
| **[10]** | Instead of `countdown(n - 1)`, we return `() => countdown(n - 1)` — a thunk. This is the **key difference** from normal recursion. |
| **[11]** | We wrap the first call in a thunk too: `() => countdown(5)` |
| **[12]** | After the trampoline finishes looping, we get back `"Liftoff!"` |

---

## Example: Flattening Nested Arrays (Assignment Prep)

This directly prepares you for **Part 2 of ALAB 308A.1.1**.

### Standard Recursive Version (Overflows on Deeply Nested Arrays)

```javascript
function flattenRecursive(arr, result = []) {
  for (let item of arr) {
    if (Array.isArray(item)) {
      flattenRecursive(item, result);   // Direct recursion — adds to stack
    } else {
      result.push(item);
    }
  }
  return result;
}
```

### Trampolined Version (Line by Line)

```javascript
function trampoline(fn) {                              // [1]  Reusable trampoline
  let result = fn();                                   // [2]  Kick off the first thunk
  while (typeof result === "function") {               // [3]  Keep going while we get thunks
    result = result();                                 // [4]  Call the thunk
  }                                                    //
  return result;                                       // [5]  Return the final value
}

function flattenStep(arr, index = 0, result = []) {    // [6]  Process one element at a time
  if (index >= arr.length) {                           // [7]  Base case: processed all elements
    return result;                                     // [8]  Return the VALUE (stops the trampoline)
  }                                                    //
  const item = arr[index];                             // [9]  Get the current element
                                                       //
  if (Array.isArray(item)) {                           // [10] If the element is a nested array...
    const flattened = item.flat(Infinity);             // [11] ...flatten it (use built-in for inner)
    result.push(...flattened);                         // [12] ...spread into our result
  } else {                                             //
    result.push(item);                                 // [13] Otherwise, push the value directly
  }                                                    //
                                                       //
  return () => flattenStep(arr, index + 1, result);    // [14] Return a THUNK for the next element
}                                                      //      (the trampoline will call it)

// Usage:
const nested = [1, [2, [3, [4, [5]]]], 6, [7, 8]];
const flat = trampoline(() => flattenStep(nested));
console.log(flat);
// [1, 2, 3, 4, 5, 6, 7, 8] ✅
```

| Line | What It Does |
|------|-------------|
| **[6]** | Instead of looping inside the function, we track our position with `index` |
| **[7–8]** | When we've processed every element, return the result array (a value, not a function) |
| **[9]** | Grab one element at the current index |
| **[10–13]** | Process that one element: flatten if it's an array, otherwise push directly |
| **[14]** | Return a thunk that will process the *next* element — the trampoline keeps us going |

---

## The Trampoline Pattern at a Glance

```
┌──────────────────────────────────────────────────┐
│                  TRAMPOLINE LOOP                  │
│                                                   │
│   result = fn()                                   │
│       ↓                                           │
│   Is result a function?                           │
│       ├── YES → result = result()  ←── (repeat)   │
│       └── NO  → return result  ✅  (done!)        │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Converting Any Recursive Function — The Two Rules

1. **Base case:** Return a **value** (number, string, array, object — anything that is *not* a function).
2. **Recursive case:** Instead of calling yourself directly, **return a function** (thunk) that calls yourself.

```javascript
// BEFORE (standard recursion):
function doThing(n) {
  if (baseCase) return value;
  return doThing(n - 1);        // Direct call
}

// AFTER (trampoline-safe):
function doThing(n) {
  if (baseCase) return value;
  return () => doThing(n - 1);  // Return a thunk
}

// RUN:
trampoline(() => doThing(100000)); // ✅ No overflow
```

---

## Why Not Just Use Loops?

Good question! In many cases, you *can* rewrite recursion as a loop, and that's often simpler. But trampolines are useful when:

- The **recursive structure** of the code makes the logic much clearer than a loop would.
- You're working with **tree structures** or **nested data** where the recursion depth is unpredictable.
- You want to keep the **elegance of recursion** without the stack overflow risk.
- Some algorithms (especially in functional programming) are naturally expressed as recursion, and trampolining lets you keep that structure.

---

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Forgetting to wrap the first call | `trampoline(sumTo(100000))` calls `sumTo` immediately, bypassing the trampoline | Use `trampoline(() => sumTo(100000))` |
| Returning a function in the base case | The trampoline never stops looping | Base case must return a non-function value |
| Calling the function instead of returning a thunk | `return sumTo(n - 1)` still overflows — it executes before returning | Use `return () => sumTo(n - 1)` |
| Using `trampoline` without changing the recursive function | The recursive function still calls itself directly and overflows | Must convert recursive calls to thunks |

---

## Summary

- **Stack overflow** happens when recursion adds more frames to the call stack than it can hold.
- A **thunk** is a zero-argument function that wraps a deferred computation.
- A **trampoline** is a `while` loop that keeps calling thunks until it gets a final value.
- To trampoline a recursive function: return **thunks** instead of making direct recursive calls.
- The trampoline keeps the stack at **constant depth** (1 frame), regardless of how many iterations occur.

---

*This lesson prepares you for Part 2 of ALAB 308A.1.1.*
