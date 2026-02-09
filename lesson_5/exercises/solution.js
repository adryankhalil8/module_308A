// ============================================================
// 308A.5 — SOLUTIONS: Modules & Imports
// ============================================================
// Since modules require multiple files, each solution shows the
// complete contents of every file involved. Create the files as
// indicated by the === FILE: === headers.
// ============================================================


// ============================================================
// Exercise 1: Your First Export and Import
// ============================================================

// === FILE: math.js ==========================================
export const PI = 3.14159;             // `export` makes this constant available to other modules

export function add(a, b) {            // Named export — must be imported by exact name
  return a + b;
}

export function subtract(a, b) {       // Another named export from the same file
  return a - b;
}

// === FILE: main.js ==========================================
import { PI, add, subtract } from './math.js'; // Curly braces = named imports
// ^ You must use the EXACT names that were exported

console.log(`PI is ${PI}`);          // "PI is 3.14159"
console.log(`2 + 3 = ${add(2, 3)}`); // "2 + 3 = 5"
console.log(`10 - 4 = ${subtract(10, 4)}`); // "10 - 4 = 6"

// Importing only `add` works fine — you don't have to import everything.
// Using `subtract` without importing it throws: ReferenceError: subtract is not defined


// ============================================================
// Exercise 2: Grouped Exports
// ============================================================

// === FILE: stringUtils.js ===================================
// Functions are defined normally (no `export` keyword here)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
  // charAt(0) gets the first character, toUpperCase() capitalizes it,
  // slice(1) gets everything after the first character
}

function reverse(str) {
  return str.split('').reverse().join('');
  // split('') → array of characters, reverse() → reversed array, join('') → back to string
}

function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;  // No truncation needed
  return str.slice(0, maxLength) + '...';   // Cut to maxLength and add ellipsis
}

function repeat(str, n) {
  return str.repeat(n);                     // Built-in String method: repeats str n times
}

// Grouped export statement — exports multiple items at once
// This is equivalent to putting `export` in front of each function declaration
export { capitalize, reverse, truncate, repeat };

// === FILE: main.js ==========================================
import { capitalize, reverse, truncate, repeat } from './stringUtils.js';

console.log(capitalize("hello"));         // "Hello"
console.log(reverse("hello"));            // "olleh"
console.log(truncate("hello world", 5));  // "hello..."
console.log(repeat("ha", 3));             // "hahaha"


// ============================================================
// Exercise 3: Renaming Imports
// ============================================================

// === FILE: moduleA.js =======================================
export function format(data) {
  return `[A] ${data}`;
}

// === FILE: moduleB.js =======================================
export function format(data) {
  return `[B] ${data}`;
}

// === FILE: main.js ==========================================
import { format as formatA } from './moduleA.js'; // Rename `format` to `formatA` on import
import { format as formatB } from './moduleB.js'; // Rename `format` to `formatB` on import
// Without `as`, both imports would be named `format` → naming conflict!

console.log(formatA("Hello")); // "[A] Hello"
console.log(formatB("Hello")); // "[B] Hello"

// Without renaming, you get a SyntaxError:
// "The requested module contains conflicting star exports for 'format'"
// or: "Identifier 'format' has already been declared"

// Real-world scenario: two libraries that export the same name,
// e.g., both lodash and your own utils export a `merge` function.


// ============================================================
// Exercise 4: Wildcard Imports (*)
// ============================================================

// === FILE: main.js ==========================================
import * as MathUtils from './math.js'; // Wildcard import: ALL exports bundled into one namespace object
// ^ MathUtils is now an object with properties: { PI, add, subtract }

console.log(MathUtils.PI);            // 3.14159 — access via namespace.property
console.log(MathUtils.add(5, 3));     // 8
console.log(MathUtils.subtract(10, 4)); // 6

// Logging the entire object:
console.log(MathUtils);
// [Module: null prototype] { PI: 3.14159, add: [Function: add], subtract: [Function: subtract] }

// Wildcard imports are preferable when:
// - A module has many exports and you want all of them
// - You want namespace clarity (MathUtils.add vs just add)
// - You want to avoid naming conflicts without renaming each import


// ============================================================
// Exercise 5: Default Exports
// ============================================================

// === FILE: Logger.js ========================================
export default class Logger {          // `export default` — this is the "main" export of this file
  // A module can only have ONE default export
  constructor(prefix) {
    this.prefix = prefix;              // Store the prefix for all log messages
  }

  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  }

  error(message) {
    console.error(`[${this.prefix} ERROR] ${message}`);
  }
}

// === FILE: main.js ==========================================
import Logger from './Logger.js';  // No curly braces! Default imports don't use { }
// ^ You can name this ANYTHING: import Logger, import MyLogger, import Foo — all work

const logger = new Logger("App");
logger.log("Application started");   // "[App] Application started"
logger.error("Something went wrong"); // "[App ERROR] Something went wrong"

// Renaming works — default imports can be named anything:
import AppLogger from './Logger.js';  // Same class, different name
const appLog = new AppLogger("MyApp");
appLog.log("Works!");

// Yes, you can have both default and named exports:
// export default class Logger { ... }
// export const LOG_LEVELS = ["info", "warn", "error"];


// ============================================================
// Exercise 6: Mixed Exports (Default + Named)
// ============================================================

// === FILE: api.js ===========================================
const BASE_URL = "https://jsonplaceholder.typicode.com";
// ^ Not exported — this is a private module-level variable.
//   Only the functions below can access it.

export function getUrl(endpoint) {     // Named export — must use { getUrl } to import
  return `${BASE_URL}/${endpoint}`;    // Builds the full URL from the private BASE_URL
}

export function getHeaders(apiKey) {   // Another named export
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,               // Custom header for API authentication
  };
}

export default async function fetchData(endpoint) { // Default export — the "main" function
  const response = await fetch(getUrl(endpoint));   // Uses the named export internally
  return response.json();                            // Parse and return the JSON
}

// === FILE: main.js ==========================================
import fetchData, { getUrl, getHeaders } from './api.js';
// ^ Default import (no braces) + named imports (with braces) in ONE line

console.log(getUrl("todos"));  // "https://jsonplaceholder.typicode.com/todos"

const data = await fetchData("todos/1");
console.log(data);
// { userId: 1, id: 1, title: '...', completed: false }


// ============================================================
// Exercise 7: Exporting Classes
// ============================================================

// === FILE: Character.js =====================================
export class Character {               // Named export of a class
  constructor(name) {
    this.name = name;
    this.health = 100;
  }

  roll() {
    return Math.floor(Math.random() * 20) + 1; // D20 roll: random number 1–20
  }
}

// === FILE: Adventurer.js ====================================
import { Character } from './Character.js'; // Import the base class from another module

export class Adventurer extends Character { // Extend the imported class
  constructor(name, role) {
    super(name);                       // Call Character's constructor to set name and health
    this.role = role;                  // Add Adventurer-specific property
  }

  scout() {
    console.log(`${this.name} is scouting... rolled a ${this.roll()}`);
    // this.roll() is inherited from Character — it's on the prototype chain
  }
}

// === FILE: Companion.js =====================================
import { Character } from './Character.js'; // Same base class, different module

export class Companion extends Character {
  constructor(name, type) {
    super(name);                       // Initialize inherited properties
    this.type = type;                  // Companion-specific: "Cat", "Dog", etc.
  }

  follow(adventurer) {
    // Takes another character as a parameter to show inter-object interaction
    console.log(`${this.name} the ${this.type} follows ${adventurer.name}`);
  }
}

// === FILE: main.js ==========================================
import { Adventurer } from './Adventurer.js'; // Import from separate files
import { Companion } from './Companion.js';   // Each class lives in its own module

const robin = new Adventurer("Robin", "Fighter");
robin.scout(); // "Robin is scouting... rolled a 14"

const leo = new Companion("Leo", "Cat");
leo.follow(robin); // "Leo the Cat follows Robin"


// ============================================================
// Exercise 8: Module Organization Pattern (Barrel File)
// ============================================================

// === FILE: utils/math.js ====================================
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// === FILE: utils/string.js ==================================
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function reverse(str) {
  return str.split('').reverse().join('');
}

// === FILE: utils/array.js ===================================
export function unique(arr) {
  return [...new Set(arr)];            // Set removes duplicates, spread converts back to array
}

export function flatten(arr) {
  return arr.reduce((flat, item) =>    // reduce() accumulates into a single array
    flat.concat(Array.isArray(item) ? item : [item]), [] // If item is an array, concat it; otherwise wrap in []
  );
}

// === FILE: utils/index.js (barrel file) =====================
// A "barrel file" re-exports from multiple modules through one entry point.
// This lets consumers import from './utils' instead of './utils/math', './utils/string', etc.
export { add, subtract, PI } from './math.js';     // Re-export: import from math.js and immediately export
export { capitalize, reverse } from './string.js';  // No local variable is created — just pass-through
export { unique, flatten } from './array.js';

// === FILE: main.js ==========================================
import { add, capitalize, unique } from './utils/index.js';
// ^ One clean import line instead of three separate imports from three files

console.log(add(2, 3));                           // 5
console.log(capitalize("hello"));                  // "Hello"
console.log(unique([1, 2, 2, 3, 3, 3]));          // [1, 2, 3]


// ============================================================
// Exercise 9: Modularize a Monolith
// ============================================================

// === FILE: config.js ========================================
// Configuration values extracted into their own module
// This makes it easy to change the API URL in one place
export const API_KEY = "abc123";
export const BASE_URL = "https://api.example.com";

export function getUrl(endpoint) {
  return `${BASE_URL}/${endpoint}`;    // Centralized URL builder
}

// === FILE: User.js ==========================================
// One class per file — a common pattern in modular codebases
export class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

// === FILE: utils.js =========================================
// Small helper functions grouped in a utility module
export function formatDate(date) {
  return date.toISOString().split('T')[0]; // "2024-01-15T12:00:00Z" → "2024-01-15"
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// === FILE: api.js ===========================================
import { getUrl } from './config.js';  // Import only what this module needs

export async function fetchUsers() {
  const response = await fetch(getUrl('users')); // Build URL using the config helper
  return response.json();
}

// === FILE: main.js ==========================================
import { fetchUsers } from './api.js';           // Each import is from a focused module
import { User } from './User.js';
import { capitalize } from './utils.js';

async function main() {
  const users = await fetchUsers();               // Get raw data from API
  users.forEach(u => {
    const user = new User(capitalize(u.name), u.email); // Transform + instantiate
    user.greet();                                 // Use the class method
  });
}

main();
