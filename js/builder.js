/**
 * Helper function to create a ball.
 */
export function createBall(x, y, radius) {
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
 * Helper function to create a flipper.
 */
export function createFlipper(x, y, width, height) {
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
 * Helper function to create a wall.
 */
export function createWall(x, y, width, height) {
    let wall = new PIXI.Graphics();
    wall.beginFill(0xeeeeee);
    wall.drawRect(0, 0, width, height);
    wall.x = x;
    wall.y = y;
    return wall;
};