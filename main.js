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
  graphics.lineStyle(4, 0xffffff); // White line with thickness of 4

  // Top line
  graphics.beginPath();
  graphics.moveTo(centerX, centerY); // Top-left corner
  graphics.lineTo(centerX + gameWidth, centerY); // Top-right corner
  graphics.strokePath();

  // Bottom line
  graphics.beginPath();
  graphics.moveTo(centerX, centerY + gameHeight); // Bottom-left corner
  graphics.lineTo(centerX + gameWidth, centerY); // Bottom-right corner
  graphics.strokePath();

  // Left border
  graphics.beginPath();
  graphics.moveTo(centerX, centerY); // Start at top-left
  graphics.lineTo(centerX, centerY + gameHeight); // Extend down to ground
  graphics.strokePath();

  // Right border
  graphics.beginPath();
  graphics.moveTo(centerX + gameWidth, centerY); // Start at top-right
  graphics.lineTo(centerX + gameWidth, centerY + gameHeight); // Extend down to ground
  graphics.strokePath();

  // Add ground
  const ground = this.matter.add.rectangle(
    config.width / 2,
    centerY + gameHeight - 20,
    gameWidth,
    40,
    { isStatic: true }
  );

  // Instruction text
  const instructions = this.add.text(config.width, centerY + 20, "Tap above the line to drop shapes!", {
    font: "18px Arial",
    fill: "#fff",
  });
  instructions.setOrigin(0.5); // Center the text horizontally

  // Show the next shape above the gameplay box
  nextShapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky", "triangle", "circle", "star"]);
  const nextShapeText = this.add.text(centerX + gameWidth - 100, centerY - 40, "Next:", {
    font: "16px Arial",
    fill: "#fff",
  });
  const nextShape = this.add.image(centerX + gameWidth - 50, centerY - 20, nextShapeType).setScale(0.5);

  // Pointer down event to drop shapes
  this.input.on("pointerdown", (pointer) => {
    if (pointer.y < centerY) {
      const x = Phaser.Math.Clamp(pointer.x, centerX + 10, centerX + gameWidth - 10);
      const shape = this.matter.add.image(x, centerY - 100, nextShapeType);
      shape.setBounce(0.5).setFriction(0.5);

      // Update next shape
      nextShapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky", "triangle", "circle", "star"]);
      nextShape.setTexture(nextShapeType);
    }
  });
}

function update() {
  // No updates yet
}
