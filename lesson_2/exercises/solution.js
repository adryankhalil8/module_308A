// ============================================================
// 308A.2 — SOLUTIONS: Classes & OOP
// ============================================================


// ------------------------------------------------------------
// Exercise 1: Object Literals Review
// ------------------------------------------------------------

const book = {
  title: "The Great Gatsby",        // Property: string value
  author: "F. Scott Fitzgerald",     // Property: string value
  pages: 180,                         // Property: number value
  isRead: false,                      // Property: boolean value (mutable)
  markAsRead() {                      // Shorthand method syntax (same as markAsRead: function() {})
    this.isRead = true;               // `this` refers to the `book` object when called as book.markAsRead()
    console.log(`${this.title} has been marked as read.`);
  },
  summary() {
    return `${this.title} by ${this.author}, ${this.pages} pages`;
  },
};

// 1. Log the book's title and author
console.log(book.title);   // "The Great Gatsby"
console.log(book.author);  // "F. Scott Fitzgerald"

// 2. Call markAsRead() and verify isRead is now true
book.markAsRead();
console.log(book.isRead);  // true

// 3. summary() method
console.log(book.summary()); // "The Great Gatsby by F. Scott Fitzgerald, 180 pages"


// ------------------------------------------------------------
// Exercise 2: The `this` Keyword
// ------------------------------------------------------------

const dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  tricks: ["sit", "shake", "roll over"],
  showTricks() {
    // `this` refers to `dog` because showTricks is called as dog.showTricks()
    console.log(`${this.name} can do: ${this.tricks.join(", ")}`);
  },
};

// 1. Call dog.showTricks()
dog.showTricks(); // "Buddy can do: sit, shake, roll over"

// 2. Standalone function that uses this.name
function greet() {
  console.log(`Hi, my name is ${this.name}`); // `this` depends on HOW greet() is called
}

// 3. Assign to dog and call — it works because `this` now refers to dog
dog.greet = greet;   // Attach the function as a method on the dog object
dog.greet();         // "Hi, my name is Buddy" — called as dog.greet(), so this === dog

// 4. Call greet() alone
// greet(); // `this` is undefined (strict mode) or the global object.
// In Node.js, this.name is undefined. In a browser, it may reference
// window.name. This demonstrates that `this` depends on HOW a function
// is called, not WHERE it's defined.


// ------------------------------------------------------------
// Exercise 3: Your First Class
// ------------------------------------------------------------

class Pet {
  constructor(name, species) {    // constructor runs automatically when you call `new Pet(...)`
    this.name = name;             // `this` refers to the NEW object being created
    this.species = species;       // Assign each parameter as a property on the instance
    this.isHungry = true;         // Default value — every new Pet starts hungry
  }

  feed() {                        // Instance method — shared via Pet.prototype
    this.isHungry = false;        // Mutate the instance's own property
    console.log(`${this.name} has been fed!`);
  }

  describe() {
    console.log(`${this.name} is a ${this.species}`);
  }
}

// 1. Create 3 different pets
const pet1 = new Pet("Buddy", "Dog");
const pet2 = new Pet("Whiskers", "Cat");
const pet3 = new Pet("Nemo", "Fish");

// 2. Feed one and verify isHungry changed
pet1.feed();                  // "Buddy has been fed!"
console.log(pet1.isHungry);  // false
console.log(pet2.isHungry);  // true (unfed)

// 3. describe() method
pet1.describe(); // "Buddy is a Dog"
pet3.describe(); // "Nemo is a Fish"


// ------------------------------------------------------------
// Exercise 4: Constructor Practice
// ------------------------------------------------------------

class Rectangle {
  constructor(width, height) {
    this.width = width;                 // Store dimensions as instance properties
    this.height = height;
  }

  area() {
    return this.width * this.height;    // width × height = area
  }

  perimeter() {
    return 2 * (this.width + this.height); // 2 × (w + h) = perimeter
  }

  isSquare() {
    return this.width === this.height;  // A square is a rectangle with equal sides
  }

  describe() {
    return `Rectangle: ${this.width}×${this.height}, Area: ${this.area()}`;
    // Calls this.area() — methods can call other methods on the same instance
  }
}

// 1. 5×10 rectangle
const rect1 = new Rectangle(5, 10);
console.log(rect1.area());       // 50
console.log(rect1.perimeter());  // 30

// 2. 7×7 rectangle
const rect2 = new Rectangle(7, 7);
console.log(rect2.isSquare());   // true

// 3. describe() method
console.log(rect1.describe()); // "Rectangle: 5×10, Area: 50"


// ------------------------------------------------------------
// Exercise 5: Inheritance Basics
// ------------------------------------------------------------

class Vehicle {
  constructor(make, model, year) {
    this.make = make;               // Shared properties for all vehicles
    this.model = model;
    this.year = year;
    this.isRunning = false;         // Default state: engine off
  }

  start() {
    this.isRunning = true;          // Mutate state
    console.log(`${this.make} ${this.model} started!`);
  }

  stop() {
    this.isRunning = false;
    console.log(`${this.make} ${this.model} stopped.`);
  }
}

// 1. Car class with numDoors
class Car extends Vehicle {           // `extends` sets up the prototype chain: Car → Vehicle
  constructor(make, model, year, numDoors) {
    super(make, model, year);         // MUST call super() first — it runs Vehicle's constructor
                                      // to initialize make, model, year, and isRunning
    this.numDoors = numDoors;         // Then add Car-specific properties
  }

  honk() {                            // Car-specific method (not on Vehicle)
    console.log("Beep beep!");
  }
}

// 2. Motorcycle class with hasSidecar
class Motorcycle extends Vehicle {
  constructor(make, model, year, hasSidecar = false) { // Default parameter: no sidecar
    super(make, model, year);         // Initialize inherited properties via Vehicle constructor
    this.hasSidecar = hasSidecar;     // Motorcycle-specific property
  }
}

// 3. Instantiate and test
const myCar = new Car("Toyota", "Camry", 2023, 4);
myCar.start();  // "Toyota Camry started!"
myCar.honk();   // "Beep beep!"
myCar.stop();   // "Toyota Camry stopped."

const myBike = new Motorcycle("Harley", "Sportster", 2022, true);
myBike.start(); // "Harley Sportster started!"
myBike.stop();  // "Harley Sportster stopped."


// ------------------------------------------------------------
// Exercise 6: Method Overriding
// ------------------------------------------------------------

// Redefine Motorcycle with overridden start()
class MotorcycleV2 extends Vehicle {
  constructor(make, model, year, hasSidecar = false) {
    super(make, model, year);
    this.hasSidecar = hasSidecar;
  }

  start() {
    super.start();              // Call the PARENT's start() method first
                                // This sets isRunning = true and logs "... started!"
    console.log("Vroom vroom!"); // Then add Motorcycle-specific behavior
    // By using super.start() we EXTEND the parent behavior instead of
    // completely replacing it. Without super.start(), isRunning would
    // never be set to true.
  }
}

const bike2 = new MotorcycleV2("Ducati", "Monster", 2024);
bike2.start();
// Output:
//   "Ducati Monster started!"
//   "Vroom vroom!"
console.log(bike2.isRunning); // true

// Car.start() still behaves normally
const car2 = new Car("Honda", "Civic", 2023, 4);
car2.start(); // "Honda Civic started!" (no "Vroom vroom!")


// ------------------------------------------------------------
// Exercise 7: Private Fields & Getters/Setters
// ------------------------------------------------------------

class BankAccount {
  #balance = 0;                           // Private field — # makes it inaccessible outside this class
  #owner;                                 // Private field — declared here, assigned in constructor

  constructor(owner, initialDeposit = 0) {
    this.#owner = owner;                  // Set the private #owner field
    this.#balance = initialDeposit;       // Set the private #balance field
  }

  get balance() {                         // Getter — accessed like a property: account.balance
    return `$${this.#balance.toFixed(2)}`; // toFixed(2) formats to 2 decimal places
  }

  get owner() {                           // Getter for #owner — read-only access
    return this.#owner;
  }

  deposit(amount) {
    if (amount > 0) {                     // Guard: only accept positive amounts
      this.#balance += amount;            // Modify the private field directly from inside the class
      console.log(`Deposited $${amount}. New balance: ${this.balance}`);
      // ^ this.balance calls the GETTER, which formats the number
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) { // Guard: positive AND sufficient funds
      this.#balance -= amount;
      console.log(`Withdrew $${amount}. New balance: ${this.balance}`);
    } else {
      console.log("Insufficient funds!");
    }
  }
}

// 1. Create an account with $100
const account = new BankAccount("Alice", 100);
console.log(account.balance); // "$100.00"

// 2. Deposit $50, withdraw $30
account.deposit(50);   // "Deposited $50. New balance: $150.00"
account.withdraw(30);  // "Withdrew $30. New balance: $120.00"

// 3. Try to access #balance directly
// console.log(account.#balance); // SyntaxError: Private field '#balance'
//                                // must be declared in an enclosing class

// 4. Try to withdraw more than balance
account.withdraw(9999); // "Insufficient funds!"


// ------------------------------------------------------------
// Exercise 8: Static Methods
// ------------------------------------------------------------

class MathHelper {
  static celsiusToFahrenheit(c) {              // `static` — called on the CLASS, not on instances
    return (c * 9 / 5) + 32;                   // Formula: F = (C × 9/5) + 32
  }

  static fahrenheitToCelsius(f) {
    return (f - 32) * 5 / 9;                   // Formula: C = (F - 32) × 5/9
  }

  static randomBetween(min, max) {
    // Math.random() returns [0, 1) — multiply by range + 1, floor it, add min
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static isPrime(n) {
    if (n < 2) return false;                   // 0 and 1 are not prime
    for (let i = 2; i <= Math.sqrt(n); i++) {  // Only need to check up to √n
      // If any number evenly divides n, it's not prime
      if (n % i === 0) return false;           // n % i === 0 means i is a divisor of n
    }
    return true;                               // No divisors found — n is prime
  }
}

// 1. Convert 100°C to Fahrenheit
console.log(MathHelper.celsiusToFahrenheit(100)); // 212

// 2. Generate 5 random numbers between 1 and 100
for (let i = 0; i < 5; i++) {
  console.log(MathHelper.randomBetween(1, 100));
}

// 3. isPrime
console.log(MathHelper.isPrime(7));   // true
console.log(MathHelper.isPrime(10));  // false
console.log(MathHelper.isPrime(97));  // true


// ------------------------------------------------------------
// Exercise 9: Factory Functions
// ------------------------------------------------------------

function createPlayer(name, level = 1) {
  let health = level * 100;             // Local variable — NOT a property on the returned object
  let xp = 0;                           // Also local — only accessible via the closures below

  return {                               // Return a new object with methods that "close over"
                                         // the local variables health and xp
    name,                                // Shorthand property: same as name: name
    level,
    getHealth() { return health; },      // Closure: reads the local `health` variable
    getXP() { return xp; },             // Closure: reads the local `xp` variable
    gainXP(amount) {
      xp += amount;                      // Modifies the closed-over `xp` variable
      console.log(`${name} gained ${amount} XP! Total: ${xp}`);
    },
    takeDamage(amount) {
      health -= amount;                  // Modifies the closed-over `health` variable
      console.log(`${name} took ${amount} damage! Health: ${health}`);
    },
  };
}

// 1. Create two players
const player1 = createPlayer("Alice", 2);
const player2 = createPlayer("Bob");

// 2. Have one take damage and the other gain XP
player1.takeDamage(30);  // "Alice took 30 damage! Health: 170"
player2.gainXP(50);      // "Bob gained 50 XP! Total: 50"

// 3. Try to directly set health
// player1.health = 9999;
// This creates a NEW property on the returned object, but does NOT
// affect the `health` closure variable. getHealth() still returns 170.
// console.log(player1.getHealth()); // 170 (unchanged!)

// 4. Difference from class with private fields:
// Factory functions use closures to create truly private variables.
// Classes use #private fields which are syntactically enforced.
// Both achieve encapsulation, but factory functions create new copies
// of every method per instance (more memory), while class methods
// are shared via the prototype (more efficient).


// ------------------------------------------------------------
// Exercise 10: Prototype Exploration
// ------------------------------------------------------------

class Shape {}                          // Empty base class
class Circle extends Shape {}           // Circle inherits from Shape

const circ = new Circle();              // Create an instance of Circle

// 1. Log the prototype
console.log(Object.getPrototypeOf(circ)); // Returns Circle.prototype (which is a Shape)
// Object.getPrototypeOf() shows the next link in the prototype chain

// 2. instanceof checks
console.log(circ instanceof Circle); // true  — Circle.prototype is in circ's chain
console.log(circ instanceof Shape);  // true  — Shape.prototype is ALSO in the chain
console.log(circ instanceof Object); // true  — Object.prototype is at the top of every chain
// instanceof walks UP the prototype chain: circ → Circle.prototype → Shape.prototype → Object.prototype

// 3. Add a method to Shape.prototype AFTER creating circ
Shape.prototype.describe = function () {
  return `I am a ${this.constructor.name}`;
  // this.constructor.name returns the name of the class that created this instance
};

console.log(circ.describe()); // "I am a Circle"
// This works because JavaScript looks up the prototype chain at
// call time, not at creation time. When we call circ.describe(),
// JS doesn't find it on circ, looks at Circle.prototype, doesn't
// find it there, then looks at Shape.prototype and finds it.


// ------------------------------------------------------------
// Exercise 11: Putting It All Together — Mini RPG
// ------------------------------------------------------------

class Character {
  static MAX_HEALTH = 100;              // Static property: shared by ALL instances, accessed as Character.MAX_HEALTH
  #health;                              // Private field: only accessible inside this class

  constructor(name, attack, defense) {
    this.name = name;                   // Public property: accessible everywhere
    this.attack = attack;
    this.defense = defense;
    this.#health = Character.MAX_HEALTH; // Initialize from the static property
  }

  get health() {                        // Getter: allows reading #health as character.health
    return this.#health;
  }

  takeDamage(amount) {
    // Calculate actual damage after defense is subtracted
    const actualDamage = Math.max(0, amount - this.defense); // Math.max(0, ...) ensures damage is never negative
    this.#health = Math.max(0, this.#health - actualDamage); // Health can't go below 0
    console.log(
      `${this.name} takes ${actualDamage} damage! (${amount} - ${this.defense} defense) HP: ${this.#health}`
    );
  }

  isAlive() {
    return this.#health > 0;            // Returns true if the character still has HP
  }
}

class Warrior extends Character {
  constructor(name, attack, defense, armor) {
    super(name, attack, defense + armor); // Armor is added to defense — passed to Character's constructor
    this.armor = armor;                   // Store armor separately for reference
  }

  slash() {
    // Base attack + random bonus (0–4)
    const damage = this.attack + Math.floor(Math.random() * 5);
    console.log(`⚔️  ${this.name} slashes for ${damage} damage!`);
    return damage;                        // Return the damage so battle() can apply it
  }
}

class Mage extends Character {
  constructor(name, attack, defense, mana) {
    super(name, attack, defense);         // Call Character's constructor (no armor bonus)
    this.mana = mana;                     // Mage-specific resource
  }

  castSpell() {
    if (this.mana >= 10) {                // Spells cost 10 mana
      this.mana -= 10;                    // Deduct mana
      // Spell damage = double attack + random bonus (0–7)
      const damage = this.attack * 2 + Math.floor(Math.random() * 8);
      console.log(`🔮 ${this.name} casts a spell for ${damage} damage! (Mana: ${this.mana})`);
      return damage;
    } else {
      // Out of mana — fall back to a basic attack
      console.log(`${this.name} is out of mana! Basic attack for ${this.attack} damage.`);
      return this.attack;
    }
  }
}

function battle(char1, char2) {
  console.log(`\n⚔️  BATTLE: ${char1.name} vs ${char2.name} ⚔️\n`);
  let turn = 1;

  while (char1.isAlive() && char2.isAlive()) { // Loop until someone's HP reaches 0
    console.log(`--- Turn ${turn} ---`);

    // char1 attacks char2
    let damage;
    if (char1 instanceof Warrior) damage = char1.slash();         // Use Warrior's special attack
    else if (char1 instanceof Mage) damage = char1.castSpell();   // Use Mage's special attack
    else damage = char1.attack;                                    // Fallback: use base attack value
    char2.takeDamage(damage);                                      // Apply damage to char2 (defense is calculated inside)

    if (!char2.isAlive()) {               // Check if char2 was knocked out
      console.log(`\n🏆 ${char1.name} wins!\n`);
      return char1;                       // Return the winner
    }

    // char2 attacks char1 (same logic)
    if (char2 instanceof Warrior) damage = char2.slash();
    else if (char2 instanceof Mage) damage = char2.castSpell();
    else damage = char2.attack;
    char1.takeDamage(damage);

    if (!char1.isAlive()) {
      console.log(`\n🏆 ${char2.name} wins!\n`);
      return char2;
    }

    turn++;                               // Both survived — move to next turn
  }
}

// Test battle
const warrior = new Warrior("Thorin", 15, 5, 3);
const mage = new Mage("Gandalf", 12, 2, 50);
battle(warrior, mage);
