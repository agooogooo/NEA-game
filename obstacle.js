import { player } from './script.js';

export class Obstacle {
  constructor(position, size, image, hitboxSize, obstacleType, coords, level) {
    this.position = position;
    this.size = size;
    this.image = image;
    this.hitboxSize = hitboxSize;
    this.hitboxPosition = { x: 0, y: 0 };
    this.obstacleType = obstacleType
    this.coords = coords
    this.coords.x = this.coords.x + 1
    this.coords.y = this.coords.y + 1
    this.level = level
  }

  makeHitbox(ctx) {
    this.hitboxPosition.x = this.position.x + (this.size.x / 2 - this.hitboxSize.x / 2);
    this.hitboxPosition.y = this.position.y + (this.size.y - this.hitboxSize.y);
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y);
  }

  checkCollision() {
    const playerHitbox = player.hitboxPosition;
    const obstacleHitbox = this.hitboxPosition;

    return (
      playerHitbox.x < obstacleHitbox.x + this.hitboxSize.x &&
      playerHitbox.x + player.hitboxSize.x > obstacleHitbox.x &&
      playerHitbox.y < obstacleHitbox.y + this.hitboxSize.y &&
      playerHitbox.y + player.hitboxSize.y > obstacleHitbox.y
    );
  }
}
