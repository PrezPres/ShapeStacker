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
  // Load local images
  this.load.image('rectangle', 'assets/images/rectangle.png');
  this.load.image('square', 'assets/images/square.png');
  this.load.image('sticky', 'assets/images/sticky.png');
  this.load.image('triangle', 'assets/images/triangle.png');
  this.load.image('circle', 'assets/images/circle.png');
  this.load.image('star', 'assets/images/star.png');
}

function create() {
  // Resume AudioContext on user interaction
  this.input.once('pointerdown', () => {
    this.sound.context.resume();
  });

  // Calculate the position to center the gameplay area
  const centerX = (this.scale.width - gameWidth) / 2;
  const centerY = (this.scale.height - gameHeight) / 2;

  // Draw the border around the gameplay area
  const graphics = this.add.graphics();
  graphics.lineStyle(4, 0xffffff); // White border with thickness of 4
  graphics.strokeRect(centerX, centerY, gameWidth, gameHeight);

  const ground = this.matter.add.rectangle(400, 580, 800, 40, {
    isStatic: true,
  });

  this.add.text(10, 10, 'Tap to drop shapes', { font: '16px Arial', fill: '#000' });

  this.input.on('pointerdown', () => {
    const x = Phaser.Math.Between(100, 700);
    const shapeType = Phaser.Math.RND.pick(['rectangle', 'square', 'sticky']);
    const shape = this.matter.add.image(x, 0, shapeType);
    shape.setBounce(0.5).setFriction(0.5);
  });
}

function update() {
  // No updates yet
}
