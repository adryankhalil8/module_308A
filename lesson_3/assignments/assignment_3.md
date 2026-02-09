# ALAB 308A.3.1 — Promises and Async/Await

> **Version 1.0** · 10/17/23

---

## Introduction

This assignment showcases some practical uses of asynchronous JavaScript techniques, including Promises and the `async`/`await` syntax. Asynchronous code is extremely common in web application development, and its uses are varied. This assignment highlights one of the most common uses.

## Objectives

- Use `async`/`await` syntax to gather data from asynchronous sources.
- Use Promises to handle asynchronous code.

## Submission

Submit your completed lab using the **Start Assignment** button on the assignment page in Canvas.

**Your submission should include:**

- A GitHub link to your completed project repository, **OR**
- A CodeSandbox link to the completed project.

---

## Instructions

> **Note:** This activity makes use of two concepts that have not yet been fully discussed: **data fetching from external sources** and **modules and imports**. Each will be addressed in the next lessons. It may be beneficial to revisit this assignment after those lessons.

### Getting Started

1. Review the provided CodeSandbox starter code.
2. In `index.js`, we have defined some basic data and a function. The first line imports some variables, and the function defines a simple dictionary object.
3. In `database.js`, there is a fake database system you will use throughout the assignment. You do not need to understand how this database works.

**Choose one:**
- Download the CodeSandbox starter code and create a local git repository.
- Fork the CodeSandbox starter code and continue in CodeSandbox.

> 💡 **Commit frequently!** Every time something works, you should commit it.

---

## Part 1: The Scenario

You are a developer in a very large corporation that splits its data across multiple databases.

Your job is to assemble information using a **single function** that takes an `id` parameter and returns a **Promise** that resolves to an object containing specific data.

### Required Object Structure

```javascript
{
    id: number,
    name: string,
    username: string,
    email: string,
    address: {
      street: string,
      suite: string,
      city: string,
      zipcode: string,
      geo: {
        lat: string,
        lng: string
      }
    },
    phone: string,
    website: string,
    company: {
      name: string,
      catchPhrase: string,
      bs: string
    }
}
```

### The Databases

| Database | Purpose | Returns | Access |
|----------|---------|---------|--------|
| **`central`** | Identifies which database stores the user | A string (database name) | `await central(id)` |
| **`db1`, `db2`, `db3`** | Basic info (username, website, company) | An object | `await db1(id)` |
| **`vault`** | Personal data (name, email, address, phone) | An object | `await vault(id)` |

> 📌 Valid `id` values are **1 through 10** (inclusive). Use values outside this range to test error cases.

**Using the `dbs` object:** You can access each database dynamically using the string returned from `central`:

```javascript
dbs[valueReturnedFromCentral](id)
```

---

## Part 2: The Implementation

Write a single function that:

1. Takes an `id` parameter
2. Returns a `Promise` that resolves to the complete user object

**Choose your approach:**
- Promise chaining via `then()` statements, **or**
- `async`/`await` syntax

> 🏆 **Challenge:** Attempt to refactor your code into the opposite solution and save both versions.

### Performance Requirement

> ⚡ Each database request takes **100ms** to respond. Your function must complete in **200ms or less.**

Since there are three different databases to query, this seems like it would take 300ms minimum — **but it doesn't have to.**

Use **`Promise.all()`** to handle requests concurrently where applicable. Promises only need to be sequential if they depend on the previous Promise's result!

### Testing

Test your function with:

- ✅ **Valid numbers** — 1 through 10 (inclusive)
- ❌ **Invalid numbers** — less than 1 or higher than 10
- ❌ **Invalid data types** — strings, Booleans, etc.

---

*Copyright © Per Scholas 2026*
