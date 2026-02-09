# 308A.2 — Bite-Size Exercises: Classes & OOP

> These exercises build progressively toward the skills needed for **GLAB 308A.2.1** and the **SBA capstone**.

---

## Exercise 1: Object Literals Review

**Goal:** Refresh object syntax before introducing classes.

Create an object representing a book:

```javascript
const book = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  pages: 180,
  isRead: false,
  markAsRead() {
    this.isRead = true;
    console.log(`${this.title} has been marked as read.`);
  }
};
```

**Tasks:**
1. Log the book's title and author.
2. Call `markAsRead()` and verify `isRead` is now `true`.
3. Add a method `summary()` that returns `"The Great Gatsby by F. Scott Fitzgerald, 180 pages"`.

---

## Exercise 2: The `this` Keyword

**Goal:** Understand how `this` references the owning object.

```javascript
const dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  tricks: ["sit", "shake", "roll over"],
  showTricks() {
    console.log(`${this.name} can do: ${this.tricks.join(", ")}`);
  }
};
```

**Tasks:**
1. Call `dog.showTricks()`.
2. Create a standalone function `greet()` that uses `this.name`.
3. Assign `greet` to `dog.greet` and call it — does it work?
4. Call `greet()` alone — what happens and why?

---

## Exercise 3: Your First Class

**Goal:** Define and instantiate a basic class.

```javascript
class Pet {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.isHungry = true;
  }

  feed() {
    this.isHungry = false;
    console.log(`${this.name} has been fed!`);
  }
}
```

**Tasks:**
1. Create 3 different pets using the `Pet` class.
2. Feed one of them and verify `isHungry` changed.
3. Add a method `describe()` that logs `"Buddy is a Dog"`.

---

## Exercise 4: Constructor Practice

**Goal:** Practice passing different arguments to constructors.

Create a `Rectangle` class:

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }

  perimeter() {
    return 2 * (this.width + this.height);
  }

  isSquare() {
    return this.width === this.height;
  }
}
```

**Tasks:**
1. Create a 5×10 rectangle and log its area and perimeter.
2. Create a 7×7 rectangle and verify `isSquare()` returns `true`.
3. Add a `describe()` method that returns `"Rectangle: 5×10, Area: 50"`.

---

## Exercise 5: Inheritance Basics

**Goal:** Use `extends` and `super` for the first time.

```javascript
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    console.log(`${this.make} ${this.model} started!`);
  }

  stop() {
    this.isRunning = false;
    console.log(`${this.make} ${this.model} stopped.`);
  }
}
```

**Tasks:**
1. Create a `Car` class that extends `Vehicle` and adds `numDoors`.
2. Create a `Motorcycle` class that extends `Vehicle` and adds `hasSidecar`.
3. Instantiate one of each and test all methods.
4. Add a `honk()` method to `Car` that logs `"Beep beep!"`.

---

## Exercise 6: Method Overriding

**Goal:** Override parent methods in child classes.

Using your `Vehicle` classes from Exercise 5:

1. Override `start()` in `Motorcycle` to log `"Vroom vroom!"` instead.
2. Use `super.start()` inside the override so `isRunning` still gets set to `true`.
3. Verify that `Car.start()` still behaves normally.

---

## Exercise 7: Private Fields & Getters/Setters

**Goal:** Practice encapsulation with `#` fields.

```javascript
class BankAccount {
  #balance = 0;
  #owner;

  constructor(owner, initialDeposit = 0) {
    this.#owner = owner;
    this.#balance = initialDeposit;
  }

  get balance() {
    return `$${this.#balance.toFixed(2)}`;
  }

  get owner() {
    return this.#owner;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      console.log(`Deposited $${amount}. New balance: ${this.balance}`);
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      console.log(`Withdrew $${amount}. New balance: ${this.balance}`);
    } else {
      console.log("Insufficient funds!");
    }
  }
}
```

**Tasks:**
1. Create an account with $100 initial deposit.
2. Deposit $50 and withdraw $30.
3. Try to access `#balance` directly — what happens?
4. Try to withdraw more than the balance — what happens?

---

## Exercise 8: Static Methods

**Goal:** Create and use static class members.

```javascript
class MathHelper {
  static celsiusToFahrenheit(c) {
    return (c * 9/5) + 32;
  }

  static fahrenheitToCelsius(f) {
    return (f - 32) * 5/9;
  }

  static randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
```

**Tasks:**
1. Convert 100°C to Fahrenheit using the static method (no `new`!).
2. Generate 5 random numbers between 1 and 100.
3. Add a static method `isPrime(n)` that checks if a number is prime.

---

## Exercise 9: Factory Functions

**Goal:** Create objects with factory functions instead of classes.

```javascript
function createPlayer(name, level = 1) {
  let health = level * 100;
  let xp = 0;

  return {
    name,
    level,
    getHealth() { return health; },
    getXP() { return xp; },
    gainXP(amount) {
      xp += amount;
      console.log(`${name} gained ${amount} XP! Total: ${xp}`);
    },
    takeDamage(amount) {
      health -= amount;
      console.log(`${name} took ${amount} damage! Health: ${health}`);
    }
  };
}
```

**Tasks:**
1. Create two players.
2. Have one take damage and the other gain XP.
3. Try to directly set `health` — can you? Why or why not?
4. Compare: how is this different from a class with private fields?

---

## Exercise 10: Prototype Exploration

**Goal:** Understand the prototype chain.

```javascript
class Shape {}
class Circle extends Shape {}

const c = new Circle();
```

**Tasks:**
1. Log `Object.getPrototypeOf(c)` — what do you see?
2. Log `c instanceof Circle`, `c instanceof Shape`, `c instanceof Object`.
3. Add a method to `Shape.prototype` after creating `c`. Can `c` access it?
4. Why does this work?

---

## Exercise 11: Putting It All Together — Mini RPG

**Goal:** Combine all concepts. This directly prepares for **GLAB 308A.2.1**.

Build a mini RPG system:

1. Create a `Character` class with `name`, `health` (100), `attack`, `defense`.
2. Add a `takeDamage(amount)` method that reduces health (factoring in defense).
3. Create `Warrior` and `Mage` child classes:
   - `Warrior` has extra `armor` and a `slash()` attack.
   - `Mage` has `mana` and a `castSpell()` attack.
4. Make `health` private with a getter.
5. Add a static `MAX_HEALTH = 100` to `Character`.
6. Create a `battle(char1, char2)` function that has them take turns attacking until one reaches 0 health.

---

## 🎯 Checkpoint: Ready for the Assignment?

Before starting **GLAB 308A.2.1**, make sure you can:

- [ ] Define a class with a constructor
- [ ] Instantiate objects with `new`
- [ ] Use `extends` and `super` for inheritance
- [ ] Create private fields with `#`
- [ ] Write getters and setters
- [ ] Create static methods
- [ ] Explain inheritance, encapsulation, abstraction, and polymorphism

---

*These exercises prepare you for GLAB 308A.2.1, ALAB 308A.2.x, and the SBA 308A capstone project.*
