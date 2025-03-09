// Ball and Dice Roll related variables
let ball;
let ballFalling = false;
let ballSpeed = 2;  // Speed at which the ball falls
let diceRollResult = 0; // Result of the dice roll
let isDragging = false;  // Flag for dragging
let offsetX = 0;
let offsetY = 0;
let lastKeyPressTime = 0; // Time of last W key press for cooldown
let rainSound = new Audio('rain-sound-307165.mp3');
    createBall(); // Create the ball if the chance is met

// Function to create the ball and start the falling animation
function createBall() {
    function startRain() {
  
        // Clear old raindrops first
        raindrops = []
      
        if (heavyRain) {
          numRaindrops = 100
        } else {
          numRaindrops = 30
        }
      
        // Generate new raindrops
        for (let i = 0; i < numRaindrops; i++) {
          raindrops.push(new Raindrop())
        }
      
        rainCanvas.style.display = 'block'
        animateRain()
        triggerLightning()
        setTimeout(() => {
      let rainSound = new Audio('rain-sound-307165.mp3');
      rainSound.loop = true; // Enable looping
      rainSound.volume = 0;
        rainSound.play().catch(() => {
          console.warn("Audio failed to play due to restrictions.");
        });
      
        // Set the audio to start looping from 3.5 seconds
        setTimeout(() => {
          let fadeInterval = setInterval(() => {
        
          if (rainSound.volume < 0.2) {
            rainSound.volume += 0.01;  // Increase volume gradually
          } else {
            clearInterval(fadeInterval); // Stop fading when volume reaches 0.5
          }
        }, fadeDuration / 50); // Adjust this value to control fade speed
      
        // Set up an event listener to loop the audio every 3.5 seconds
        rainSound.addEventListener('timeupdate', () => {
          if (rainSound.currentTime >= 3.5) {
            rainSound.currentTime = 0.44;  // Reset to 0 seconds
            setTimeout(() => {
        rainSound.volume = 0.15;
      }, 10);
      setTimeout(() => {
        rainSound.volume = 0.1;
      }, 20);
          }
        });
        }, 0);  // 0 seconds delay before looping starts
      }, 5000);}
      
      function stopRain() {
        rainCanvas.style.display = 'none'; // Hide the rain canvas
        rainSound.pause();  // Stop the rain sound
        rainSound.volume = 0
        rainSound.currentTime = 0;  // Reset sound to start
      }
            
stopRain()
  ball = {
    x: window.innerWidth / 2, // Starting X position (center)
    y: window.innerHeight, // Starting Y position (bottom of the screen)
    radius: 20,              // Ball size (circle radius)
    color: '#E0FF32',          // Ball color
    velocityY: 0,            // Ball's vertical speed (gravity)
    gravity: 0.32,            // Gravity effect (pulling the ball down)
    jumpHeight: 20,          // Jump height when W is pressed
    isJumping: false,        // Is the ball currently jumping
  };

  ballFalling = true;
  animateBall();  // Start the ball falling animation
}

// Function to animate the ball
function animateBall() {
  if (ball) {
    if (ball.isJumping) {
      ball.velocityY -= 1;  // Gravity effect (pulling the ball down over time)
      ball.y -= ball.velocityY;  // Move ball up or down depending on velocity

      // When the ball reaches the peak and starts falling, stop the jump
      if (ball.velocityY <= 0) {
        ball.isJumping = false;
        ball.velocityY = 0;
      }
    } else {
      // Apply gravity after the jump is done (ball falls back down)
      if (ball.y < window.innerHeight - ball.radius) {
        ball.velocityY += ball.gravity; // Increase speed as gravity pulls the ball down
        ball.y += ball.velocityY;
      } else {
        ball.y = window.innerHeight - ball.radius;  // Ensure ball stays on the ground
        ball.velocityY = 0;  // Reset vertical speed
      }
    }
    checkEdgeCollisions();
    checkCollisions()
  }
  
  drawBall();  // Draw the ball at its current position
  requestAnimationFrame(animateBall);  // Keep the animation running
}
function checkCollisions() {
    const gameCard = document.getElementById('game-card');
    const lowerBar = document.getElementById('lowerbar');
    const sidebar = document.getElementById('sidebar');
    const settingsButton = document.querySelector('.setting-button');  // Add settings button
    
    // Get the positions of game elements
    const gameCardRect = gameCard.getBoundingClientRect();
    const lowerBarRect = lowerBar.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    const settingsButtonRect = settingsButton.getBoundingClientRect();
  
    // Check for collision with game-card (bounds checking)
    if (ball.x + ball.radius > gameCardRect.left &&
        ball.x - ball.radius < gameCardRect.right &&
        ball.y + ball.radius > gameCardRect.top &&
        ball.y - ball.radius < gameCardRect.bottom) {
      // Ball hit the game card, handle bounce (or stop movement)
      ball.velocityY = -ball.velocityY * 0.8; // Bounce effect (bounce up and lose some speed)
      ball.y = gameCardRect.top - ball.radius; // Adjust ball position above the game card
    }
  
    // Check for collision with lower bar (bounds checking)
    if (ball.x + ball.radius > lowerBarRect.left &&
        ball.x - ball.radius < lowerBarRect.right &&
        ball.y + ball.radius > lowerBarRect.top &&
        ball.y - ball.radius < lowerBarRect.bottom) {
      // Ball hit the lower bar, handle bounce
      ball.velocityY = -ball.velocityY * 0.8; // Bounce effect
      ball.y = lowerBarRect.top - ball.radius; // Adjust ball position above the lower bar
    }
  
    // Check for collision with sidebar (bounds checking)
    if (ball.x + ball.radius > sidebarRect.left &&
        ball.x - ball.radius < sidebarRect.right &&
        ball.y + ball.radius > sidebarRect.top &&
        ball.y - ball.radius < sidebarRect.bottom) {
      // Ball hit the sidebar, handle bounce
      ball.velocityY = -ball.velocityY * 0.8; // Bounce effect
      ball.y = sidebarRect.top - ball.radius; // Adjust ball position above the sidebar
    }
  
    // Check for collision with settings button (bounds checking)
    if (ball.x + ball.radius > settingsButtonRect.left &&
        ball.x - ball.radius < settingsButtonRect.right &&
        ball.y + ball.radius > settingsButtonRect.top &&
        ball.y - ball.radius < settingsButtonRect.bottom) {
      // Ball hit the settings button, handle bounce
      ball.velocityY = -ball.velocityY * 0.8; // Bounce effect
      ball.y = settingsButtonRect.top - ball.radius; // Adjust ball position above the settings button
    }
  }
// Function to draw the ball on the screen
function drawBall() {
  let ballCanvas = document.getElementById('ballCanvas');
  if (!ballCanvas) {
    ballCanvas = document.createElement('canvas');
    ballCanvas.id = 'ballCanvas';
    ballCanvas.width = window.innerWidth;
    ballCanvas.height = window.innerHeight;
    document.body.appendChild(ballCanvas);
  }
  let ctx = ballCanvas.getContext('2d');
  ctx.clearRect(0, 0, ballCanvas.width, ballCanvas.height);  // Clear canvas before drawing
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);  // Draw a circle
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Function to move the ball up (gravity applies)
function moveBallUp() {
  const currentTime = Date.now();

  // Allow only one jump every 1 second (1000 ms)
  if (currentTime - lastKeyPressTime >= 1000) {
    ball.isJumping = true;
    ball.velocityY = ball.jumpHeight;  // Move up with an initial speed
    lastKeyPressTime = currentTime;  // Update the last key press time
  }
}

// Mouse event listeners for dragging the ball
document.addEventListener('mousedown', (e) => {
  // Check if the click is inside the ball (click directly on the ball)
  const dist = Math.pow(e.clientX - ball.x, 2) + Math.pow(e.clientY - ball.y, 2);
  if (dist <= Math.pow(ball.radius, 2)) {
    isDragging = true;
    offsetX = e.clientX - ball.x;  // Calculate offset for smooth dragging
    offsetY = e.clientY - ball.y;
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDragging && ball) {
    ball.x = e.clientX - offsetX;  // Update ball X position based on mouse movement
    ball.y = e.clientY - offsetY;  // Update ball Y position based on mouse movement
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;  // Stop dragging when mouse is released
});

// Touch event listeners for dragging the ball (mobile support)
document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  const dist = Math.pow(touch.clientX - ball.x, 2) + Math.pow(touch.clientY - ball.y, 2);
  if (dist <= Math.pow(ball.radius, 2)) {
    isDragging = true;
    offsetX = touch.clientX - ball.x;
    offsetY = touch.clientY - ball.y;
  }
});

document.addEventListener('touchmove', (e) => {
  if (isDragging && ball) {
    const touch = e.touches[0];
    ball.x = touch.clientX - offsetX;
    ball.y = touch.clientY - offsetY;
  }
});

document.addEventListener('touchend', () => {
  isDragging = false;  // Stop dragging when touch ends
});

// Keyboard event listeners for A, D, and W keys
document.addEventListener('keydown', (e) => {
  if (ball) {
    if (e.key === 'a' || e.key === 'A') {
      ball.x -= 3.5; // Move left
    } else if (e.key === 'd' || e.key === 'D') {
      ball.x += 3.5; // Move right
    } else if (e.key === 'w' || e.key === 'W') {
      moveBallUp();  // Move up by 1 tap with 1 second cooldown
    }
  }
});
function checkEdgeCollisions() {
    // Bounce off the left edge
    if (ball.x - ball.radius <= 0) {
      ball.velocityX = -ball.velocityX;  // Reverse horizontal velocity
      ball.x = ball.radius;  // Set position to prevent it from going out of bounds
    }
  
    // Bounce off the right edge
    if (ball.x + ball.radius >= window.innerWidth) {
      ball.velocityX = -ball.velocityX;  // Reverse horizontal velocity
      ball.x = window.innerWidth - ball.radius;  // Prevent the ball from going past the right edge
    }
  
    // Bounce off the top edge
    if (ball.y - ball.radius <= 0) {
      ball.velocityY = -ball.velocityY;  // Reverse vertical velocity
      ball.y = ball.radius;  // Set position to prevent it from going out of bounds
    }
  
    // Bounce off the bottom edge (ground)
    if (ball.y + ball.radius >= window.innerHeight) {
      ball.velocityY = -ball.velocityY * 0.8;  // Reverse vertical velocity and reduce speed for bouncing
      ball.y = window.innerHeight - ball.radius;  // Prevent the ball from going past the bottom
    }
  }
  
// Button to trigger the ball to go up (click directly on the ball to move up)
document.addEventListener('click', (e) => {
  // Trigger the moveBallUp function only if the click is inside the ball
  const dist = Math.pow(e.clientX - ball.x, 2) + Math.pow(e.clientY - ball.y, 2);
  if (dist <= Math.pow(ball.radius, 2)) {
    moveBallUp();
  }
});

