import { map, player } from "./script.js"
import { inventory } from "./script.js"

export class Player {
  constructor(position, loadedImages, ctx) {
    this.loadedImages = loadedImages;
    this.image = this.loadedImages["images/player/bean.png"]
    this.size = { x: 60, y: 92 };
    this.position = position;
    this.velocity = { x: 0, y: 0 };
    this.direction = "forward";
    this.state = "idle"
    this.images = {
        forward: ["images/player/playerFrontWalk1.png", "images/player/playerFrontWalk2.png", "images/player/been.png"],
        left: ["images/player/bean.png", "images/player/been.png", "images/player/bean.png"],
        right: ["images/player/bean.png", "images/player/been.png", "images/player/bean.png"],
        back: [ "images/player/playerBackWalk1.png", "images/player/playerBackWalk2.png", "images/player/playerBack.png"]
                  }
    this.hitboxSize = { x: 40, y: 40 };
    this.hitboxPosition = { x: 0, y: 0 };
    this.collisions = { up: false, down: false, left: false, right: false };
    this.health = 100;
    this.ctx = ctx
    this.currentFrameIndex = 0
    this.frameDuration = 120
    this.lastFrameChangeTime = 0
  }

  update(obstacles, currentTime) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.collisions = { up: false, down: false, left: false, right: false };
    for (const obstacle of obstacles) {
      if (obstacle.checkCollision()) {
        this.handleCollision(obstacle);
      }
    }
    if ((this.velocity.x === 0) && (this.velocity.y === 0)){
      this.state = "idle"
    }
    else{
      this.state = "moving"
    }
    if(this.state === "moving"){
      if (currentTime - this.lastFrameChangeTime >= this.frameDuration) {
        this.lastFrameChangeTime = currentTime;
        this.currentFrameIndex = (this.currentFrameIndex + 1) % this.images[this.direction].length;
        this.image = this.loadedImages[this.images[this.direction][this.currentFrameIndex]];
      }
    }
    if(this.state === "idle"){
      this.image = this.loadedImages[this.images[this.direction][2]]
    }
    
    
  }

  handleCollision(obstacle) {
    const playerHitbox = this.hitboxPosition;
    const obstacleHitbox = obstacle.hitboxPosition;

    const overlapX = Math.min(playerHitbox.x + this.hitboxSize.x, obstacleHitbox.x + obstacle.hitboxSize.x) -
      Math.max(playerHitbox.x, obstacleHitbox.x);
    const overlapY = Math.min(playerHitbox.y + this.hitboxSize.y, obstacleHitbox.y + obstacle.hitboxSize.y) -
      Math.max(playerHitbox.y, obstacleHitbox.y);

    if (overlapX < overlapY) {
      if (playerHitbox.x < obstacleHitbox.x) {
        if (obstacle.obstacleType === "collide") {
          this.collisions.right = true;
        }
        else if (obstacle.obstacleType === "item") {
          console.log(obstacle.coords.x)
          console.log(obstacle.coords.y)
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = "";
          inventory.add(obstacle.image)
        }
        else if (obstacle.obstacleType === "level") {
          this.level()
        }
      } else {
        if (obstacle.obstacleType === "collide") {
          this.collisions.left = true;
        }
        else if (obstacle.obstacleType === "item") {
          console.log(obstacle.coords.x)
          console.log(obstacle.coords.y)
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = "";
          inventory.add(obstacle.image)
        }
        else if (obstacle.obstacleType === "level") {
          this.level()
        }

      }
      if (obstacle.obstacleType === "collide") {
        this.velocity.x = 0;
      }

    } else {
      if (playerHitbox.y < obstacleHitbox.y) {
        if (obstacle.obstacleType === "collide") {
          this.collisions.down = true
        }
        else if (obstacle.obstacleType === "item") {
          console.log(obstacle.coords.x)
          console.log(obstacle.coords.y)
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = ""
          inventory.add(obstacle.image)
        }
        else if (obstacle.obstacleType === "level") {
          this.level()
        }
      } else {
        if (obstacle.obstacleType === "collide") {
          this.collisions.up = true;
        }
        else if (obstacle.obstacleType === "item") {
          console.log(obstacle.coords.x)
          console.log(obstacle.coords.y)
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = "";
          inventory.add(obstacle.image)
        }
        else if (obstacle.obstacleType === "level") {
          this.level()
        }
      }
      if (obstacle.obstacleType === "collide") {
        this.velocity.y = 0
      }
    }
  }


  draw(ctx) {
    if (this.direction === "forward" && this.state === "moving" && this.currentFrameIndex!== 2){
      this.size.y = 96
    }
    else{
      this.size.y = 92
    }
    ctx.drawImage(this.image, this.position.x, this.position.y, this.size.x, this.size.y)
  }

  makeHitbox(ctx) {
    this.hitboxPosition.x = this.position.x + (this.size.x / 2 - this.hitboxSize.x / 2);
    this.hitboxPosition.y = this.position.y + (this.size.y - this.hitboxSize.y);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y);
  }

  level() {
    map.mapForeground =
      [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
  }

  
}
