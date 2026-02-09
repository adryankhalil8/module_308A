# 308A.2 — Classes and Object-Oriented Programming

> **React Developer Curriculum** · Lesson 2 of 5

---

## Learning Objectives

By the end of this lesson, learners should be able to:

- Describe the use case for classes.
- Define and instantiate a class.
- Include and use a constructor method within a class.
- Recognize constructor functions (the predecessor to classes).
- Describe inheritance, encapsulation, abstraction, and polymorphism.
- Demonstrate the use of inheritance, encapsulation, abstraction, and polymorphism in JavaScript.
- Define static class methods and properties.
- Define object prototypes.
- Assign and manipulate object prototypes.
- Create factory functions for objects.

---

## Lesson Setup

For this lesson, we're going to code along using a **Vanilla CodeSandbox** — you can name it *"JavaScript Classes Practice"*.

> 📦 **CodeSandbox**
> If you are unfamiliar with CodeSandbox, or need a refresher, please visit our reference page on CodeSandbox for instructions on creating an account, making a sandbox, navigating your sandbox, and submitting a link to Canvas.

---

## Object-Oriented Programming

We have already touched on some Object-Oriented Programming (OOP) concepts, but in this lesson we will dive into the details of the **four key principles of OOP:**

1. **Inheritance**
2. **Encapsulation**
3. **Abstraction**
4. **Polymorphism**

Object-oriented programming as a paradigm is useful on large-scale projects because it helps modularize code and improve organization. The core idea behind OOP is to separate concerns and responsibilities into individual object entities, much like functions separate reusable actions into specific entities.

---

## The `this` Keyword and Object Methods

In order to work with objects and classes, you need to understand the `this` keyword.

`this` behaves differently in different contexts, and we are only going to examine it in a function or constructor context during this lesson. For further learning on how the `this` keyword behaves in other situations, read through the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).

Within a function, the value of `this` depends on how the function is called. Typically, the value of `this` is the object that the function is accessed on. For example, if you call `obj.functionCall()`, the value of `this` within the body of `functionCall()` is `obj`.

When we attach functions to objects (creating methods), we can use `this` to easily reference the other properties or methods within that specific object.

```javascript
const person = {
  name: {
    first: 'Elyan',
    last: 'Kemble',
  },
  age: 32,
  location: {
    city: 'Garland',
    state: 'Texas',
    zip: 75040
  },
  occupation: 'Front-End Developer'
}

function introduce() {
  console.log(`Hello, my name is ${this.name.first} ${this.name.last}, and I'm a ${this.age}-year-old ${this.occupation} from ${this.location.city}, ${this.location.state}!`);
}
```

If we were to simply call `introduce()` at this point, we would get: `"Hello, my name is undefined undefined, and I'm a undefined-year-old undefined from undefined, undefined!"` — we first need to set our function as a method of the person object:

```javascript
person.introduce = introduce;
person.introduce();
// "Hello, my name is Elyan Kemble, and I'm a 32-year-old Front-End Developer from Garland, Texas!"
```

We could also include the function within our original object as a method:

```javascript
const person = {
  name: {
    first: 'Elyan',
    last: 'Kemble',
  },
  age: 32,
  location: {
    city: 'Garland',
    state: 'Texas',
    zip: 75040
  },
  occupation: 'Front-End Developer',
  introduce() {
    console.log(`Hello, my name is ${this.name.first} ${this.name.last}, and I'm a ${this.age}-year-old ${this.occupation} from ${this.location.city}, ${this.location.state}!`);
  }
}

person.introduce();
```

This allows us to skip a step, but what if we had multiple person objects? Either we include `introduce()` in every object, or we assign it individually after creation. Neither approach is efficient — **which is why we need classes.**

---

## Classes

In OOP, we use objects to model our application's purpose. Just like functions help us create reusable actions, **classes help us create reusable objects.**

Classes (as well as their predecessor, constructor functions) are used to create objects. Think of classes as the **blueprints** used to create objects of a certain "type."

### Why We Need Classes

- The number of a certain type of object needed by an application often varies at runtime.
- Classes/constructors provide a convenient way to dynamically create objects as needed.

Consider this repetitive code:

```javascript
const cat1 = {
  eyes: 2,
  legs: 4,
  fur: "Orange",
  isAwake: true,
  isMoving: false,
  sleep() { this.isAwake = false; },
  wake() { this.isAwake = true; },
  sit() { this.isMoving = false; },
  walk() { this.isMoving = true; },
  speak() { console.log("Meow..."); }
}

const cat2 = {
  eyes: 2,
  legs: 4,
  fur: "Black and White",
  isAwake: false,
  isMoving: false,
  sleep() { this.isAwake = false; },
  wake() { this.isAwake = true; },
  sit() { this.isMoving = false; },
  walk() { this.isMoving = true; },
  speak() { console.log("Meow..."); }
}

// ... imagine doing this for dog1, cow1, and an entire farm!
```

This could easily get out of hand. **Classes save the day** by capturing all the shared characteristics.

---

### Defining Classes in JavaScript

Here's a minimal class definition:

```javascript
class Animal {
  // Code to define the class's properties and methods
}
```

> ❓ What's different compared to a function?
> ❓ What's different about the naming convention?

### Instantiating a Class

OOP vocabulary:
- **instance:** An object created by a class.
- **instantiate:** We instantiate a class to create an object.
- **instantiation:** The process of creating an object.

```javascript
const v1 = new Animal();
```

### The Constructor Method

When a class is instantiated, the special `constructor` method is called automatically:

```javascript
class Animal {
  constructor(eyes, legs, isAwake, isMoving) {
    this.eyes = eyes;
    this.legs = legs;
    this.isAwake = isAwake;
    this.isMoving = isMoving;
    // return is not needed — the new object is returned by default
  }
}

const cat1 = new Animal(2, 4, true, false);
```

### Object Instantiation — Behind the Scenes

When we invoke the class with `new`:

1. JS creates a new empty object and assigns it to `this`.
2. The `constructor` method runs with the arguments we provided.
3. After the constructor finishes, the class automatically returns the new object.

---

### Defining Methods in a Class

Two types of methods can be added to a class:

| Type | Description | Example |
|------|-------------|---------|
| **Prototype (instance) methods** | Available to any instance of the class | `Array.prototype.forEach()` |
| **Static (class) methods** | Called on the class itself, not instances | `Math.random()` |

Let's add methods to our `Animal` class:

```javascript
class Animal {
  constructor(eyes, legs, isAwake, isMoving) {
    this.eyes = eyes;
    this.legs = legs;
    this.isAwake = isAwake;
    this.isMoving = isMoving;
  }
  sleep() { this.isAwake = false; }
  wake() { this.isAwake = true; }
  sit() { this.isMoving = false; }
  walk() { this.isMoving = true; }
  speak(sound) { console.log(sound); }
}
```

> **Note:** Unlike within object literals, methods are **not** separated by a comma.

Now we can create all our animals with four lines:

```javascript
const cat1 = new Animal(2, 4, true, false);
const cat2 = new Animal(2, 4, false, false);
const dog1 = new Animal(2, 4, true, true);
const cow1 = new Animal(2, 4, true, false);
```

---

## Inheritance

**Inheritance** is the ability to create classes based on other classes. A **parent class** has certain properties and methods, and **child classes** inherit all of them — then add their own specific ones or override the parent's.

Two key keywords:
- **`extends`** — declares what parent a child inherits from
- **`super`** — accesses properties and methods of the parent

> ⚠️ JavaScript's inheritance implementation is **prototype-based**, which differs from class-based languages like Java or Python. We'll discuss prototypes later.

### Overriding Methods

In JS, virtually every object inherits from `Object` and its methods, such as `toString`:

```javascript
cat1.toString(); // '[object Object]'
```

We can **override** it by defining our own `toString`:

```javascript
toString() {
  return `This Animal has ${this.eyes} eyes and ${this.legs} legs. It ${this.isAwake ? 'is' : 'is not'} awake, and ${this.isMoving ? 'is' : 'is not'} moving.`;
}
```

### Creating Child Classes

```javascript
class Animal {
  constructor(eyes, legs, isAwake, isMoving) {
    this.eyes = eyes;
    this.legs = legs;
    this.isAwake = isAwake;
    this.isMoving = isMoving;
  }
  sleep() { this.isAwake = false; }
  wake() { this.isAwake = true; }
  sit() { this.isMoving = false; }
  walk() { this.isMoving = true; }
  speak(sound) { console.log(sound); }
  toString(animal = 'Animal') {
    return `This ${animal} has ${this.eyes} eyes and ${this.legs} legs. It ${this.isAwake ? 'is' : 'is not'} awake, and ${this.isMoving ? 'is' : 'is not'} moving.`;
  }
}

class Cat extends Animal {
  constructor(fur, isAwake, isMoving) {
    super(2, 4, isAwake, isMoving);
    this.fur = fur;
  }
  speak() { super.speak("Meow..."); }
  toString() { return super.toString("Cat"); }
}

class Dog extends Animal {
  constructor(fur, isAwake, isMoving) {
    super(2, 4, isAwake, isMoving);
    this.fur = fur;
  }
  speak() { super.speak("Woof!"); }
  toString() { return super.toString("Dog"); }
}

class Cow extends Animal {
  constructor(hair, isAwake, isMoving) {
    super(2, 4, isAwake, isMoving);
    this.hair = hair;
  }
  speak() { super.speak("Moo."); }
  toString() { return super.toString("Cow"); }
}
```

**Key takeaways:**
- `super()` in the constructor calls the parent's constructor — **must** be called before any references to `this`
- `super.speak()` calls the parent's `speak` method — avoids repetition
- Child classes can completely override parent methods if needed

Instantiation:

```javascript
const cat1 = new Cat("Orange", true, false);
const cat2 = new Cat("Black and White", false, false);
const dog1 = new Dog("Gold", true, true);
const cow1 = new Cow("Brown", true, false);
```

### 🧪 Exercise: Create a Human Class

Remember our original `person` example? Using it as inspiration:

1. Create a `Human` class that extends `Animal`
2. Think about how to implement `introduce()` in the context of the parent class
3. Instantiate a `Human` and call `introduce()` to test your code

> **Note:** You can extend the inheritance chain as far as needed: `class Developer extends Human`, `class FrontEndDeveloper extends Developer`, etc.

---

## Encapsulation

**Encapsulation** is the ability for an object to decide what information it shows to the outside world and what it keeps to itself. It also encourages methods that specify how properties are accessed or modified.

### Private Properties with `#`

In JavaScript, all object properties and methods are **public by default**. To create **private** properties, use the `#` symbol:

```javascript
class Learner {
  #grades = [];
  #name = {
    first: '',
    last: '',
  };
  #age;

  constructor(firstName, lastName, age) {
    this.#name.first = firstName;
    this.#name.last = lastName;
    this.#age = age;
  }
}

const learner1 = new Learner('Leeroy', 'Jenkins', 18);
// learner1.#grades → SyntaxError!
```

### Getters and Setters

We provide controlled access using `get` and `set` keywords:

```javascript
class Learner {
  #grades = [];
  #name = { first: '', last: '' };
  #age;

  constructor(firstName, lastName, age) {
    this.#name.first = firstName;
    this.#name.last = lastName;
    this.#age = age;
  }

  get name() {
    return this.#name.first + ' ' + this.#name.last;
  }

  get age() {
    return this.#age;
  }

  addGrades(...grades) {
    grades = grades.flat();
    grades.forEach((grade) => {
      grade = Number(grade);
      if (grade >= 0 && grade <= 100) {
        this.#grades.push(grade);
      }
    });
  }

  get grades() {
    return this.#grades;
  }

  get average() {
    const arr = [...this.#grades];
    arr.sort((a, b) => a - b).shift();
    return arr.reduce((a, b) => a + b) / arr.length;
  }
}
```

**Test it:**

```javascript
const learner1 = new Learner('Leeroy', 'Jenkins', 18);
learner1.addGrades([95, 87, 66], "98", "100", -60, 88, 89, [100, 76, 88], 105);
console.log(learner1.grades);   // Invalid values excluded
console.log(learner1.average);  // Lowest grade dropped
```

### Knowledge Check

> ❓ In your own words, describe the OOP principle known as encapsulation.
> ❓ What special character is used to declare private features in a class?
> ❓ What are some of the benefits of making properties private?
> ❓ What are some of the benefits of creating custom getter and setter methods?

---

## Abstraction

**Abstraction** hides unnecessary details from the user of a class or object. It encapsulates complexity so users can accomplish tasks without worrying about *how* those tasks are handled.

### Two Types of Abstraction

| Type | Description | Example |
|------|-------------|---------|
| **Data Abstraction** | Original data entity hidden by an external-facing structure | `get name()` returns a string instead of exposing the `#name` object |
| **Process Abstraction** | Underlying implementation of processes are hidden | `addGrades()` handles validation, flattening, and pushing internally |

**Real-world analogy:** A car exposes `start()`, `turn()`, `accelerate()`, and `brake()` — you don't need to understand the engine to drive.

> 💡 **Abstraction** is a design-level concept; **Encapsulation** is an implementation-level concept.

---

## Polymorphism

**Polymorphism** is the ability of a single thing to take on many forms (*poly* = many; *morph* = change form).

In our `Animal` example, calling `.speak()` on different animal instances produces different results — **same method name, different behavior:**

```javascript
cat1.speak();  // "Meow..."
dog1.speak();  // "Woof!"
cow1.speak();  // "Moo."
```

### Types of Polymorphism

- **Inheritance-based polymorphism:** Differences in behavior defined by child classes
- **Parameter-based polymorphism:** Output differs based on parameters given to the constructor
- **Dynamic polymorphism:** Happens at runtime (not typical in JS due to lack of strict typing)

### The `instanceof` Operator

```javascript
console.log(cat1 instanceof Cat);    // true
console.log(cat1 instanceof Animal); // true
console.log(cat1 instanceof Object); // true
console.log(cat1 instanceof Dog);    // false
```

---

## Static Properties and Methods

**Static** members belong to the class itself, not to instances. They don't require instantiation.

- **Static methods** = utility functions independent of individual object state
- **Static properties** = caches, fixed configs, shared data

```javascript
class Grades {
  static getAverage(...grades) {
    const arr = [];
    grades = grades.flat();
    grades.forEach((grade) => {
      grade = Number(grade);
      if (grade >= 0 && grade <= 100) {
        arr.push(grade);
      }
    });
    arr.sort((a, b) => a - b).shift();
    return arr.reduce((a, b) => a + b) / arr.length;
  }
}

// Use without instantiation:
Grades.getAverage(95, 87, 66, 98, 100, 88, 89, 100, 76, 88);
```

---

## Object Prototypes

**Prototypes** are the way JavaScript objects inherit features from one another.

### The Prototype Chain

```javascript
class Animal {}
class Cat extends Animal {}
class Tabby extends Cat {}
class SpottedTabby extends Tabby {}

const cat1 = new SpottedTabby();
let object = cat1;

do {
  object = Object.getPrototypeOf(object);
  console.log(object);
} while (object);
```

When you access a property, JavaScript searches up the prototype chain until found (or returns `undefined`).

### Manipulating Prototypes

```javascript
Object.getPrototypeOf(cat1).breed = "Tabby";
// Now ALL SpottedTabby instances have breed = "Tabby"

// You can also extend built-in prototypes (use with caution!):
Array.prototype.min = function() {
  return Math.min(...this);
};

[3, 8, 1, -10, 90].min(); // -10
```

> ⚠️ Be very careful when extending base classes — this can conflict with libraries.

---

## Object Factories

A **factory function** returns an object without using `new`:

```javascript
const learnerFactory = (firstName, lastName, age) => {
  const introduce = () => console.log(`Hi, I'm ${firstName} ${lastName}!`);
  return { name: (firstName + ' ' + lastName), age, introduce };
};

const learner1 = learnerFactory('John', 'Seen', 46);
```

Factories are great for simple objects but lose flexibility as complexity increases (no prototype chain, no `instanceof`).

---

## Labs

Complete the following in order:

1. **GLAB 308A.2.1** — An Object-Oriented Adventure (guided)
2. **ALAB 308A.2.1** — JavaScript Classes
3. **ALAB 308A.2.2** — Static Methods, Static Properties, and Inheritance
4. **ALAB 308A.2.3** — Classes and Factories

---

*Copyright © Per Scholas 2026*

