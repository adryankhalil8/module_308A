# 308A.5 — Modules and Imports

> **React Developer Curriculum** · Lesson 5 of 5

---

## Learning Objectives

By the end of this lesson, learners should be able to:

- Use the `import` and `export` keywords to organize code into modules.

---

## Modules and Imports

As JavaScript programs grow in size and complexity, it makes sense to split content into separate files for organization. Nobody wants to deal with a single JavaScript file with 10,000 lines of code. Code that is split into files that contain specific sets of functionality are called **"modules."**

Modern implementations provide us with two keywords to enable this functionality: **`import`** and **`export`**.

---

## Exporting

The `export` keyword can be used in front of any variable or function declaration (and classes) to make that item available to external files. It can only export a **top-level item** — you cannot, for example, export a variable from inside a function.

### Named Exports

```javascript
export const name = "Module File Value";

export function getValue(arg) {
  // do something with arg
}
```

### Consolidated Export Statement

For a module with many exports, you can consolidate into a single line:

```javascript
export { name, getValue, findAnswer, makeCake, eatItToo };
```

---

## Importing

### Basic Named Import

```javascript
import { name, getValue, findAnswer, makeCake, eatItToo } from './modules/myModule.js';
```

You can include or forgo any of these imports, depending on what you want to use.

### Renaming Imports with `as`

```javascript
import { getValue as gVal, makeCake } from './modules/myModule.js';

const x = gVal(a);
```

This is particularly useful when you have modules with the same names for items:

```javascript
import { getValue as getParsedArgData } from './modules/myModule.js';
import { getValue as getExternalStat } from './modules/yourModule.js';
import { getValue as getRichQuick } from './modules/theirModule.js';
```

### Importing Everything with `*`

Create module objects to avoid renaming conflicts:

```javascript
import * as MyModule from './modules/myModule.js';
import * as YourModule from './modules/yourModule.js';
import * as TheirModule from './modules/theirModule.js';

const parsedArgData = MyModule.getValue(a);
const someExternalStat = YourModule.getValue();
const lotsOfMoney = TheirModule.getValue();
```

---

## Default Exports

A **default export** provides quick access to a single item within a module. There can only be **one default export per module**:

```javascript
// Within the module:
export default function() {
  // do some magic
}

// Within a file using the module:
import magic from './modules/magicModule.js';

magic();
```

> 📌 Notice: Default exports can be **named anything** in the import statement, and do **not** need to be named within the module file.

---

## Summary

| Export Type | Syntax | Import Syntax |
|-------------|--------|---------------|
| Named export | `export const x = ...` | `import { x } from '...'` |
| Named export (grouped) | `export { x, y, z }` | `import { x, y } from '...'` |
| Renamed import | — | `import { x as myX } from '...'` |
| Wildcard import | — | `import * as Mod from '...'` |
| Default export | `export default function() {...}` | `import anything from '...'` |

---

## Further Learning

Becoming familiar with modules and imports will be necessary throughout your development journey, especially as you are introduced to external packages and libraries. To do further research, begin with the [MDN documentation on Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

---

*Copyright © Per Scholas 2026*

