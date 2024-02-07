/**
 * Helper function to handle ball-flipper collisions.
 */
export function handleFlipperCollision(ball, flipper) {
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
 * Helper function to handle ball-wall collisions.
 */
export function handleWallCollision(ball, wall) {
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

/**
 * Helper function to move the flipper.
 */
export function moveFlipper(flipper, acceleration) {
    flipper.acceleration = acceleration;

};