// ============================================================
// 308A.5 — Exercises: Modules & Imports
// ============================================================
// These exercises build progressively toward the skills needed
// for ALAB 308A.5.1 and the SBA capstone.
//
// ⚠️  IMPORTANT: Modules require either:
//   - A bundler (Vite, Webpack)
//   - <script type="module" src="main.js"></script> in HTML
//   - CodeSandbox / StackBlitz (recommended for quick testing)
//
// Since modules involve MULTIPLE files, this exercise file
// uses comments to delineate which code goes in which file.
// Create the files as indicated by the === FILE: === headers.
// ============================================================


// ============================================================
// Exercise 1: Your First Export and Import
// ============================================================
// Goal: Export a simple value and import it in another file.
//
// TODO: Create these two files and run main.js.

// === FILE: math.js ==========================================
// TODO: Export PI, add, and subtract

// export const PI = ???;

// export function add(a, b) {
//   // TODO
// }

// export function subtract(a, b) {
//   // TODO
// }

// === FILE: main.js ==========================================
// TODO: Import PI, add, subtract from ./math.js and test them

// import { ??? } from './math.js';

// console.log(`PI is ${PI}`);
// console.log(`2 + 3 = ${add(2, 3)}`);
// console.log(`10 - 4 = ${subtract(10, 4)}`);

// TODO: Try importing only `add` — does it still work?
// TODO: What happens if you try to use `subtract` without importing it?


// ============================================================
// Exercise 2: Grouped Exports
// ============================================================
// Goal: Export multiple items in a single export statement.

// === FILE: stringUtils.js ===================================

// function capitalize(str) {
//   // TODO: Uppercase the first letter, return the rest unchanged
// }

// function reverse(str) {
//   // TODO: Reverse the string
// }

// function truncate(str, maxLength) {
//   // TODO: If str is longer than maxLength, slice it and add "..."
// }

// TODO: Export all three using a grouped export statement:
// export { ??? };

// === FILE: main.js ==========================================
// TODO: Import and test all three functions

// TODO: Add a repeat(str, n) function, export it, and test it.


// ============================================================
// Exercise 3: Renaming Imports
// ============================================================
// Goal: Handle naming conflicts with `as`.

// === FILE: moduleA.js =======================================
// TODO: Export a function called `format` that returns `[A] ${data}`

// === FILE: moduleB.js =======================================
// TODO: Export a function called `format` that returns `[B] ${data}`

// === FILE: main.js ==========================================
// TODO: Import both format functions using `as` to rename them.
//       Log the results of calling each.

// import { format as ??? } from './moduleA.js';
// import { format as ??? } from './moduleB.js';

// TODO: What happens if you import both without renaming?


// ============================================================
// Exercise 4: Wildcard Imports (*)
// ============================================================
// Goal: Import an entire module as a namespace object.

// === FILE: main.js ==========================================
// TODO: Import everything from math.js using * as MathUtils
// import * as ??? from './math.js';

// TODO: Access PI, add, subtract via the namespace object
// console.log(???.PI);
// console.log(???.add(5, 3));

// TODO: Log the entire MathUtils object — what does it look like?

// TODO: When is this preferable to individual imports?
//       Write your answer as a comment.


// ============================================================
// Exercise 5: Default Exports
// ============================================================
// Goal: Use export default for single-item modules.

// === FILE: Logger.js ========================================

// TODO: Create and export a default Logger class with:
//   - constructor(prefix)
//   - log(message) — logs "[prefix] message"
//   - error(message) — logs "[prefix ERROR] message"

// === FILE: main.js ==========================================
// TODO: Import the Logger (no curly braces!)
//       Create an instance and test log() and error().

// TODO: Rename the import to AppLogger — does it still work?

// TODO: Can you have both default and named exports in the
//       same file? Try it!


// ============================================================
// Exercise 6: Mixed Exports (Default + Named)
// ============================================================
// Goal: Use both export types in one module.

// === FILE: api.js ===========================================

// const BASE_URL = "https://jsonplaceholder.typicode.com";

// TODO: Create a NAMED export function getUrl(endpoint)
//       that returns `${BASE_URL}/${endpoint}`

// TODO: Create a NAMED export function getHeaders(apiKey)
//       that returns an object with Content-Type and x-api-key

// TODO: Create a DEFAULT export async function fetchData(endpoint)
//       that fetches from getUrl(endpoint) and returns response.json()

// === FILE: main.js ==========================================
// TODO: Import BOTH the default and named exports in one line:
// import ???, { ???, ??? } from './api.js';

// console.log(getUrl("todos"));
// const data = await fetchData("todos/1");
// console.log(data);


// ============================================================
// Exercise 7: Exporting Classes
// ============================================================
// Goal: Organize OOP code into modules. Builds on Lesson 2.

// === FILE: Character.js =====================================
// TODO: Export a Character class with:
//   - constructor(name) — sets name and health=100
//   - roll() — returns Math.floor(Math.random() * 20) + 1

// === FILE: Adventurer.js ====================================
// TODO: Import Character from './Character.js'
// TODO: Export an Adventurer class that extends Character:
//   - constructor(name, role) — calls super(name), sets role
//   - scout() — logs "[name] is scouting... rolled a [roll()]"

// === FILE: main.js ==========================================
// TODO: Import Adventurer, create an instance, call scout()

// BONUS: Create a Companion class in its own file that also
//        extends Character. Import both into main.js.


// ============================================================
// Exercise 8: Module Organization Pattern (Barrel File)
// ============================================================
// Goal: Practice the "barrel file" pattern for clean imports.
//
// Target structure:
//   utils/
//     math.js
//     string.js
//     array.js
//     index.js    ← barrel file
//   main.js

// === FILE: utils/array.js ===================================
// TODO: Create and export these two functions:

// function unique(arr) {
//   // TODO: Return array with duplicates removed
// }

// function flatten(arr) {
//   // TODO: Flatten a nested array one level deep
// }

// export { ??? };

// === FILE: utils/index.js (barrel file) =====================
// TODO: Re-export items from all three utility files:
// export { add, subtract, PI } from './math.js';
// export { capitalize, reverse } from './string.js';
// export { ???, ??? } from './array.js';

// === FILE: main.js ==========================================
// TODO: Import from the barrel file and use:
// import { add, capitalize, unique } from './utils/index.js';


// ============================================================
// Exercise 9: Modularize a Monolith
// ============================================================
// Goal: Directly prepares for ALAB 308A.5.1.
//
// Take this monolithic code and split it into the target files.
// The complete monolith is provided below — reorganize it.

/*
// === MONOLITH (all in one file) =============================

const API_KEY = "abc123";
const BASE_URL = "https://api.example.com";

function getUrl(endpoint) {
  return `${BASE_URL}/${endpoint}`;
}

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchUsers() {
  const response = await fetch(getUrl('users'));
  return response.json();
}

async function main() {
  const users = await fetchUsers();
  users.forEach(u => {
    const user = new User(capitalize(u.name), u.email);
    user.greet();
  });
}

main();
*/

// TODO: Split the monolith above into these files:
//
// === FILE: config.js ========================================
// TODO: Export API_KEY, BASE_URL, and getUrl

// === FILE: User.js ==========================================
// TODO: Export the User class

// === FILE: utils.js =========================================
// TODO: Export formatDate and capitalize

// === FILE: api.js ===========================================
// TODO: Import getUrl from config.js
// TODO: Export fetchUsers

// === FILE: main.js ==========================================
// TODO: Import from all other files and run main()


// ============================================================
// 🎯 Checkpoint: Ready for the Assignment & SBA?
// ============================================================
// Before starting ALAB 308A.5.1 and the SBA, make sure you can:
//   [ ] Export named values with export
//   [ ] Export a default value with export default
//   [ ] Import named exports with { } syntax
//   [ ] Import default exports without { }
//   [ ] Rename imports with as
//   [ ] Use wildcard imports with * as
//   [ ] Organize a project into logical module files
//   [ ] Use <script type="module"> in HTML
//
// SBA Requirement: At least 3 different module files (3% of grade).
