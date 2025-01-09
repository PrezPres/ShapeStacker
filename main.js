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
  this.load.image('rectangle', 'assets/images/rectangle.png');
  this.load.image('square', 'assets/images/square.png');
  this.load.image('sticky', 'assets/images/sticky.png');
  this.load.image('triangle', 'assets/images/triangle.png');
  this.load.image('circle', 'assets/images/circle.png');
  this.load.image('star', 'assets/images/star.png');
}

function create() {
  // Gameplay area dimensions
  const gameWidth = 400; // Width of the gameplay area
  const gameHeight = 400; // Height of the gameplay area

  // Calculate the position to center the gameplay area
  const centerX = (this.scale.width - gameWidth) / 2;
  const centerY = (this.scale.height - gameHeight) / 2;

  // Draw the border around the gameplay area
  const graphics = this.add.graphics();
  graphics.lineStyle(4, 0xffffff); // White border with thickness of 4
  graphics.strokeRect(centerX, centerY, gameWidth, gameHeight);

  // Add game objects within the centered gameplay area
  this.add.text(centerX + 20, centerY + 20, 'Game Area', { fontSize: '16px', color: '#fff' });

  // Example of placing a shape within the gameplay area
  const square = this.add.image(centerX + 50, centerY + 50, 'square');
  square.setInteractive();
}

function update() {
  // No updates yet
}
