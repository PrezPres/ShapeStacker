import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#f0f8ff",
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
  this.load.image("rectangle", "https://via.placeholder.com/100x50/ff0000");
  this.load.image("square", "https://via.placeholder.com/50/0000ff");
  this.load.image("sticky", "https://via.placeholder.com/60/00ff00");
}

let score = 0;
let scoreText;
let gameOver = false;

function create() {
  const ground = this.matter.add.rectangle(400, 580, 800, 40, {
    isStatic: true,
    label: "ground",
  });

  scoreText = this.add.text(10, 10, `Score: ${score}`, {
    font: "24px Arial",
    fill: "#000",
  });

  this.input.on("pointerdown", () => {
    if (gameOver) return;

    const randomShape = Phaser.Math.RND.pick(["rectangle", "square", "sticky"]);
    const x = Phaser.Math.Between(100, 700);

    const shape = this.matter.add.image(x, 0, randomShape);
    shape.setBounce(0.5);
    shape.setFriction(0.5);

    if (randomShape === "sticky") {
      shape.setTint(0x00ff00);
      shape.setOnCollide(() => {
        shape.setStatic(true);
      });
    }

    score++;
    scoreText.setText(`Score: ${score}`);
  });

  this.matter.world.on("collisionstart", (event) => {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      if (
        (bodyA.label === "ground" && bodyB.position.y > 580) ||
        (bodyB.label === "ground" && bodyA.position.y > 580)
      ) {
        gameOver = true;
        this.add.text(300, 300, "Game Over", {
          font: "48px Arial",
          fill: "#ff0000",
        });
        this.scene.pause();
      }
    });
  });
}

function update() {
  if (gameOver) return;
  this.matter.world.engine.world.gravity.y = 1 + score * 0.01;
}
