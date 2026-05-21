# Week 2 Example 1: Movement and Gravity

## What This Example Demonstrates

> **Note for students:** This section is included in example files only to help you study. Do not include it in your Side Quest submissions.

This example introduces how to move a character using keyboard input, apply gravity, and detect collision with a floor.

- **Player object** — groups all player data (position, velocity, size, tuning values) into one object instead of separate variables
- **`keyIsDown()`** — checks if a key is held this frame, allowing smooth continuous movement; different from `keyPressed()` which fires once per press
- **Velocity** — instead of moving the player directly, we add to `vx` and `vy` each frame and then apply them to position, giving movement a natural feel
- **`constrain()`** — clamps a value within a min and max range; used here to cap horizontal speed
- **Friction** — multiplying velocity by a value less than 1 each frame gradually slows the player when no key is pressed
- **Gravity** — adding a constant to `vy` every frame pulls the player downward
- **Floor collision** — checks if the player has passed below the floor and snaps them back up
- **`noise()`** — returns smooth random values used to wobble the blob's edges organically
- **`map()`** — converts a value from one range to another; used here to turn noise output into a pixel offset
- **`push()` / `pop()`** — save and restore drawing settings so styles in one function don't affect others
- **`beginShape()` / `endShape()`** — draw a custom polygon by specifying each vertex individually

## Setup and Interaction Instructions

To run the sketch locally, open `index.html` in Google Chrome using Live Server.

**Controls:**

- Move left/right: Arrow Keys or A/D
- Jump: Up Arrow or W

**Opening the Chrome Console**

- **Windows:** Press `F12` or `Ctrl + Shift + J`, then click the **Console** tab
- **Mac:** Press `Cmd + Option + J`

The console will show any errors in your sketch.

## Assets

No external assets used. All visuals are generated with p5.js.

## References

N/A

# Sushi Go Platformer

## Project Description

This project is a p5.js platformer game inspired by the Sushi Go theme. The player controls a character and must jump across a series of platforms to reach the top of the level.

The level is designed using a custom background image and themed platform colors. Once the player reaches the top golden platform, a special mechanic is triggered where a door appears at the bottom of the screen. The player must then enter the door to complete the game.

---

## Setup and Interaction Instructions

### How to Run

1. Open the project folder in Visual Studio Code
2. Right-click `index.html`
3. Click **Open with Live Server**
4. The game will open in your browser (Google Chrome recommended)

### Controls

- **Spacebar** → Jump
- (If you added movement)
  - **A / Left Arrow** → Move left
  - **D / Right Arrow** → Move right

### Objective

- Jump across the blue platforms
- Reach the **golden platform** at the top
- This will trigger a door to appear
- Go to the door to finish the game

---

## Assets

The following assets were used:

- `background.jpg` → custom background image
- `character.png` → player character sprite

All assets are either original or sourced for educational use.

---

## References

p5.js Documentation  
https://p5js.org/reference/

Processing Foundation. (n.d.). _p5.js reference_. Retrieved from https://p5js.org/reference/

---

## Author

Deven Agnihotri
