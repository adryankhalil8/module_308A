/* =========================================================
   Part 1: Humble Beginnings 
========================================================= */
  

const adventurer = {
  name: "Robin",
  health: 10,
  inventory: ["sword", "potion", "artifact"],

  companion: {
    name: "Leo",
    type: "Cat",
    companion: {
      name: "Frank",
      type: "Flea",
      belongings: ["small hat", "sunglasses"],
    },
  },

  roll(mod = 0) {
    const result = Math.floor(Math.random() * 20) + 1 + mod;
    console.log(`${this.name} rolled a ${result}.`);
    return result;
  },
};

// Practice exercise: log inventory
console.log("\n--- Part 1: Robin's inventory ---");
for (let i = 0; i < adventurer.inventory.length; i++) {
  console.log(`Item ${i}: ${adventurer.inventory[i]}`);
}
adventurer.roll();
adventurer.roll(2);

/* =========================================================
   Part 2: Class Fantasy (Character class + roll method)
========================================================= */

class Character {
  static MAX_HEALTH = 100;

  constructor(name) {
    this.name = name;
    this.health = Character.MAX_HEALTH;
    this.inventory = [];
  }

  roll(mod = 0) {
    const result = Math.floor(Math.random() * 20) + 1 + mod;
    console.log(`${this.name} rolled a ${result}.`);
    return result;
  }

  takeDamage(amount = 1) {
    this.health = Math.max(0, this.health - amount);
    return this.health;
  }

  heal(amount = 1) {
    this.health = Math.min(Character.MAX_HEALTH, this.health + amount);
    return this.health;
  }

  addItem(item) {
    this.inventory.push(item);
  }

  removeItem(item) {
    const idx = this.inventory.indexOf(item);
    if (idx >= 0) this.inventory.splice(idx, 1);
  }
}

// Re-create Robin using Character
console.log("\n--- Part 2: Recreate Robin with Character ---");

const robinCharacter = new Character("Robin");
robinCharacter.inventory = ["sword", "potion", "artifact"];

robinCharacter.companion = new Character("Leo");
robinCharacter.companion.type = "Cat";

robinCharacter.companion.companion = new Character("Frank");
robinCharacter.companion.companion.type = "Flea";
robinCharacter.companion.companion.inventory = ["small hat", "sunglasses"];

robinCharacter.roll();
robinCharacter.companion.roll();
robinCharacter.companion.companion.roll();

/* =========================================================
   Part 3: Class Features (Adventurer extends Character)
   + Companion class
========================================================= */

class Companion extends Character {
  constructor(name, species, skill = "Assist") {
    super(name);
    this.species = species; // ex: "Cat", "Flea", "Wolf"
    this.skill = skill;
    this.loyalty = 50; // 0-100
  }

  cheer(target) {
    // boosts target roll slightly
    console.log(`${this.name} (${this.species}) cheers for ${target.name}!`);
    this.loyalty = Math.min(100, this.loyalty + 2);
    return 1; // roll bonus
  }

  scavenge() {
    const lootTable = ["berries", "shiny coin", "old key", "bandage"];
    const loot = lootTable[Math.floor(Math.random() * lootTable.length)];
    this.addItem(loot);
    console.log(`${this.name} scavenged: ${loot}`);
    return loot;
  }
}

class Adventurer extends Character {
  static ROLES = ["Fighter", "Healer", "Wizard"];

  constructor(name, role, options = {}) {
    super(name);

    if (!Adventurer.ROLES.includes(role)) {
      throw new Error(
        `Invalid role "${role}". Must be one of: ${Adventurer.ROLES.join(", ")}`
      );
    }

    this.role = role;

    // customizable instance properties (make instances customizable)
    this.level = options.level ?? 1;
    this.gold = options.gold ?? 50;
    this.power = options.power ?? 5;

    // base inventory
    this.inventory.push("bedroll", "50 gold coins");
  }

  scout() {
    console.log(`${this.name} is scouting ahead...`);
    return super.roll();
  }

  // method that alters properties
  train() {
    this.level += 1;
    this.power += 1;
    console.log(`${this.name} trained up! Level=${this.level}, Power=${this.power}`);
  }

  // role-specific methods (creative extension)
  useAbility(target) {
    if (!(target instanceof Character)) {
      throw new Error("useAbility(target) requires a Character target.");
    }

    if (this.role === "Fighter") return this.powerStrike(target);
    if (this.role === "Healer") return this.healingWord(target);
    if (this.role === "Wizard") return this.arcaneBlast(target);
  }

  powerStrike(target) {
    const dmg = Math.max(1, Math.floor(this.power / 2));
    target.takeDamage(dmg);
    console.log(`${this.name} uses Power Strike on ${target.name} for ${dmg} dmg!`);
  }

  healingWord(target) {
    const healAmount = Math.max(1, Math.floor(this.power / 2));
    target.heal(healAmount);
    console.log(`${this.name} casts Healing Word on ${target.name} for ${healAmount} hp!`);
  }

  arcaneBlast(target) {
    const dmg = Math.max(1, Math.floor(this.power / 2) + 1);
    target.takeDamage(dmg);
    console.log(`${this.name} casts Arcane Blast on ${target.name} for ${dmg} dmg!`);
  }

  duel(opponent) {
    if (!(opponent instanceof Adventurer)) {
      throw new Error("duel(opponent) requires an Adventurer.");
    }

    console.log(`\n=== DUEL START: ${this.name} (${this.role}) vs ${opponent.name} (${opponent.role}) ===`);

    // reset both to full to keep duels fair (optional, but makes demo clean)
    this.health = Character.MAX_HEALTH;
    opponent.health = Character.MAX_HEALTH;

    let round = 1;

    while (this.health > 50 && opponent.health > 50) {
      console.log(`\n--- Round ${round} ---`);

      // companions can influence rolls if present
      const myBonus = this.companion instanceof Companion ? this.companion.cheer(this) : 0;
      const oppBonus =
        opponent.companion instanceof Companion ? opponent.companion.cheer(opponent) : 0;

      const myRoll = this.roll(myBonus);
      const oppRoll = opponent.roll(oppBonus);

      if (myRoll > oppRoll) {
        opponent.takeDamage(1);
        console.log(`${this.name} wins the round. ${opponent.name} loses 1 health.`);
      } else if (oppRoll > myRoll) {
        this.takeDamage(1);
        console.log(`${opponent.name} wins the round. ${this.name} loses 1 health.`);
      } else {
        console.log("Tie round. No damage.");
      }

      console.log(`Health -> ${this.name}: ${this.health} | ${opponent.name}: ${opponent.health}`);

      // optional mid-fight role flavor every 3 rounds
      if (round % 3 === 0) {
        this.useAbility(this);
        opponent.useAbility(opponent);
        console.log(`After abilities -> ${this.name}: ${this.health} | ${opponent.name}: ${opponent.health}`);
      }

      round++;
    }

    const winner = this.health > opponent.health ? this : opponent;
    console.log(`\n🏆 WINNER: ${winner.name} (${winner.role})`);
    return winner;
  }
}

/* =========================================================
   Part 5: Factory (AdventurerFactory)
========================================================= */

class AdventurerFactory {
  constructor(role) {
    this.role = role;
    this.adventurers = [];
  }

  generate(name, options = {}) {
    const newAdventurer = new Adventurer(name, this.role, options);
    this.adventurers.push(newAdventurer);
    return newAdventurer;
  }

  findByIndex(index) {
    return this.adventurers[index];
  }

  findByName(name) {
    return this.adventurers.find((a) => a.name === name);
  }
}

/* =========================================================
   Part 7: Adventure Forth (make a party & interact)
========================================================= */

console.log("\n--- Part 7: Build a party with factories ---");

const healers = new AdventurerFactory("Healer");
const fighters = new AdventurerFactory("Fighter");
const wizards = new AdventurerFactory("Wizard");

// create multiple (nested arrays/objects via party structure)
const party = {
  name: "The Bootstrap Bandits",
  roster: [
    fighters.generate("Robin", { level: 2, gold: 120, power: 8 }),
    healers.generate("Mina", { level: 2, gold: 60, power: 7 }),
    wizards.generate("Ezra", { level: 3, gold: 30, power: 9 }),
  ],
  bag: {
    sharedGold: 200,
    sharedItems: ["map", "torch", "rope"],
  },
  listRoster() {
    this.roster.forEach((a) => {
      console.log(`${a.name} - ${a.role} (Lv ${a.level}) HP:${a.health} Gold:${a.gold}`);
    });
  },
};

party.listRoster();

// Add companions (new class usage)
party.roster[0].companion = new Companion("Leo", "Cat", "Cheer");
party.roster[0].companion.companion = new Companion("Frank", "Flea", "Scavenge");
party.roster[0].companion.companion.inventory = ["small hat", "sunglasses"];

party.roster[1].companion = new Companion("Pip", "Owl", "Scout");
party.roster[2].companion = new Companion("Nova", "Fox", "Trick");

// combine objects/arrays/functions: interactions
console.log("\n--- Interactions ---");
party.roster[0].train();
party.roster[1].useAbility(party.roster[0]); // healer heals someone
party.roster[2].useAbility(party.roster[0]); // wizard blasts someone (lol)

// companions scavenge
party.roster[0].companion.scavenge();
party.roster[0].companion.companion.scavenge();

// Duel demo to 50 health
party.roster[0].duel(party.roster[2]);

console.log("\n--- Done ---");
