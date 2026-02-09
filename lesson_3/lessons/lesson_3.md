# 308A.3 — Promises and Asynchronous JavaScript

> **React Developer Curriculum** · Lesson 3 of 5

---

## Learning Objectives

By the end of this lesson, learners will be able to:

- Describe the use of Promises.
- Create Promises.
- Use Promises together with the `then()`, `catch()`, and `finally()` methods.
- Use `async`/`await` to create asynchronous functions with synchronous behavior.

---

## Asynchronous JavaScript

We've hinted at the asynchronous capabilities of JavaScript in previous lessons, but now we'll begin diving into the world of async.

**Asynchronous code** is code which does not block the execution of further logic while it is "waiting" to complete, such as the `setTimeout()` function on a most basic level. This also includes calls to external APIs, resource fetching from databases, and callback functions.

To remind yourself of how these asynchronous tasks are handled by JavaScript, reference the lesson on the **Call Stack and Event Loop**.

> 🧪 **Quick Check:** Write down what you think the following code block will log to the console, and then briefly discuss why as a class:

```javascript
console.log("One");

setTimeout(() => console.log("Two"), 0);

console.log("Three");
```

It is very important to understand why this works as it does, even with a "zero-delay" asynchronous function.

---

## Promises

The **`Promise`** object represents the eventual completion (or failure) of an asynchronous operation and its resulting value. Since the value of an asynchronous action isn't necessarily known when it is assigned to a variable, a Promise can occupy that space in the meantime.

> In the vast majority of cases, you will **consume** premade promises, but you can also **create** them.

### Promise States

A Promise can only be in one of three states:

| State | Description |
|-------|-------------|
| **`pending`** | Initial state, neither fulfilled nor rejected |
| **`fulfilled`** | The operation completed successfully |
| **`rejected`** | The operation failed |

When a promise changes to `fulfilled` or `rejected`, it is considered **"settled."** A **"resolved"** promise has settled or matched to the state of another promise.

---

## Chaining Promises

One of the key features of promises is their ability to be chained via `.then()`, `.catch()`, and `.finally()`:

| Method | Purpose |
|--------|---------|
| **`then()`** | Runs when a promise is fulfilled (also accepts a rejection callback as second argument) |
| **`catch()`** | Runs when a promise is rejected |
| **`finally()`** | Runs when a promise is settled (fulfilled OR rejected) |

Each of these methods **returns a promise**, allowing them to be chained indefinitely:

```javascript
// Create a Promise that resolves after one second.
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Guess this worked!");
    }, 1000);
});

// Chain then() methods to handle additional tasks.
myPromise
    .then((x) => x + ' Again?')
    .then((x) => x + ' Third time!')
    .then((x) => x + ' Promises are cool.')
    .catch((err) => {
        console.error(err);
    });
```

> ⚠️ **Important:** Always return results from your promise chains, otherwise callbacks won't know the result of a previous promise. Unreturned promises are called **"floating"** — there is no way to track their settlement.

### Without Promises — Callback Hell

```javascript
doSomething(function (result) {
  doSomethingElse(result, function (newResult) {
    doThirdThing(newResult, function (finalResult) {
      console.log(`Got the final result: ${finalResult}`);
    }, failureCallback);
  }, failureCallback);
}, failureCallback);
```

*Imagine if there were ten callbacks instead of only three...*

---

## Nesting Promises and `catch()` Tips

Nesting is sometimes used to **limit the scope** of `catch()` statements:

```javascript
doSomethingCritical()
  .then((result) =>
    doSomethingOptional(result)
      .then((optionalResult) => doSomethingExtraNice(optionalResult))
      .catch((e) => {}),  // Ignore if optional stuff fails; proceed.
  )
  .then(() => moreCriticalStuff())
  .catch((e) => console.error(`Critical failure: ${e.message}`));
```

You can also chain `then()` after a `catch()`:

```javascript
new Promise((resolve, reject) => {
  console.log("Initial");
  resolve();
})
  .then(() => {
    throw new Error("Something failed");
    console.log("Do this");  // Never reached
  })
  .catch(() => {
    console.error("Do that");
  })
  .then(() => {
    console.log("Do this, no matter what happened before");
  });
```

**Output:**
```
Initial
Do that
Do this, no matter what happened before
```

---

## Error Handling with Promises

With promise chains, you can handle errors at the end:

```javascript
doSomething()
  .then((result) => doSomethingElse(result))
  .then((newResult) => doThirdThing(newResult))
  .then((finalResult) => console.log(`Got the final result: ${finalResult}`))
  .catch(failureCallback);
```

This is analogous to synchronous `try...catch`:

```javascript
try {
  const result = syncDoSomething();
  const newResult = syncDoSomethingElse(result);
  const finalResult = syncDoThirdThing(newResult);
  console.log(`Got the final result: ${finalResult}`);
} catch (error) {
  failureCallback(error);
}
```

---

## Composition Tools

Promise provides **four tools** for running asynchronous operations concurrently:

### `Promise.all()`

Start several operations and wait for **all** to finish:

```javascript
Promise.all([func1(), func2(), func3()]).then(([result1, result2, result3]) => {
  // use result1, result2 and result3
});
```

> If **any** promise rejects, the returned promise is rejected and all other operations are aborted.

### `Promise.allSettled()`

Like `Promise.all`, but waits for **all** operations to complete (regardless of success/failure) before resolving.

### `Promise.any()`

Returns a single Promise that fulfills when **any** of the input promises fulfill (with the first fulfillment value):

```javascript
const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'quick'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'slow'));

Promise.any([promise1, promise2, promise3]).then((value) => console.log(value));
// Output: "quick"
```

### `Promise.race()`

Returns a single Promise that settles with the state of the **first** promise that settles:

```javascript
const promise1 = new Promise((resolve) => setTimeout(resolve, 500, 'one'));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'two'));

Promise.race([promise1, promise2]).then((value) => console.log(value));
// Output: "two"
```

### Sequential Promises with `reduce()`

```javascript
[func1, func2, func3]
  .reduce((p, f) => p.then(f), Promise.resolve())
  .then((result3) => { /* use result3 */ });
```

> 💡 Always consider: do your promises need to run **sequentially** or **concurrently**? Concurrent is more efficient when operations don't depend on each other.

---

## Creating Promises

Use the `Promise` constructor with an executor function:

```javascript
const myFirstPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 250);
});

myFirstPromise.then((successMessage) => {
  console.log(`Yay! ${successMessage}`);
});
```

### Wrapping Callbacks in Promises

A common reason to create promises is to handle errors from callback-accepting functions:

```javascript
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(10 * 1000)
  .then(() => saySomething("10 seconds"))
  .catch(failureCallback);
```

---

## Promises and the Event Loop

### The Microtask Queue

Promises use a **microtask queue**, separate from the regular task queue:

- **Task queue:** `setTimeout`, `setInterval`, event callbacks
- **Microtask queue:** Promise callbacks, `queueMicrotask()`

**Microtasks have higher priority** than tasks — they are processed until the queue is empty before the next task runs.

### 🧪 Coding Challenge

Analyze this code — **predict the output before running it:**

```javascript
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(0).then(() => console.log("Cat"));

Promise.resolve()
  .then(() => console.log("Dog"))
  .then(() => console.log("Cow"));

console.log("Bird");
```

**Breakdown:**
1. `console.log("Bird")` — synchronous, runs first
2. `"Dog"` — microtask (Promise.resolve), runs next
3. `"Cow"` — microtask chained after "Dog"
4. `"Cat"` — microtask, but wrapped in `setTimeout` (task queue), runs last

**Expected output:** `Bird, Dog, Cow, Cat`

---

## Thenables

All Promise-like objects implement the **Thenable** interface — any object with a `.then()` method:

```javascript
const thenable = {
    then: function(onFulfilled) {
        setTimeout(() => onFulfilled("Hey"), 100);
    }
};

const p = Promise.resolve(thenable);
console.log(p instanceof Promise); // true
```

> Promises are thenables, but **not all thenables are promises.**

---

## `async` and `await`

Two of the most important keywords in asynchronous JavaScript:

- **`async`** — declares an async function (always returns a Promise)
- **`await`** — suspends execution until the promise is settled

### These Two Functions Are Identical

```javascript
async function example() {
    return "Hello";
}

function example2() {
    return Promise.resolve("Hello");
}
```

### Example: `await` in Action

```javascript
function resolveAfterSeconds(t) {
    return new Promise(resolve => {
        setTimeout(() => resolve('Done!'), t * 1000);
    });
}

async function testAwait() {
    console.log('Testing...');
    const result = await resolveAfterSeconds(2);
    console.log(result);  // "Done!" after 2 seconds
}

testAwait();
```

> 🧪 **Test:** What happens when you remove the `await` keyword?

---

## Error Handling with `async`/`await`

The power of `async`/`await` — asynchronous code that reads like synchronous:

```javascript
async function foo() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch (error) {
    failureCallback(error);
  }
}
```

Compare with the promise chain version — same behavior, much cleaner syntax.

---

## Lab Activity

Complete the following:

**ALAB 308A.3.1 — Promises and Async/Await**

If you have any questions or get stuck, first reference the available documentation, then consult with peers, then speak with your instructors.

---

*Copyright © Per Scholas 2026*

