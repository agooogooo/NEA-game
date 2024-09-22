import { player } from './script.js'

export class Obstacle {
  constructor(position, size, image, hitboxSize, obstacleType, coords, level) {
    this.position = position
    this.size = size
    this.image = image
    //gives any attributes need for its hitbox type
    this.hitboxSize = hitboxSize
    this.hitboxPosition = { x: 0, y: 0 }
    this.obstacleType = obstacleType
    //corrects the coordinates of the obstacle
    this.coords = coords
    this.coords.x = this.coords.x + 1
    this.coords.y = this.coords.y + 1
    //defines the level if needed
    this.level = level
  }

  makeHitbox(ctx) {
    //draws and defines the hitbox of the obstacle
    this.hitboxPosition.x = this.position.x + (this.size.x / 2 - this.hitboxSize.x / 2)
    this.hitboxPosition.y = this.position.y + (this.size.y - this.hitboxSize.y)
    ctx.strokeStyle = 'blue'
    ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y);
  }

  checkCollision(a, b) {//checks to see if there is any overlap between the hitboxes
    const playerHitbox = a;
    const obstacleHitbox = b;

    return (
      playerHitbox.x < obstacleHitbox.x + this.hitboxSize.x &&
      playerHitbox.x + player.hitboxSize.x > obstacleHitbox.x &&
      playerHitbox.y < obstacleHitbox.y + this.hitboxSize.y &&
      playerHitbox.y + player.hitboxSize.y > obstacleHitbox.y
    );//returns true or false depending on if a collision has happened or not
  }
}
