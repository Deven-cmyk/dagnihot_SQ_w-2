// ============================================================
// SUSHI GO PLATFORMER - GBDA302 Project
// ============================================================

// Assets
let backgroundImg;
let characterImg;

// Game states
let gameState = "playing"; // "playing" or "won"
let jumpMultiplier = 1; // 1x normal, or 2x on golden platform

// THE PLAYER OBJECT
let player = {
  x: 100,
  y: 300,
  vx: 0,
  vy: 0,
  width: 48,
  height: 72,
  speed: 0.4,
  maxSpeed: 3,
  jumpForce: -11,
  friction: 0.85,
  onGround: false,
  onGoldenPlatform: false,
};

// Physics
const GRAVITY = 0.55;

// Platforms array - blue platforms positioned to create upward progression
let platforms = [];

let door = {
  x: 680,
  y: 0,
  width: 60,
  height: 90,
  active: false,
};

// ============================================================
// preload() - Load images before setup runs
// ============================================================
function preload() {
  backgroundImg = loadImage("assets/images/background.jpg");
  characterImg = loadImage("assets/images/character.png");
}

// ============================================================
// setup()
// ============================================================
function setup() {
  createCanvas(800, 600);

  // Create platforms - positioned to move player upward
  // Format: {x, y, width, height, color, isGolden}

  // Ground platforms (starting area)
  platforms.push({
    x: 0,
    y: 500,
    width: 800,
    height: 50,
    color: [90, 50, 30],
    isGolden: false,
  });

  // Blue platforms going up
  platforms.push({
    x: 100,
    y: 460,
    width: 100,
    height: 16,
    color: [70, 150, 220],
    isGolden: false,
  });
  platforms.push({
    x: 350,
    y: 400,
    width: 100,
    height: 16,
    color: [70, 150, 220],
    isGolden: false,
  });
  platforms.push({
    x: 150,
    y: 340,
    width: 100,
    height: 16,
    color: [70, 150, 220],
    isGolden: false,
  });
  platforms.push({
    x: 500,
    y: 280,
    width: 100,
    height: 16,
    color: [70, 150, 220],
    isGolden: false,
  });
  platforms.push({
    x: 250,
    y: 220,
    width: 100,
    height: 16,
    color: [70, 150, 220],
    isGolden: false,
  });
  platforms.push({
    x: 550,
    y: 160,
    width: 100,
    height: 16,
    color: [70, 150, 220],
    isGolden: false,
  });

  // GOLDEN PLATFORM - triggers 2x jump (special mechanic)
  platforms.push({
    x: 310,
    y: 80,
    width: 180,
    height: 22,
    color: [255, 215, 0],
    isGolden: true,
  });

  door.y = platforms[0].y - door.height;
  player.y = platforms[0].y - player.height;
}

// ============================================================
// draw()
// ============================================================
function draw() {
  // Draw background image
  background(255);
  if (backgroundImg) {
    image(backgroundImg, 0, 0, width, height);
  }

  if (gameState === "playing") {
    handleInput();
    applyPhysics();
    checkPlatformCollisions();
    drawPlatforms();
    drawDoor();
    checkDoorEntry();
    drawPlayer();
    drawHUD();
  } else if (gameState === "won") {
    drawVictoryScreen();
  }
}

// ============================================================
// handleInput()
// ============================================================
function handleInput() {
  // Horizontal movement
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    // LEFT or A
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    // RIGHT or D
    player.vx += player.speed;
  }

  // Clamp horizontal speed
  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  // Apply friction when no horizontal key is pressed
  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  // Jump
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) {
    // UP or W
    player.vy = player.jumpForce * jumpMultiplier;
    player.onGround = false;
  }
}

// ============================================================
// applyPhysics()
// ============================================================
function applyPhysics() {
  // Apply gravity
  player.vy += GRAVITY;

  // Move player by velocity
  player.x += player.vx;
  player.y += player.vy;

  // Boundary checking
  player.x = constrain(player.x, 0, width - player.width);

  // If player falls off bottom, reset position
  if (player.y > height) {
    player.x = 100;
    player.y = platforms[0].y - player.height;
    player.vx = 0;
    player.vy = 0;
    jumpMultiplier = 1;
    player.onGoldenPlatform = false;
  }
}

// ============================================================
// checkPlatformCollisions()
// Checks if player is standing on any platform
// ============================================================
function checkPlatformCollisions() {
  player.onGround = false;
  player.onGoldenPlatform = false;
  jumpMultiplier = 1;

  for (let platform of platforms) {
    // Check if player bottom is colliding with platform top
    if (
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + platform.height + 5 && // small buffer
      player.vy >= 0 && // falling or stationary
      player.x + player.width / 2 >= platform.x &&
      player.x - player.width / 2 <= platform.x + platform.width
    ) {
      // Collision detected
      player.y = platform.y - player.height;
      player.vy = 0;
      player.onGround = true;

      // Check if on golden platform
      if (platform.isGolden) {
        player.onGoldenPlatform = true;
        jumpMultiplier = 2; // 2x jump height
      }
    }

    if (player.onGoldenPlatform) {
      door.active = true;
    }
  }
}

function checkDoorEntry() {
  if (!door.active || gameState !== "playing") {
    return;
  }

  let playerLeft = player.x - player.width / 2;
  let playerRight = player.x + player.width / 2;
  let playerBottom = player.y + player.height;

  if (
    playerBottom >= door.y + 10 &&
    playerLeft < door.x + door.width &&
    playerRight > door.x &&
    player.onGround
  ) {
    gameState = "won";
  }
}

// ============================================================
// drawPlatforms()
// Draws all platforms with special shining effect for golden one
// ============================================================
function drawPlatforms() {
  for (let platform of platforms) {
    if (platform.isGolden) {
      // Golden platform with shining effect
      let shimmer = sin(frameCount * 0.08) * 25;
      fill(255, 215 + shimmer, 80);
      stroke(255, 220, 80);
      strokeWeight(2);
      rect(platform.x, platform.y, platform.width, platform.height, 6);

      // Sparkles on the golden platform
      noStroke();
      fill(255, 255, 180, 180);
      for (let i = 0; i < 3; i++) {
        let sparkleX = platform.x + 20 + i * 50;
        let sparkleY = platform.y + random(-6, platform.height - 6);
        ellipse(sparkleX, sparkleY, 6, 6);
      }
    } else {
      fill(platform.color);
      noStroke();
      rect(platform.x, platform.y, platform.width, platform.height, 4);
    }
  }
}

// ============================================================
// drawDoor()
// Draws the door once the golden platform has been reached
// ============================================================
function drawDoor() {
  if (!door.active) {
    return;
  }

  push();
  fill(80, 50, 20);
  stroke(180, 120, 70);
  strokeWeight(5);
  rect(door.x, door.y, door.width, door.height, 8);

  // Door panel details
  noStroke();
  fill(120, 80, 40);
  rect(door.x + 10, door.y + 10, door.width - 20, door.height - 20, 6);

  // Golden doorknob
  fill(255, 215, 0);
  ellipse(door.x + door.width - 16, door.y + door.height / 2, 10, 10);
  pop();
}

// ============================================================
// drawPlayer()
// Draws the player character using the image
// ============================================================
function drawPlayer() {
  if (characterImg) {
    image(
      characterImg,
      player.x - player.width / 2,
      player.y,
      player.width,
      player.height,
    );
  } else {
    // Fallback rectangle if image not loaded
    fill(255, 100, 100);
    rect(player.x - player.width / 2, player.y, player.width, player.height);
  }
}

// ============================================================
// drawHUD()
// Displays game instructions and jump multiplier indicator
// ============================================================
function drawHUD() {
  textStyle(BOLD);
  textSize(16);
  textAlign(LEFT);
  fill(255);
  stroke(0);
  strokeWeight(3);
  text("MOVE: Arrow Keys or WASD   JUMP: W or Up Arrow", 16, 30);

  if (player.onGoldenPlatform) {
    fill(255, 215, 0);
    stroke(30, 20, 0);
    strokeWeight(4);
    textSize(20);
    text("2X JUMP POWER!", 16, 60);
    fill(255);
    stroke(0);
    strokeWeight(3);
    textSize(14);
    text("A shiny door appears on the ground below! Enter it to win.", 16, 85);
  }
  noStroke();
}

// ============================================================
// drawVictoryScreen()
// Japanese-themed victory screen with sakura and gate colors
// ============================================================
function drawVictoryScreen() {
  // Background with gradient effect (dark to light pink)
  background(200);

  // Create a semi-transparent overlay
  fill(255, 192, 203, 180); // light pink with transparency
  rect(0, 0, width, height);

  // Draw decorative sakura and gate elements
  drawDecorations();

  // Main victory text
  fill(200, 50, 50); // dark red (gate color)
  textAlign(CENTER, CENTER);
  textSize(80);
  textStyle(BOLD);
  text("YOU WON!", width / 2, height / 2 - 100);

  // Subtitle
  textStyle(NORMAL);
  fill(100, 50, 100); // purple
  textSize(32);
  text("Sushi Go Master!", width / 2, height / 2 + 40);

  // Instructions
  fill(50);
  textSize(20);
  text("Press R to restart", width / 2, height / 2 + 120);
}

// ============================================================
// drawDecorations()
// Draws sakura flowers and gate elements
// ============================================================
function drawDecorations() {
  // Draw sakura flowers (pink circles)
  drawSakuraFlowers();

  // Draw simple gate silhouette (red)
  drawGateElement();
}

function drawSakuraFlowers() {
  fill(255, 150, 180, 200); // light pink
  noStroke();

  // Random sakura flowers scattered around
  randomSeed(42); // consistent pattern
  for (let i = 0; i < 15; i++) {
    let x = random(width);
    let y = random(height);

    // Draw simple flower (5 petals)
    for (let j = 0; j < 5; j++) {
      let angle = (TWO_PI / 5) * j;
      let px = x + cos(angle) * 20;
      let py = y + sin(angle) * 20;
      ellipse(px, py, 15, 15);
    }
    // Center
    fill(255, 200, 100, 200);
    ellipse(x, y, 12, 12);
    fill(255, 150, 180, 200);
  }
}

function drawGateElement() {
  stroke(200, 50, 50); // dark red (gate color)
  strokeWeight(8);
  noFill();

  // Simple torii gate silhouette
  // Top horizontal bar
  line(width / 2 - 150, 50, width / 2 + 150, 50);
  // Left vertical
  line(width / 2 - 100, 50, width / 2 - 100, 120);
  // Right vertical
  line(width / 2 + 100, 50, width / 2 + 100, 120);
  // Bottom horizontal bar
  line(width / 2 - 120, 120, width / 2 + 120, 120);
}

// ============================================================
// keyPressed() - Handle R key to restart
// ============================================================
function keyPressed() {
  if (key === "r" || key === "R") {
    if (gameState === "won") {
      // Reset game
      gameState = "playing";
      jumpMultiplier = 1;
      player.x = 100;
      player.y = platforms[0].y - player.height;
      player.vx = 0;
      player.vy = 0;
      player.onGround = false;
      player.onGoldenPlatform = false;
      door.active = false;
    }
  }
}
