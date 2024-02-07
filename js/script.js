import { handleFlipperCollision, handleWallCollision, moveFlipper } from "./physics.js";
import { createBall, createFlipper, createWall } from "./builder.js";

/**
 * Service Worker initialization
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' });
};

// get container
let divPinball = document.getElementById("pinball");

// Scale the playground
let playground = scalePlayground(divPinball.offsetWidth, divPinball.offsetHeight);

// Create Pixi.js application
let app = new PIXI.Application({ background: '#222', width: playground.width, height: playground.height });
divPinball.appendChild(app.view);

// speed of flipper
const movementSpeed = 0.5;

const gravity = 0.05;
const drag = 0.99;

// Flipper
let flipperWidth = playground.width * 0.8;
let flipperHeight = playground.height * 0.03;
let flipper = createFlipper(playground.width - flipperWidth * 0.1, (playground.height * 0.8) - flipperHeight, flipperWidth, flipperHeight);
app.stage.addChild(flipper);

// Ball
let ball = createBall(playground.width / 2, playground.height / 2, playground.width * 0.02);
app.stage.addChild(ball);

// Walls
let wallThickness = playground.width * 0.015;
let leftWall = createWall(0, 0, wallThickness, playground.height);
let rightWall = createWall(playground.width - wallThickness, 0, wallThickness, playground.height);
let topWall = createWall(0, 0, playground.width, wallThickness);
let bottomWall = createWall(0, playground.height - wallThickness, playground.width, wallThickness);
app.stage.addChild(leftWall, rightWall, topWall, bottomWall);

// Input events
document.addEventListener('pointerdown', () => moveFlipper(flipper, 0.3));
document.addEventListener('pointerup', () => moveFlipper(flipper, -0.3));

// Animation ticker
app.ticker.add((delta) => {
    // Update flipper rotation
    if (flipper.rotation > 0.2) {
        flipper.rotation = 0.2;
        flipper.acceleration = 0
    }
    else if (flipper.rotation < -0.2) {
        flipper.rotation = -0.2;
        flipper.acceleration = 0
    }
    flipper.rotation += flipper.acceleration * delta;

    // Ball Drag
    ball.velocity.x *= drag;
    ball.velocity.y = ball.velocity.y * drag + gravity;

    // Move the ball
    ball.x += ball.velocity.x * delta;
    ball.y += ball.velocity.y * delta;

    // Check for collisions with walls
    handleWallCollision(ball, leftWall);
    handleWallCollision(ball, rightWall);
    handleWallCollision(ball, topWall);
    handleWallCollision(ball, bottomWall);

    // Check for collisions with walls
    handleFlipperCollision(ball, flipper);
    /*
    if (flipper.acceleration != 0) {
        // console.log(flipper.getBounds());
        dot.x = flipper.getBounds().x;
        dot.y = flipper.getBounds().y;
    }
    */
    if (ball.y + ball.width / 2 > bottomWall.y) {
        ball.y = bottomWall.y - ball.width / 2;
    };
});

// Helper function to get rotated bounds
function getRotatedBounds(sprite) {
    let bounds = sprite.getLocalBounds();

    let x = sprite.x - sprite.width * sprite.pivot.x;
    let y = sprite.y - sprite.height * sprite.pivot.y;

    let xRotated = Math.cos(sprite.rotation) * x - Math.sin(sprite.rotation) * y;
    let yRotated = Math.sin(sprite.rotation) * x + Math.cos(sprite.rotation) * y;

    bounds.x = xRotated;
    bounds.y = yRotated;

    return bounds;
};

/**
 * Calculate playground scale in 9 / 16 aspect ratio
 * 
 * @param {number} width Usable width
 * @param {number} height usable height
 * @returns Object with width and height properties
 */
function scalePlayground(width, height) {
    if ((width / height) <= 9 / 16) {
        return { width: width, height: (width / 9 * 16) };
    }
    return { width: (height / 16 * 9), height: height };
};