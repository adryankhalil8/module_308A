// ============================================================
// 308A.2 — Exercises: Classes & OOP
// ============================================================
// These exercises build progressively toward the skills needed
// for GLAB 308A.2.1 and the SBA capstone.
//
// Instructions:
//   - Complete each TODO section.
//   - Run this file with Node.js:  node exercise.js
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Object Literals Review
// ------------------------------------------------------------
// Goal: Refresh object syntax before introducing classes.

const book = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  pages: 180,
  isRead: false,
  markAsRead() {
    this.isRead = true;
    console.log(`${this.title} has been marked as read.`);
  },
};

// TODO 1: Log the book's title and author.


// TODO 2: Call markAsRead() and verify isRead is now true.


// TODO 3: Add a summary() method that returns
//         "The Great Gatsby by F. Scott Fitzgerald, 180 pages"



// ------------------------------------------------------------
// Exercise 2: The `this` Keyword
// ------------------------------------------------------------
// Goal: Understand how `this` references the owning object.

const dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  tricks: ["sit", "shake", "roll over"],
  showTricks() {
    console.log(`${this.name} can do: ${this.tricks.join(", ")}`);
  },
};

// TODO 1: Call dog.showTricks().


// TODO 2: Create a standalone function greet() that uses this.name.


// TODO 3: Assign greet to dog.greet and call it — does it work?


// TODO 4: Call greet() alone — what happens and why?
//         Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 3: Your First Class
// ------------------------------------------------------------
// Goal: Define and instantiate a basic class.

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

// TODO 1: Create 3 different pets using the Pet class.


// TODO 2: Feed one of them and verify isHungry changed.


// TODO 3: Add a describe() method to Pet that logs
//         "Buddy is a Dog" (using the instance's name and species).


// ------------------------------------------------------------
// Exercise 4: Constructor Practice
// ------------------------------------------------------------
// Goal: Practice passing different arguments to constructors.

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

// TODO 1: Create a 5×10 rectangle and log its area and perimeter.


// TODO 2: Create a 7×7 rectangle and verify isSquare() returns true.


// TODO 3: Add a describe() method that returns
//         "Rectangle: 5×10, Area: 50"


// ------------------------------------------------------------
// Exercise 5: Inheritance Basics
// ------------------------------------------------------------
// Goal: Use extends and super for the first time.

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

// TODO 1: Create a Car class that extends Vehicle and adds numDoors.

// TODO 2: Create a Motorcycle class that extends Vehicle and adds hasSidecar.

// TODO 3: Instantiate one of each and test all methods.

// TODO 4: Add a honk() method to Car that logs "Beep beep!".


// ------------------------------------------------------------
// Exercise 6: Method Overriding
// ------------------------------------------------------------
// Goal: Override parent methods in child classes.

// TODO: Using your Vehicle classes from Exercise 5:
// 1. Override start() in Motorcycle to log "Vroom vroom!" instead.
// 2. Use super.start() inside the override so isRunning still
//    gets set to true.
// 3. Verify that Car.start() still behaves normally.


// ------------------------------------------------------------
// Exercise 7: Private Fields & Getters/Setters
// ------------------------------------------------------------
// Goal: Practice encapsulation with # fields.

class BankAccount {
  // TODO: Add private fields #balance and #owner

  constructor(owner, initialDeposit = 0) {
    // TODO: Set #owner and #balance
  }

  // TODO: Add a getter for balance that returns "$X.XX" format

  // TODO: Add a getter for owner

  deposit(amount) {
    // TODO: If amount > 0, add to #balance and log the new balance
  }

  withdraw(amount) {
    // TODO: If amount > 0 AND amount <= #balance, subtract and log
    //       Otherwise, log "Insufficient funds!"
  }
}

// TODO 1: Create an account with $100 initial deposit.

// TODO 2: Deposit $50 and withdraw $30.

// TODO 3: Try to access #balance directly — what happens?

// TODO 4: Try to withdraw more than the balance — what happens?


// ------------------------------------------------------------
// Exercise 8: Static Methods
// ------------------------------------------------------------
// Goal: Create and use static class members.

class MathHelper {
  // TODO: Add a static method celsiusToFahrenheit(c)
  //       Formula: (c * 9/5) + 32

  // TODO: Add a static method fahrenheitToCelsius(f)
  //       Formula: (f - 32) * 5/9

  // TODO: Add a static method randomBetween(min, max)
  //       Returns a random integer between min and max (inclusive)
}

// TODO 1: Convert 100°C to Fahrenheit (no `new`!).

// TODO 2: Generate 5 random numbers between 1 and 100.

// TODO 3: Add a static method isPrime(n) that returns true/false.


// ------------------------------------------------------------
// Exercise 9: Factory Functions
// ------------------------------------------------------------
// Goal: Create objects with factory functions instead of classes.

function createPlayer(name, level = 1) {
  let health = level * 100;
  let xp = 0;

  return {
    name,
    level,
    // TODO: Add getHealth() that returns health

    // TODO: Add getXP() that returns xp

    // TODO: Add gainXP(amount) that adds to xp and logs it

    // TODO: Add takeDamage(amount) that subtracts from health and logs it
  };
}

// TODO 1: Create two players.

// TODO 2: Have one take damage and the other gain XP.

// TODO 3: Try to directly set health — can you? Why or why not?
//         Write your answer as a comment.

// TODO 4: How is this different from a class with private fields?
//         Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 10: Prototype Exploration
// ------------------------------------------------------------
// Goal: Understand the prototype chain.

class Shape {}
class Circle extends Shape {}

const c = new Circle();

// TODO 1: Log Object.getPrototypeOf(c) — what do you see?

// TODO 2: Log the results of these three checks:
//   c instanceof Circle
//   c instanceof Shape
//   c instanceof Object

// TODO 3: Add a method to Shape.prototype after creating c.
//         Can c access it? Why does this work?
//         Write your answer as a comment.


// ------------------------------------------------------------
// Exercise 11: Putting It All Together — Mini RPG
// ------------------------------------------------------------
// Goal: Combine all concepts. Prepares for GLAB 308A.2.1.

// TODO 1: Create a Character class with:
//   - name, health (100, private), attack, defense
//   - takeDamage(amount) method (reduce health, factor in defense)
//   - static MAX_HEALTH = 100

// TODO 2: Create a Warrior class (extends Character):
//   - Extra property: armor
//   - Method: slash() — returns attack damage

// TODO 3: Create a Mage class (extends Character):
//   - Extra property: mana
//   - Method: castSpell() — returns magic damage, costs mana

// TODO 4: Create a battle(char1, char2) function:
//   - Characters take turns attacking until one reaches 0 health
//   - Log each attack and remaining health
//   - Declare the winner


// ============================================================
// 🎯 Checkpoint: Ready for the Assignment?
// ============================================================
// Before starting GLAB 308A.2.1, make sure you can:
//   [ ] Define a class with a constructor
//   [ ] Instantiate objects with new
//   [ ] Use extends and super for inheritance
//   [ ] Create private fields with #
//   [ ] Write getters and setters
//   [ ] Create static methods
//   [ ] Explain inheritance, encapsulation, abstraction, polymorphism
