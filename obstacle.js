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

  checkCollision(a, b) {//checks to see if there is any overlap between the hitboxes of the 2 inputted parameters
    return (
      a.hitboxPosition.x < b.hitboxPosition.x + b.hitboxSize.x &&
      a.hitboxPosition.x + a.hitboxSize.x > b.hitboxPosition.x &&
      a.hitboxPosition.y < b.hitboxPosition.y + b.hitboxSize.y &&
      a.hitboxPosition.y + a.hitboxSize.y > b.hitboxPosition.y
    )
    //returns true or false depending on if a collision has happened or not between the 2 inputted values
  }
}
