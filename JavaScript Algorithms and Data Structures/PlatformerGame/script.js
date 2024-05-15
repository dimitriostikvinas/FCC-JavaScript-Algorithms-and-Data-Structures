// Retrieve the 'start' button and 'canvas' DOM elements by their IDs and store them in constants for easy access.
const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");

// Retrieve various elements from the DOM used for displaying game screens and messages.
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");

// Get the 2D rendering context for the canvas, which is used for drawing shapes, text, images, and other objects.
const ctx = canvas.getContext("2d");

// Set the canvas dimensions to the width and height of the window. This makes the game fullscreen.
canvas.width = innerWidth;
canvas.height = innerHeight;

// Define a gravity constant that will be used to simulate gravity in the game.
const gravity = 0.5;

// Boolean variable to enable or disable checkpoint collision detection throughout the game.
let isCheckpointCollisionDetectionActive = true;

// Define a function that adjusts a size parameter based on the window's height. 
// This ensures elements are scaled proportionally for different screen sizes.
const proportionalSize = (size) => {
  return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}

// Define the Player class with properties and methods for player behavior.
class Player {
  constructor() {
    // Initialize player position based on the screen size, using the proportionalSize function for scaling.
    this.position = {
      x: proportionalSize(10),
      y: proportionalSize(400),
    };
    // Initialize velocity to zero, as the player starts stationary.
    this.velocity = {
      x: 0,
      y: 0,
    };
    // Define player dimensions, scaled proportionally.
    this.width = proportionalSize(40);
    this.height = proportionalSize(40);
  }

  // Method to draw the player as a rectangle on the canvas.
  draw() {
    ctx.fillStyle = "#99c9ff"; // Set the color of the player.
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw the rectangle at player's position with set dimensions.
  }
  
  // Update the player's position and velocity, handle collisions with canvas boundaries.
  update() {
    this.draw(); // Draw the player in the new position.
    // Update player's position by adding velocity.
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Check if player is still within the bottom boundary of the canvas.
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      if (this.position.y < 0) { // If player goes above the top boundary, reset position and apply gravity.
        this.position.y = 0;
        this.velocity.y = gravity;
      }
      // Add gravity to downward velocity.
      this.velocity.y += gravity;
    } else { // If player hits the bottom boundary, stop moving down.
      this.velocity.y = 0;
    }

    // Prevent player from moving out of the left boundary of the canvas.
    if (this.position.x < this.width) {
      this.position.x = this.width;
    }

    // Prevent player from moving out of the right boundary of the canvas.
    if (this.position.x >= canvas.width - 2 * this.width) {
      this.position.x = canvas.width - 2 * this.width;
    }
  }
}

// Define the Platform class to create platforms in the game.
class Platform {
    constructor(x, y) {
      // Set the initial position of the platform. 'x' and 'y' are passed when creating a new instance.
      this.position = {
        x,
        y,
      };
      // Set a fixed width for all platforms and a proportional height to ensure it scales with different screen sizes.
      this.width = 200;
      this.height = proportionalSize(40);
    }
  
    // Method to draw the platform on the canvas.
    draw() {
      ctx.fillStyle = "#acd157"; // Set the color of the platform.
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw the rectangle at the platform's position.
    }
};

// Define the CheckPoint class to create checkpoint objects in the game.
class CheckPoint {
    constructor(x, y, z) {
      // Initialize checkpoint's position with 'x' and 'y' coordinates. 'z' could be used for additional data (not used in draw or claim methods).
      this.position = {
        x,
        y,
      };
      // Set dimensions of the checkpoint, scaling height and keeping a standard width.
      this.width = proportionalSize(40);
      this.height = proportionalSize(70);
      // Set the checkpoint's initial claimed status to false.
      this.claimed = false;
    }
  
    // Method to draw the checkpoint on the canvas.
    draw() {
      ctx.fillStyle = "#f1be32"; // Set the color of the checkpoint.
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height); // Draw the checkpoint as a rectangle.
    }
  
    // Method to mark this checkpoint as claimed.
    claim() {
      // Reset dimensions and position to make the checkpoint disappear visually.
      this.width = 0;
      this.height = 0;
      this.position.y = Infinity;
      // Set 'claimed' to true indicating the checkpoint has been reached.
      this.claimed = true;
    }
};

// Create a new Player object.
const player = new Player();


const platformPositions = [
    { x: 500, y: proportionalSize(450) },
    { x: 700, y: proportionalSize(400) },
    { x: 850, y: proportionalSize(350) },
    { x: 900, y: proportionalSize(350) },
    { x: 1050, y: proportionalSize(150) },
    { x: 2500, y: proportionalSize(450) },
    { x: 2900, y: proportionalSize(400) },
    { x: 3150, y: proportionalSize(350) },
    { x: 3900, y: proportionalSize(450) },
    { x: 4200, y: proportionalSize(400) },
    { x: 4400, y: proportionalSize(200) },
    { x: 4700, y: proportionalSize(150) },
];

// Maps over an array named 'platformPositions' (assumed to be defined elsewhere in the code),
// which contains objects with x and y properties specifying the positions of platforms.
const platforms = platformPositions.map(
    (platform) => new Platform(platform.x, platform.y)
);

// Defines an array with the positions and additional identifier 'z' for checkpoints in the game.
const checkpointPositions = [
    { x: 1170, y: proportionalSize(80), z: 1 },
    { x: 2900, y: proportionalSize(330), z: 2 },
    { x: 4800, y: proportionalSize(80), z: 3 },
];
  
// Maps over the 'checkpointPositions' array to create an array of CheckPoint instances.
const checkpoints = checkpointPositions.map(
    (checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z)
);

const animate = () => {
    // Request the next animation frame to continuously update the game loop.
    requestAnimationFrame(animate);
  
    // Clear the entire canvas to prepare for drawing new frame.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw all platforms on the canvas.
    platforms.forEach((platform) => {
      platform.draw();
    });
  
    // Draw all checkpoints on the canvas.
    checkpoints.forEach(checkpoint => {
      checkpoint.draw();
    });
  
    // Update the player's position and velocity.
    player.update();
  
    // Check player movement input and adjust player velocity accordingly.
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
      player.velocity.x = 5;
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
      player.velocity.x = -5;
    } else {
      player.velocity.x = 0;
  
      // Move platforms and checkpoints horizontally if player moves towards screen edges.
      if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {
        platforms.forEach((platform) => {
          platform.position.x -= 5;
        });
  
        checkpoints.forEach((checkpoint) => {
          checkpoint.position.x -= 5;
        });
      
      } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
        platforms.forEach((platform) => {
          platform.position.x += 5;
        });
  
        checkpoints.forEach((checkpoint) => {
          checkpoint.position.x += 5;
        });
      }
    }
  
    // Perform collision detection between player and platforms.
    platforms.forEach((platform) => {
      // Define rules for collision detection.
      const collisionDetectionRules = [
        player.position.y + player.height <= platform.position.y,
        player.position.y + player.height + player.velocity.y >= platform.position.y,
        player.position.x >= platform.position.x - player.width / 2,
        player.position.x <= platform.position.x + platform.width - player.width / 3,
      ];
  
      // If all collision detection rules are met, stop player's vertical velocity.
      if (collisionDetectionRules.every((rule) => rule)) {
        player.velocity.y = 0;
        return;
      }
  
      // If player is on top of a platform, adjust player's position and velocity accordingly.
      const platformDetectionRules = [
        player.position.x >= platform.position.x - player.width / 2,
        player.position.x <= platform.position.x + platform.width - player.width / 3,
        player.position.y + player.height >= platform.position.y,
        player.position.y <= platform.position.y + platform.height,
      ];
  
      if (platformDetectionRules.every(rule => rule)) {
        player.position.y = platform.position.y + player.height;
        player.velocity.y = gravity;
      };
    });
  
    // Perform checkpoint detection and actions.
    checkpoints.forEach((checkpoint, index, checkpoints) => {
      // Define rules for checkpoint detection.
      const checkpointDetectionRules = [
        player.position.x >= checkpoint.position.x,
        player.position.y >= checkpoint.position.y,
        player.position.y + player.height <= checkpoint.position.y + checkpoint.height,
        isCheckpointCollisionDetectionActive,
        player.position.x - player.width <= checkpoint.position.x - checkpoint.width + player.width * 0.9,
        index === 0 || checkpoints[index - 1].claimed === true,
      ];
  
      // If all checkpoint detection rules are met, claim the checkpoint and perform related actions.
      if (checkpointDetectionRules.every((rule) => rule)) {
        checkpoint.claim();
  
        // If the last checkpoint is reached, disable checkpoint collision detection, display a message, and move the player.
        if (index === checkpoints.length - 1) {
          isCheckpointCollisionDetectionActive = false;
          showCheckpointScreen("You reached the final checkpoint!");
          movePlayer("ArrowRight", 0, false);
        } else if (player.position.x >= checkpoint.position.x && player.position.x <= checkpoint.position.x + 40) {
          // If a checkpoint is reached, display a message.
          showCheckpointScreen("You reached a checkpoint!"); 
        }
      }
    });
}
  
// Object to keep track of the current state of the keys related to player movement.
const keys = {
    rightKey: {
      pressed: false
    },
    leftKey: {
      pressed: false
    }
};
 
// Function to update player's velocity based on key inputs.
const movePlayer = (key, xVelocity, isPressed) => {
    // Disable movement if checkpoint detection is deactivated.
    if (!isCheckpointCollisionDetectionActive) {
      player.velocity.x = 0;
      player.velocity.y = 0;
      return;
    }
  
    // Switch statement to handle different key presses for movement.
    switch (key) {
      case "ArrowLeft":
        keys.leftKey.pressed = isPressed;
        if (xVelocity === 0) {
          player.velocity.x = xVelocity;
        }
        player.velocity.x -= xVelocity;
        break;
      case "ArrowUp":
      case " ":
      case "Spacebar":
        player.velocity.y -= 8;
        break;
      case "ArrowRight":
        keys.rightKey.pressed = isPressed;
        if (xVelocity === 0) {
          player.velocity.x = xVelocity;
        }
        player.velocity.x += xVelocity;
    }
}
  
// Function to start the game by showing the canvas and hiding the start screen.
const startGame = () => {
    canvas.style.display = "block";
    startScreen.style.display = "none";
    animate();
}
    
// Function to display checkpoint messages temporarily.
const showCheckpointScreen = (msg) => {
    checkpointScreen.style.display = "block";
    checkpointMessage.textContent = msg;
    if (isCheckpointCollisionDetectionActive) {
      // Hide the checkpoint message after 2 seconds.
      setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
    }
};
 
// Event listener for clicking the start button, triggering the startGame function.
startBtn.addEventListener("click", startGame);

// Event listeners for key presses and releases to control player movement.
window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, 8, true);
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, 0, false);
});

  