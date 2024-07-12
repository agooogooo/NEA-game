import { player } from './script.js'
export class Obstacle {
  constructor(position, size, image, hitboxSize) {
    this.position = position
    this.size = size
    this.image = image
    this.hitboxSize = hitboxSize
    this.hitboxPosition = { x: 0, y: 0, }
  }
  makeHitbox(ctx) {
    this.hitboxPosition.x = this.position.x + (this.size.x / 2 - this.hitboxSize.x / 2)
    this.hitboxPosition.y = this.position.y + (this.size.y - this.hitboxSize.y)
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y)
  }

  checkCollision() {

    const playerHitbox = player.hitboxPosition;
    const playerSize = player.hitboxSize;

    if (playerHitbox.x + playerSize.x > this.hitboxPosition.x &&
        playerHitbox.x < this.hitboxPosition.x + this.hitboxSize.x &&
        playerHitbox.y < this.hitboxPosition.y + this.hitboxSize.y &&
        playerHitbox.y + playerSize.y > this.hitboxPosition.y) {
      if (playerHitbox.x + playerSize.x <= this.hitboxPosition.x + player.velocity.x) {
        player.collisions.right = true;
      }
    }
  }
}
