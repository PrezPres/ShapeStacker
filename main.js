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
  const nextShape = this.add.image(centerX + gameWidth - 20, centerY - 20, nextShapeType).setScale(0.5);

  // Add countdown timer
  timerText = this.add.text(config.width / 2, 50, `Time Left: ${countdown}`, {
    font: "18px Arial",
    fill: "#fff",
  });
  timerText.setOrigin(0.5);

  // Shapes in box text
  shapesInBoxText = this.add.text(config.width / 2, 70, `Shapes in Box: 0`, {
    font: "18px Arial",
    fill: "#fff",
  });
  shapesInBoxText.setOrigin(0.5);
  
// Start countdown timer
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
      }
    },
    callbackScope: this,
    loop: true,
  });
}

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

function update() {
  // Remove shapes that have fallen off the game area
  shapes = shapes.filter((shape) => shape.y < config.height);
}
