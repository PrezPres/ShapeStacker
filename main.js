const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#87ceeb",
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

let nextShapeType;
let timerText;
let countdown = 30; // Countdown timer (in seconds)
let timerEvent;
let shapes = []; // To track active shapes
let shapesInBoxText; // To display the number of shapes in the box
let timerStarted = false; // To check if the timer has started
let additionalTime = 15; // 15 seconds after the timer ends
let additionalTimeElapsed = false; // Flag to track if additional time has passed
let lockedCount = false; // Flag to lock the shape count

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
  const gameWidth = 600;
  const gameHeight = 500;
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
  shapesInBoxText = this.add.text(centerX + gameWidth - 80, centerY + gameHeight + 20, `Shapes in Box: 0`, {
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

        // Count shapes in the box
        const shapesInBox = shapes.filter((shape) => shape.y < config.height).length;
        shapesInBoxText.setText(`Shapes in Box: ${shapesInBox}`);

        // Start the additional 15-second window
        this.time.addEvent({
          delay: 1000,
          callback: () => {
            additionalTime--; // Countdown additional time
            if (additionalTime <= 0 && !additionalTimeElapsed) {
              additionalTimeElapsed = true;
              shapesInBoxText.setText("Final Count Locked");

              // Lock the count and stop physics updates
              lockedCount = true;
              lockShapePhysics(); // Function to stop dynamic physics
            }
          },
          callbackScope: this,
          loop: true,
        });
      }
    },
    callbackScope: this,
    loop: true,
  });
}

function lockShapePhysics() {
  // Disable gravity and friction for all shapes
  shapes.forEach((shape) => {
    shape.setGravity(0, 0);  // Set gravity to 0
    shape.setFriction(0);    // Set friction to 0
    shape.setVelocity(0, 0); // Set velocity to 0 to stop movement
  });
}

function update() {
  // Only update the count if it's not locked
  if (additionalTimeElapsed) {
    shapesInBoxText.setText(`Final Count Locked: ${shapes.filter((shape) => shape.y < config.height).length}`);
  } else {
    const shapesInBox = shapes.filter((shape) => shape.y < config.height).length;
    shapesInBoxText.setText(`Shapes in Box: ${shapesInBox}`);
  }

  // Remove shapes that have fallen off the game area
  shapes = shapes.filter((shape) => shape.y < config.height);
}

