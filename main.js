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

function preload() {
  // Load shapes as placeholder rectangles
  this.load.image("rectangle", "https://via.placeholder.com/100x50/ff0000");
  this.load.image("square", "https://via.placeholder.com/50/0000ff");
  this.load.image("sticky", "https://via.placeholder.com/60/00ff00");
}

function create() {
  const ground = this.matter.add.rectangle(400, 580, 800, 40, {
    isStatic: true,
  });

  this.add.text(10, 10, "Tap to drop shapes", { font: "16px Arial", fill: "#000" });

  this.input.on("pointerdown", () => {
    const x = Phaser.Math.Between(100, 700);
    const shapeType = Phaser.Math.RND.pick(["rectangle", "square", "sticky"]);
    const shape = this.matter.add.image(x, 0, shapeType);
    shape.setBounce(0.5).setFriction(0.5);
  });
}

function update() {
  // No updates yet
}
