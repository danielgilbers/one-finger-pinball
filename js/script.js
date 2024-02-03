/**
 * Service Worker initialization
 */
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' });
}
*/
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

let dot = createBall(playground.width / 2, playground.height / 2, 1);
app.stage.addChild(dot);

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

/**
 * Helper function to create a flipper.
 */
function createFlipper(x, y, width, height) {
    let flipper = new PIXI.Graphics();
    flipper.beginFill(0xffffff);
    flipper.drawRect(0, 0, width, height);
    flipper.x = x;
    flipper.y = y;
    flipper.tint = 0xff0000;
    flipper.acceleration = 0;
    flipper.pivot.x = width * 0.9;
    flipper.pivot.y = height / 2;
    flipper.rotation = -0.2;
    return flipper;
};

/**
 * Helper function to create a ball.
 */
function createBall(x, y, radius) {
    let ball = new PIXI.Graphics();
    ball.beginFill(0xffffff);
    ball.drawCircle(0, 0, radius);
    ball.x = x;
    ball.y = y;
    ball.velocity = new PIXI.Point(0, 0);
    ball.vx = 0; // Initial velocity in the x-axis
    ball.vy = 0; // Initial velocity in the y-axis
    return ball;
};

/**
 * Helper function to create a wall.
 */
function createWall(x, y, width, height) {
    let wall = new PIXI.Graphics();
    wall.beginFill(0xeeeeee);
    wall.drawRect(0, 0, width, height);
    wall.x = x;
    wall.y = y;
    return wall;
}
/**
 * Helper function to move the flipper.
 */
function moveFlipper(flipper, acceleration) {
    flipper.acceleration = acceleration;

};

/**
 * Helper function to handle ball-wall collisions.
 */
function handleWallCollision(ball, wall) {
    if (ball.x - ball.width / 2 < wall.x + wall.width && // linke Ballseite < rechte Wandseite & rechte Ballseite > linke Wandseite -> Ball auf Wand
        ball.x + ball.width / 2 > wall.x) {
        // Invert velocity to simulate bouncing off the wall
        ball.velocity.x *= -1;
    }
    if (ball.y - ball.height / 2 < wall.y + wall.height &&
        ball.y + ball.height / 2 > wall.y) {
        ball.velocity.y *= -1;
    }
};

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
 * Helper function to handle ball-flipper collisions.
 */
function handleFlipperCollision(ball, flipper) {
    if (flipper.containsPoint(new PIXI.Point(ball.x, ball.y + ball.height / 2))) {
        ball.velocity.y *= -1;
        ball.velocity.y -= flipper.acceleration * 100;
    }
    /*
    let ballBounds = ball.getBounds();

    let flipperBounds = getRotatedBounds(flipper);
    console.log(flipperBounds);

    if (
        ballBounds.x + ballBounds.width >= flipperBounds.x &&
        ballBounds.x <= flipperBounds.x + flipperBounds.width &&
        ballBounds.y + ballBounds.height >= flipperBounds.y &&
        ballBounds.y <= flipperBounds.y + flipperBounds.height
    ) {
        console.log("Ball touches flipper!");
    }
    */
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

