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
let highScore = 0;
let currentHeight = 0;

function preload() {
  // Load local images
  this.load.image("rectangle", "assets/images/rectangle.png");
  this.load.image("square", "assets/images/square.png");
  this.load.image("sticky", "assets/images/sticky.png");
  this.load.image("triangle", "assets/images/triangle.png");
  this.load.image("circle", "assets/images/circle.png");
  this.load.image("star", "assets/images/star.png");
}

function create() {
  // Gameplay area dimensions
  const gameWidth = 600;
  const gameHeight = 500;
  const centerX = (config.width - gameWidth) / 2;
  const centerY = (config.height - gameHeight) / 2;

  // Draw the border around the gameplay area
  const graphics = this.add.graphics();
  graphics.lineStyle(4, 0xffffff);
  graphics.strokeRect(centerX, centerY, gameWidth, gameHeight);

  // Extend borders upward
  graphics.lineStyle(2, 0xffffff);
  graphics.strokeRect(centerX - 10, centerY - 100, gameWidth + 20, gameHeight + 100);

  // Add ground
  const ground = this.matter.add.rectangle(
    config.width / 2,
    centerY + gameHeight - 20,
    gameWidth,
    40,
    { isStatic: true }
  );

  // Instruction text
  this.add.text(centerX + 10, centerY - 90, "Tap above the box to drop shapes!", {
    font: "16px Arial",
    fill: "#fff",
  });

  // Show the next shape
  nextShapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky", "triangle", "circle", "star"]);
  const nextShapeText = this.add.text(config.width - 200, 10, "Next:", {
    font: "16px Arial",
    fill: "#fff",
  });
  const nextShape = this.add.image(config.width - 100, 50, nextShapeType);

  // Pointer down event to drop shapes
  this.input.on("pointerdown", (pointer) => {
    if (pointer.y < centerY) {
      const x = Phaser.Math.Clamp(pointer.x, centerX + 10, centerX + gameWidth - 10);
      const shape = this.matter.add.image(x, centerY - 100, nextShapeType);
      shape.setBounce(0.5).setFriction(0.5);

      // Update next shape
      nextShapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky", "triangle", "circle", "star"]);
      nextShape.setTexture(nextShapeType);

      // Check height
      shape.on("update", () => {
        if (shape.body.position.y < currentHeight || currentHeight === 0) {
          currentHeight = shape.body.position.y;
          const heightReached = Math.round((centerY + gameHeight - currentHeight) / 10);
          highScore = Math.max(highScore, heightReached);
          this.add.text(centerX + 10, centerY + gameHeight + 10, `Height: ${heightReached} - High Score: ${highScore}`, {
            font: "14px Arial",
            fill: "#fff",
          });
        }
      });
    }
  });
}

function update() {
  // Game logic can go here if needed
}
