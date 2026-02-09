# R-ALAB 308A.4.1 — Working with External Data

> **Version 1.0** · 10/18/23

---

## Introduction

This graded assignment challenges you to create an interactive application using data from an external Application Programming Interface (API). You will employ `fetch`, Axios, and `async`/`await` syntax.

## Objectives

- Request data from an external API using `fetch` and Axios.
- Create an interactive, dynamic webpage that serves content from an external API.
- Use `async`/`await` and Promises to create synchronous logic in asynchronous actions.
- Using `fetch` or Axios, `POST` data to and `DELETE` data from an external API.

## Submission

Submit your completed lab using the **Start Assignment** button on the assignment page in Canvas.

**Your submission should include:**

- A GitHub link to your completed project repository.

---

## Instructions

The provided CodeSandbox contains pre-configured contents, including an HTML layout, CSS styling, and instructions embedded as comments.

1. Download the sandbox and initialize a local git repository.
2. Link this repository to GitHub.
3. You will be primarily working within the `index.js` file.

> 💡 **Commit frequently!** Every time something works, you should commit it.

---

## Part 1: The API

You will be working with [**The Cat API**](https://thecatapi.com/), a free public API.

1. Navigate to the API's website and **create an account**.
2. **Explore the documentation** — every API is different, so never make assumptions about how one works.

---

## Part 2: Tasks

Implement the following (best done in order):

### Task 1: Initial Load

Create an `async` function `initialLoad` that does the following:

- Retrieve a **list of breeds** from the Cat API using `fetch()`.
- Create new `<option>` elements for each breed and append them to `breedSelect`.
  - Each option should have a `value` attribute equal to the breed's `id`.
  - Each option should display text equal to the breed's `name`.
- This function should **execute immediately**.

### Task 2: Breed Selection Handler

Create an event handler for `breedSelect` that:

- Retrieves information on the **selected breed** from the Cat API using `fetch()`.
  - Ensure your request receives **multiple array items** (check the API docs).
- For each object in the response, create a new **carousel element**.
- Append each element to the carousel.
- Create an **informational section** within `infoDump` using the breed data.
  - Be creative with DOM elements and HTML!
  - Feel free to edit `index.html` and `styles.css`.
- **Each new selection** should clear, re-populate, and restart the carousel.
- Add a call to this function at the end of `initialLoad` for the initial carousel.

### Task 3: Convert to Axios

- Create an **additional file** for the alternative approach.
- Change **all `fetch()` functions** to Axios.
  - Axios has already been imported in `index.js`.
  - 💡 **Hint:** Axios can set default headers and a default base URL!

### Task 4: Axios Interceptors

- Add Axios interceptors to **log the time** between request and response.
- Add a `console.log` statement when requests begin.
- 🏆 **Challenge:** Try this without referencing the lesson material.

### Task 5: Progress Bar

- Modify the `progressBar` element's `width` style property.
- In your request interceptor, set the width to `0%` (reset with each request).
- Research the Axios `onDownloadProgress` config option.
- Create an `updateProgress` function that receives a `ProgressEvent` object.

### Task 6: Cursor Feedback

- In your request interceptor, set `body` cursor to `"progress"`.
- In your response interceptor, set `body` cursor to `"default"`.

### Task 7: Favourites System

- Implement the `favourite()` function (skeleton already created).
- `POST` to the Cat API's favourites endpoint with the given `id`.
  - Use Axios (not fetch)!
- Add **toggle behavior** — if already favourited, `DELETE` that favourite.

### Task 8: Get Favourites

- Create a `getFavourites()` function using Axios.
- Clear the carousel and display favourites when the button is clicked.
- Bind the event listener to `getFavouritesBtn`.
  - 💡 **Hint:** Reuse your carousel-building logic.

### Task 9: Testing

- **Test thoroughly!** Debug as needed.
- What happens with the **Malayan** breed? Fix it if needed.
- Not every breed has the same data — your code should account for this.

---

## Solution Demo

Your instructor has access to a demo solution. Note that the solution code is **not perfect** — there are improvements to be made.

> ❓ Can you identify potential improvements? Here's one for free: **Where is the error handling?!**

---

*Copyright © Per Scholas 2026*

