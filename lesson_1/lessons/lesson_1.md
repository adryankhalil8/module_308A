# 308A.1 — Call Stack and the Event Loop

> **React Developer Curriculum** · Lesson 1 of 5

---

## Learning Objectives

By the end of this lesson, learners should be able to:

- Explain what the Call Stack is.
- Explain what the Callback Queue is.
- Explain how the Event Loop interacts with the Call Stack and Callback Queue.
- Explain what it means for JavaScript to be a *"single-threaded, non-blocking, asynchronous, concurrent language."*

---

## Call Stack

As we begin calling functions, and functions within functions, it is important to understand the concept of the **"call stack,"** which keeps track of our place within a script during execution. Maintenance of the call stack is important for most software to function properly, but thankfully this is taken care of for us within most high-level programming languages, including JavaScript.

That said, it is still important to understand the call stack and how it affects the way programs execute. For example, consider the following example from the [MDN documentation on the Call Stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack):

```javascript
function greeting() {
  // [1] Some code here
  sayHi();
  // [2] Some code here
}

function sayHi() {
  return "Hi!";
}

// Invoke the `greeting` function
greeting();

// [3] Some code here
```

The code above would be executed like this:

1. Ignore all functions, until it reaches the `greeting()` function invocation.
2. Add the `greeting()` function to the call stack list.
   > **Call stack list:** `- greeting`
3. Execute all lines of code inside the `greeting()` function.
4. Get to the `sayHi()` function invocation.
5. Add the `sayHi()` function to the call stack list.
   > **Call stack list:** `- sayHi` · `- greeting`
6. Execute all lines of code inside the `sayHi()` function, until it reaches its end.
7. Return execution to the line that invoked `sayHi()` and continue executing the rest of the `greeting()` function.
8. Delete the `sayHi()` function from our call stack list.
   > **Call stack list:** `- greeting`
9. When everything inside the `greeting()` function has been executed, return to its invoking line to continue executing the rest of the JS code.
10. Delete the `greeting()` function from the call stack list.
    > **Call stack list:** `EMPTY`

### Summary

We start with an empty call stack. Whenever we invoke a function, it is automatically added to the call stack. Once the function has executed all of its code, it is automatically removed from the call stack. Ultimately, the stack is empty again.

> 📚 While MDN is a wonderful reference for all things JavaScript, it falls short on explanations of the call stack since JavaScript hides most of the inner workings. To learn more about the details of the call stack, check the [Wikipedia page on Call Stack](https://en.wikipedia.org/wiki/Call_stack) and/or any of its references.

---

## The Event Loop

JavaScript is a **single-threaded** programming language with only one call stack (and one "heap," which we won't go into detail about, but it deals with memory allocation). In programming, **"threads"** indicate how many concurrent tasks can be run simultaneously. This means that only one piece of code can run at a time in JavaScript, and the next piece of code will not execute until the previous is finished (it is **"blocked"** by the previous code). We call this **"synchronous"** behavior, and it tends to follow a very logical, linear execution pattern.

### Demonstrating Synchronous, Blocking Behavior

This synchronous, blocking behavior can be easily demonstrated through an example:

1. Go to the [Per Scholas website](https://www.perscholas.org).
2. Open the developer console on your browser.
3. Type the function `alert("I'm blocking you!")` and press enter.
4. Attempt to interact with the main webpage by clicking on links — **you can't!**

The `alert()` function returns a value, and JavaScript refuses to do anything until the "OK" button is clicked and that value is returned. This also highlights the danger of **infinite loops** — we can't have a loop run infinitely off to the side and still accomplish other tasks, because the loop will block us.

### Non-Blocking, Asynchronous Behavior

However, if you look up JavaScript you will see that it is often described as a:

> **"single-threaded, non-blocking, asynchronous, concurrent language."**

According to our definitions, many of those things are opposites! So what's going on here?

JavaScript enables non-blocking, asynchronous behavior by handing off specific tasks like API calls, AJAX requests, and Input/Output (I/O) events (more on these topics in a later lesson) to a **Web API**, which has its own thread! This allows JavaScript to display both single-threaded concurrent behavior and non-blocking asynchronous behavior simultaneously.

**Run the script below** to demonstrate this behavior. The `setTimeout()` function takes two arguments: a callback function to execute, and a time in milliseconds to delay execution by. *Can you predict the output before it runs?*

```javascript
console.log("first");
setTimeout(() => {
    console.log("second");
}, 1000);
console.log("third");
```

### The Callback Queue

This adds another layer of interaction to the call stack, called the **"queue."** The queue (also called the *callback queue* or *task queue*) stores information about what callback functions have been returned by the Web APIs handling asynchronous code.

### How the Event Loop Works

The way the stack, queue, and Web APIs interact with one another is referred to as the **JavaScript Event Loop**. The Event Loop is a process that continuously monitors the state of the stack and queue, checking both for functions to run:

1. **First**, the event loop monitors the call stack.
2. **When** the call stack is empty, it checks the callback queue.
3. It **moves** the first function from the queue onto the empty call stack, if any exist.
4. It **continues** in this way indefinitely.

### Recommended Resources

One of the talks that is consistently referenced when discussing the Event Loop is [**"What the heck is the event loop anyway?"**](https://www.youtube.com/watch?v=8aGhZQkoFbQ) by Philip Roberts. This is a good talk to listen to in order to better understand how JavaScript works.

Philip also created a wonderful tool for visualizing the Event Loop called [**Loupe**](http://latentflip.com/loupe/), which he demonstrates within his talk.

---

### 🧪 Try It: Experiment with Loupe

Experiment with [Loupe](http://latentflip.com/loupe/) to see how different blocks of code interact with the Event Loop!

1. Start by running the provided code.
2. Try the example we provided earlier:

   ```javascript
   console.log("first");
   setTimeout(() => {
       console.log("second");
   }, 1000);
   console.log("third");
   ```

3. Try Array callback functions, `setTimeout`, and any other callbacks you are familiar with.
4. Revisit this tool again after our lessons on AJAX and asynchronous JavaScript.

---

*Copyright © Per Scholas 2026*

