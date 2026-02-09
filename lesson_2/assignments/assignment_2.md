# GLAB 308A.2.1 — An Object-Oriented Adventure

> **Version 1.0** · 10/13/23

---

## Introduction

This guided activity walks you through the process of creating a simple adventuring game using object-oriented programming principles. We will begin with basic concepts and the structure of the game, and then refine that structure with classes and other programming patterns.

## Objectives

- Use nested arrays and objects.
- Combine objects, arrays, and functions.
- Create a class to define the blueprint for creating objects.
- Add methods to a class.
- Set properties on an instance of a class.
- Make an instance of each class customizable.
- Create methods to alter the properties of an instance.
- Develop a class that inherits attributes from a "parent" class.
- Create static properties for a class.
- Create a "factory."

## Submission

Submit your completed lab using the **Start Assignment** button on the assignment page in Canvas.

**Your submission should include:**

- A GitHub link to your completed project repository.

---

## Instructions

Initialize a new git repository in a local project folder and create a JavaScript file to contain your code. Follow along with the steps below to create the adventure game. **Feel free to take creative liberty with your own game!**

> 💡 **Commit frequently!** Every time something works, you should commit it. Remember, you can always go back to a previous commit if something breaks.

---

## Part 1: Humble Beginnings

Let's model a simple adventurer with basic properties such as health and an inventory. We will call the adventurer **"Robin."**

```javascript
const adventurer = {
  name: "Robin",
  health: 10,
  inventory: ["sword", "potion", "artifact"]
};
```

From the adventurer object, we can access Robin's inventory using a combination of dot notation and square bracket syntax. For example, we could find a sword at `adventurer.inventory[0]`.

> 🧪 **Practice exercise:** Create a loop that logs each item in Robin's inventory.

### Adding a Companion

Nested arrays are useful, but so are **nested objects**. Let's give Robin a companion — a furry friend they call **"Leo."**

```javascript
const adventurer = {
  name: "Robin",
  health: 10,
  inventory: ["sword", "potion", "artifact"],
  companion: {
    name: "Leo",
    type: "Cat"
  }
};
```

**Next**, give Robin's feline friend a friend of his own:

- Add a `companion` sub-object to "Leo" with the following properties:
  - The companion's name is **"Frank."**
  - The companion's type is **"Flea."**
  - The companion has its own belongings, which include a **small hat** and **sunglasses**.

### Adding a Method

Give Robin a dice-roll method:

```javascript
const adventurer = {
  name: "Robin",
  health: 10,
  inventory: ["sword", "potion", "artifact"],
  companion: { /* ... */ },
  roll(mod = 0) {
    const result = Math.floor(Math.random() * 20) + 1 + mod;
    console.log(`${this.name} rolled a ${result}.`);
  }
};
```

Test this method by calling `adventurer.roll()` a few times.

> What if we had **many** adventurers? Creating them manually would be time-consuming, inefficient, and error-prone. Next, we'll level up our approach using **Classes**.

---

## Part 2: Class Fantasy

Start with a `Character` class that defines generic character entities:

```javascript
class Character {
  constructor(name) {
    this.name = name;
    this.health = 100;
    this.inventory = [];
  }
}
```

Every character should also be able to make rolls. **Add the `roll` method** to the Character class.

Now, re-create Robin using the Character class:

```javascript
const robin = new Character("Robin");
robin.inventory = ["sword", "potion", "artifact"];
robin.companion = new Character("Leo");
robin.companion.type = "Cat";
robin.companion.companion = new Character("Frank");
robin.companion.companion.type = "Flea";
robin.companion.companion.inventory = ["small hat", "sunglasses"];
```

Even the companions can roll now — **give it a try!**

---

## Part 3: Class Features

Let's create an `Adventurer` class that extends `Character`:

```javascript
class Adventurer extends Character {
  constructor(name, role) {
    super(name);
    this.role = role;
    this.inventory.push("bedroll", "50 gold coins");
  }

  scout() {
    console.log(`${this.name} is scouting ahead...`);
    super.roll();
  }
}
```

**Tasks:**
- What else should an adventurer be able to do? What other properties should they have?
- Create a `Companion` class with properties and methods specific to companions.
- Change the declaration of Robin and the companions to use the new classes.

---

## Part 4: Class Uniforms

Using the `static` keyword:

1. Add a static `MAX_HEALTH` property to the `Character` class, equal to `100`.
2. Add a static `ROLES` array to the `Adventurer` class, with values `"Fighter"`, `"Healer"`, and `"Wizard"`.
3. Add a check to the `Adventurer` constructor that ensures the given role matches one of these values.

---

## Part 5: Gather Your Party

Create a **factory** for generating adventurers:

```javascript
class AdventurerFactory {
  constructor(role) {
    this.role = role;
    this.adventurers = [];
  }

  generate(name) {
    const newAdventurer = new Adventurer(name, this.role);
    this.adventurers.push(newAdventurer);
  }

  findByIndex(index) {
    return this.adventurers[index];
  }

  findByName(name) {
    return this.adventurers.find((a) => a.name === name);
  }
}

const healers = new AdventurerFactory("Healer");
const robin = healers.generate("Robin");
```

---

## Part 6: Developing Skills

Create a `duel()` method for the `Adventurer` class:

1. Accept an `Adventurer` as a parameter.
2. Use `roll()` to create opposing rolls for each adventurer.
3. Subtract 1 from the adventurer with the lower roll.
4. Log the results of each "round" (rolls and current health values).
5. Repeat until one adventurer reaches **50 health**.
6. Log the winner.

**What other methods could these classes have?** Should fighters, healers, and wizards have their own methods? Should companions have specific methods? Be creative!

---

## Part 7: Adventure Forth

Generate a whole host of adventurers and companions, and have them interact using the methods you've developed.

**If time allows,** create other classes:
- Dragons, orcs, elves, vampires...
- Inventory classes with add, remove, search, sell, trade methods
- Individual item classes with type-specific properties and methods

> While this activity is intended to be light-hearted, every tool you've used is **extremely common and relevant** in every variety of development — from game development to data processing to complex enterprise applications.

---

*Copyright © Per Scholas 2026*
