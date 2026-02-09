# 308A.5 — Bite-Size Exercises: Modules & Imports

> These exercises build progressively toward the skills needed for **ALAB 308A.5.1** and the **SBA capstone**.

---

> ⚠️ **Important:** Modules require either a bundler (like Vite or Webpack) or `<script type="module">` in HTML. For these exercises, use either CodeSandbox or create an HTML file with `<script type="module" src="main.js"></script>`.

---

## Exercise 1: Your First Export and Import

**Goal:** Export a simple value and import it in another file.

**`math.js`**
```javascript
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

**`main.js`**
```javascript
import { PI, add, subtract } from './math.js';

console.log(`PI is ${PI}`);
console.log(`2 + 3 = ${add(2, 3)}`);
console.log(`10 - 4 = ${subtract(10, 4)}`);
```

**Tasks:**
1. Create both files and run `main.js`.
2. Try importing only `add` — does it still work?
3. What happens if you try to use `subtract` without importing it?

---

## Exercise 2: Grouped Exports

**Goal:** Export multiple items in a single statement.

**`stringUtils.js`**
```javascript
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
  return str.split('').reverse().join('');
}

function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export { capitalize, reverse, truncate };
```

**`main.js`**
```javascript
import { capitalize, reverse, truncate } from './stringUtils.js';

console.log(capitalize("hello"));       // "Hello"
console.log(reverse("hello"));          // "olleh"
console.log(truncate("hello world", 5)); // "hello..."
```

**Tasks:**
1. Test all three functions.
2. Add a `repeat(str, n)` function and export it.
3. Import and test your new function.

---

## Exercise 3: Renaming Imports

**Goal:** Handle naming conflicts with `as`.

**`moduleA.js`**
```javascript
export function format(data) {
  return `[A] ${data}`;
}
```

**`moduleB.js`**
```javascript
export function format(data) {
  return `[B] ${data}`;
}
```

**`main.js`**
```javascript
import { format as formatA } from './moduleA.js';
import { format as formatB } from './moduleB.js';

console.log(formatA("Hello"));  // "[A] Hello"
console.log(formatB("Hello"));  // "[B] Hello"
```

**Tasks:**
1. Run this and verify both formats work.
2. What happens if you import both without renaming?
3. When would you encounter this in real projects?

---

## Exercise 4: Wildcard Imports (`*`)

**Goal:** Import an entire module as a namespace object.

```javascript
import * as MathUtils from './math.js';

console.log(MathUtils.PI);
console.log(MathUtils.add(5, 3));
console.log(MathUtils.subtract(10, 4));
```

**Tasks:**
1. Convert Exercise 1 to use wildcard imports.
2. Log the entire `MathUtils` object — what does it look like?
3. When is this preferable to individual imports?

---

## Exercise 5: Default Exports

**Goal:** Use `export default` for single-item modules.

**`Logger.js`**
```javascript
export default class Logger {
  constructor(prefix) {
    this.prefix = prefix;
  }

  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  }

  error(message) {
    console.error(`[${this.prefix} ERROR] ${message}`);
  }
}
```

**`main.js`**
```javascript
import Logger from './Logger.js';
// Note: no curly braces! Can be named anything.

import MyLogger from './Logger.js';  // This also works!

const logger = new Logger("App");
logger.log("Application started");
logger.error("Something went wrong");
```

**Tasks:**
1. Create and use the Logger.
2. Rename the import to `AppLogger` — does it still work?
3. Can you have both default and named exports in the same file? Try it!

---

## Exercise 6: Mixed Exports (Default + Named)

**Goal:** Use both export types in one module.

**`api.js`**
```javascript
const BASE_URL = "https://jsonplaceholder.typicode.com";

export function getUrl(endpoint) {
  return `${BASE_URL}/${endpoint}`;
}

export function getHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  };
}

export default async function fetchData(endpoint) {
  const response = await fetch(getUrl(endpoint));
  return response.json();
}
```

**`main.js`**
```javascript
import fetchData, { getUrl, getHeaders } from './api.js';

console.log(getUrl("todos"));
const data = await fetchData("todos/1");
console.log(data);
```

**Tasks:**
1. Run this and verify all imports work.
2. Note the syntax: default import has no braces, named imports do.
3. This pattern (default function + named helpers) is very common!

---

## Exercise 7: Exporting Classes

**Goal:** Organize OOP code into modules. **Builds on Lesson 2 content.**

**`Character.js`**
```javascript
export class Character {
  constructor(name) {
    this.name = name;
    this.health = 100;
  }

  roll() {
    return Math.floor(Math.random() * 20) + 1;
  }
}
```

**`Adventurer.js`**
```javascript
import { Character } from './Character.js';

export class Adventurer extends Character {
  constructor(name, role) {
    super(name);
    this.role = role;
  }

  scout() {
    console.log(`${this.name} is scouting... rolled a ${this.roll()}`);
  }
}
```

**`main.js`**
```javascript
import { Adventurer } from './Adventurer.js';

const robin = new Adventurer("Robin", "Fighter");
robin.scout();
```

**Tasks:**
1. Create this 3-file structure and run it.
2. Add a `Companion` class in its own file that also extends `Character`.
3. Import both into `main.js` and create instances.

---

## Exercise 8: Module Organization Pattern

**Goal:** Practice the "barrel file" pattern for clean imports.

Create this structure:
```
utils/
  math.js
  string.js
  array.js
  index.js    ← barrel file
main.js
```

**`utils/index.js`** (barrel file)
```javascript
export { add, subtract, PI } from './math.js';
export { capitalize, reverse } from './string.js';
export { unique, flatten } from './array.js';
```

**`main.js`**
```javascript
import { add, capitalize, unique } from './utils/index.js';
```

**Tasks:**
1. Create the `array.js` file with `unique` and `flatten` functions.
2. Set up the barrel file.
3. Import and use functions from all three utility modules via the single barrel file.

---

## Exercise 9: Modularize a Monolith

**Goal:** Directly prepares for **ALAB 308A.5.1**.

Take this monolithic code and split it into modules:

```javascript
// ALL IN ONE FILE — this needs to be modularized!

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

// Main application logic
async function main() {
  const users = await fetchUsers();
  users.forEach(u => {
    const user = new User(capitalize(u.name), u.email);
    user.greet();
  });
}

main();
```

**Target structure:**
```
config.js       → API_KEY, BASE_URL, getUrl
User.js         → User class
utils.js        → formatDate, capitalize
api.js          → fetchUsers (imports from config.js)
main.js         → main logic (imports from all others)
```

---

## 🎯 Checkpoint: Ready for the Assignment & SBA?

Before starting **ALAB 308A.5.1** and the **SBA**, make sure you can:

- [ ] Export named values with `export`
- [ ] Export a default value with `export default`
- [ ] Import named exports with `{ }` syntax
- [ ] Import default exports without `{ }`
- [ ] Rename imports with `as`
- [ ] Use wildcard imports with `* as`
- [ ] Organize a project into logical module files
- [ ] Use `<script type="module">` in HTML

> 📌 **SBA Requirement:** Organize your JavaScript code into **at least 3 different module files**, and import functions and data across files as necessary (**3% of grade**).

---

*These exercises prepare you for ALAB 308A.5.1 and the SBA 308A capstone project.*
