// Reset button functionality
document.getElementById("reset-button").addEventListener("click", resetGame);

function resetGame() {
  // Reset the game variables
  countdown = 30;
  extraTime = 15;
  shapes = []; // Clear the current shapes
  additionalTimeElapsed = false; // Reset the additional time flag
  timerStarted = false; // Reset the timer flag
  timerText.setText(`Time Left: ${countdown}`); // Reset the timer display
  shapesInBoxText.setText(`Shapes in Box: 0`); // Reset the shapes in box display
  resetShapesPosition(); // Reset positions of shapes

  // Restart the game timer
  if (timerEvent) {
    timerEvent.remove(); // Remove any ongoing timer events
  }

  // Restart the game logic, if necessary
  startTimer.call(this); // Restart the timer on reset
}

// Reset all shapes to static and remove them from the game area
function resetShapesPosition() {
  shapes.forEach(shape => {
    shape.setStatic(false); // Reset to dynamic if needed
    shape.destroy(); // Remove the shape from the game
  });
}
