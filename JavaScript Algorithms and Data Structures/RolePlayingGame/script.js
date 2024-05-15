// Game state variables
let xp = 0; // Player's experience points
let health = 100; // Player's health points
let gold = 50; // Amount of gold the player has
let currentWeapon = 0; // Index of the currently equipped weapon in the weapons array
let fighting; // Index of the current monster being fought
let monsterHealth; // Health points of the current monster
let inventory = ["stick"]; // List of weapons player has acquired

// Element selectors
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Definitions of weapons available in the game
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

// Definitions of monsters in the game
const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 }
];

// Game location settings and corresponding UI text and functions
const locations = [
    {
      name: "town square",
      "button text": ["Go to store", "Go to cave", "Fight dragon"],
      "button functions": [goStore, goCave, fightDragon],
      text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
      name: "store",
      "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
      "button functions": [buyHealth, buyWeapon, goTown],
      text: "You enter the store."
    },
    {
      name: "cave",
      "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
      "button functions": [fightSlime, fightBeast, goTown],
      text: "You enter the cave. You see some monsters."
    },
    {
      name: "fight",
      "button text": ["Attack", "Dodge", "Run"],
      "button functions": [attack, dodge, goTown],
      text: "You are fighting a monster."
    },
    {
      name: "kill monster",
      "button text": ["Go to town square", "Go to town square", "Go to town square"],
      "button functions": [goTown, goTown, easterEgg],
      text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
      name: "lose",
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
      "button functions": [restart, restart, restart],
      text: "You die. &#x2620;"
    },
    { 
      name: "win", 
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
      "button functions": [restart, restart, restart], 
      text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
    },
    {
      name: "easter egg",
      "button text": ["2", "8", "Go to town square?"],
      "button functions": [pickTwo, pickEight, goTown],
      text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }
  ];

// Assigning functions to buttons for navigating game states
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Function to update UI components according to the current location
function update(location) {
  monsterStats.style.display = "none"; // Hide monster stats by default
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text; // Update main text display
}

// Navigation functions for moving between game locations
function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

// Function for purchasing health if the player has enough gold
function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

// Function for purchasing new weapons if the player has enough gold and hasn't maxed out weapon upgrades
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

// Function for selling weapons back to the store if not the only weapon in inventory
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let soldWeapon = inventory.shift(); // Remove the first weapon in inventory
    text.innerText = "You sold a " + soldWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// Combat functions

function fightSlime() {
    fighting = 0; // Set current monster index to slime
    goFight();
  }
  
  function fightBeast() {
    fighting = 1; // Set current monster index to fanged beast
    goFight();
  }
  
  function fightDragon() {
    fighting = 2; // Set current monster index to dragon
    goFight();
  }
  
  // General function to initiate a fight with the chosen monster
  function goFight() {
    update(locations[3]); // Update game state to fighting
    monsterHealth = monsters[fighting].health; // Set monster's health for battle
    monsterStats.style.display = "block"; // Show monster stats UI
    monsterName.innerText = monsters[fighting].name; // Display monster's name
    monsterHealthText.innerText = monsterHealth; // Display monster's health
  }
  
  // Player's attack function
  function attack() {
    let hitMessage = "The " + monsters[fighting].name + " attacks.";
    hitMessage += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level); // Subtract damage taken from player's health
    if (isMonsterHit()) { // Check if player's attack hits the monster
      monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1; // Calculate damage dealt
    } else {
      hitMessage += " You miss."; // Notify player of missed attack
    }
    text.innerText = hitMessage;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) { // Check if player is defeated
      lose();
    } else if (monsterHealth <= 0) { // Check if monster is defeated
      if (fighting === 2) { // If the monster is the dragon
        winGame();
      } else {
        defeatMonster();
      }
    }
    if (Math.random() <= .1 && inventory.length > 1) { // Random chance for weapon breakage
      let brokenWeapon = inventory.pop(); // Remove the last weapon in inventory
      text.innerText += " Your " + brokenWeapon + " breaks.";
      currentWeapon--; // Decrease weapon index
    }
  }
  
  // Calculate damage value based on monster's level
  function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
  }
  
  // Check if player's attack hits the monster
  function isMonsterHit() {
    return Math.random() > .2 || health < 20;
  }
  
  // Player dodges attack
  function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
  }
  
  // Handle defeat of a monster
  function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7); // Award gold based on monster's level
    xp += monsters[fighting].level; // Award XP based on monster's level
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]); // Update game state to monster defeated
  }
  
  // Handle player's defeat
  function lose() {
    update(locations[5]); // Update game state to player defeated
  }
  
  // Handle victory over the dragon
  function winGame() {
    update(locations[6]); // Update game state to game won
  }
  
  // Restart game function
  function restart() {
    xp = 0; // Reset XP
    health = 100; // Reset health
    gold = 50; // Reset gold
    currentWeapon = 0; // Reset weapon index
    inventory = ["stick"]; // Reset inventory
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
  }
  
  // Easter egg game mechanics
  function easterEgg() {
    update(locations[7]); // Update game state to easter egg challenge
  }
  
  function pickTwo() {
    pick(2); // Pick number 2 for easter egg game
  }
  
  function pickEight() {
    pick(8); // Pick number 8 for easter egg game
  }
  
  // General pick function for easter egg game
  function pick(guess) {
    const numbers = Array.from({length: 10}, () => Math.floor(Math.random() * 11)); // Generate ten random numbers between 0 and 10
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n" + numbers.join(", ");
    if (numbers.includes(guess)) {
      text.innerText += "\nRight! You win 20 gold!";
      gold += 20; // Award gold for correct guess
      goldText.innerText = gold;
    } else {
      text.innerText += "\nWrong! You lose 10 health!";
      health -= 10; // Subtract health for incorrect guess
      healthText.innerText = health;
      if (health <= 0) {
        lose(); // Check if player is defeated
      }
    }
  }
  