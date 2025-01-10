const gameContainer = document.getElementById("game-container");

const config = {
  type: Phaser.AUTO,
  width: Math.min(gameContainer.clientWidth, 800),
  height: Math.min(gameContainer.clientHeight, 600),
  backgroundColor: "#f0f0f0",
  parent: "game-container",
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { y: 1 },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

// Adjust game size on resize
window.addEventListener("resize", () => {
  game.scale.resize(
    Math.min(gameContainer.clientWidth, 800),
    Math.min(gameContainer.clientHeight, 600)
  );
});


let nextShapeType;
let timerText;
let countdown = 30; // Countdown timer (in seconds)
let timerEvent;
let shapes = []; // To track active shapes
let shapesInBoxText; // To display the number of shapes in the box
let timerStarted = false; // To check if the timer has started
let additionalTimeElapsed = false; // Flag to indicate extra time is over
let extraTime = 15; // Updated to 15 seconds after the main timer ends

function preload() {
  // Load images for shapes
  this.load.image("rectangle", "assets/images/rectangle.png");
  this.load.image("square", "assets/images/square.png");
  this.load.image("sticky", "assets/images/sticky.png");
  this.load.image("triangle", "assets/images/triangle.png");
  this.load.image("circle", "assets/images/circle.png");
  this.load.image("star", "assets/images/star.png");
}

function create() {
  console.log('Phaser game has started!');
  
  const gameWidth = config.width * .8; // 600;
  const gameHeight = config.height * .8; // 500;
  const centerX = (config.width - gameWidth) / 2;
  const centerY = (config.height - gameHeight) / 2;

  // Draw the top line and tall side borders
  const graphics = this.add.graphics();
  graphics.lineStyle(4, 0xffffff);

  // Top line
  graphics.beginPath();
  graphics.moveTo(centerX, centerY);
  graphics.lineTo(centerX + gameWidth, centerY);
  graphics.strokePath();

  // Bottom line
  graphics.beginPath();
  graphics.moveTo(centerX, centerY + gameHeight); // Bottom-left corner
  graphics.lineTo(centerX + gameWidth, centerY + gameHeight); // Bottom-right corner
  graphics.strokePath();

  // Left border
  graphics.beginPath();
  graphics.moveTo(centerX, centerY);
  graphics.lineTo(centerX, centerY + gameHeight);
  graphics.strokePath();

  // Right border
  graphics.beginPath();
  graphics.moveTo(centerX + gameWidth, centerY);
  graphics.lineTo(centerX + gameWidth, centerY + gameHeight);
  graphics.strokePath();

  // Add ground
  const ground = this.matter.add.rectangle(
    config.width / 2,
    centerY + gameHeight + 20,
    gameWidth,
    40,
    { isStatic: true }
  );

  // Instruction text
  const instructions = this.add.text(config.width / 2, centerY + 20, "Tap above the line to drop shapes!", {
    font: "18px Arial",
    fill: "#fff",
  });
  instructions.setOrigin(0.5);

  // Show the next shape above the gameplay box
  nextShapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky", "triangle", "circle", "star"]);
  const nextShapeText = this.add.text(centerX + gameWidth - 100, centerY - 40, "Next:", {
    font: "16px Arial",
    fill: "#fff",
  });
  const nextShape = this.add.image(centerX + gameWidth - 20, centerY - 30, nextShapeType).setScale(0.5);

  // Add countdown timer
  timerText = this.add.text(centerX + 50, centerY + gameHeight + 20, `Time Left: ${countdown}`, {
    font: "18px Arial",
    fill: "#fff",
  });
  timerText.setOrigin(0.5);

  // Shapes in box text
  shapesInBoxText = this.add.text(centerX + gameWidth - 90, centerY + gameHeight + 20, `Shapes in Box: 0`, {
    font: "18px Arial",
    fill: "#fff",
  });
  shapesInBoxText.setOrigin(0.5);

  // Pointer down event to drop shapes
  this.input.on("pointerdown", (pointer) => {
    if (!timerStarted) {
      startTimer.call(this); // Start timer on first click
      timerStarted = true;
    }
    
    if (countdown > 0 && pointer.y < centerY) {
      const x = Phaser.Math.Clamp(pointer.x, centerX, centerX + gameWidth);
      const shape = this.matter.add.image(x, centerY, nextShapeType);
      shape.setBounce(0.5).setFriction(0.5);
      shapes.push(shape); // Track the shape

      // Update next shape
      nextShapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky", "triangle", "circle", "star"]);
      nextShape.setTexture(nextShapeType);
    }
  });
}

function startTimer() {
  timerEvent = this.time.addEvent({
    delay: 1000, // 1 second
    callback: () => {
      countdown--;
      timerText.setText(`Time Left: ${countdown}`);
      if (countdown <= 0) {
        timerEvent.remove(); // Stop the timer
        timerText.setText("Time's Up!");

        // Add extra time after countdown
        startExtraTime.call(this);
      }
    },
    callbackScope: this,
    loop: true,
  });
}

function startExtraTime() {
  // Additional 15 seconds after the main timer ends
  this.time.addEvent({
    delay: 1000, // 1 second
    callback: () => {
      extraTime--;
      if (extraTime <= 0) {
        additionalTimeElapsed = true;
        shapesInBoxText.setText(`Final Count Locked: ${shapes.filter((shape) => shape.y < config.height).length}`);
        
        // Lock gravity and movement of shapes
        shapes.forEach((shape) => {
          shape.setStatic(true);  // Lock the shapes in place
        });
      }
    },
    callbackScope: this,
    loop: true,
  });
}

function update() {
  // Remove shapes that have fallen off the game area
  if (!additionalTimeElapsed) {
    shapes = shapes.filter((shape) => shape.y < config.height);
    const shapesInBox = shapes.filter((shape) => shape.y < config.height).length;
    shapesInBoxText.setText(`Shapes in Box: ${shapesInBox}`);
  }
}

// Reset button functionality
document.getElementById("reset-button").addEventListener("click", () => {
  location.reload(); // Reload the entire page
});
