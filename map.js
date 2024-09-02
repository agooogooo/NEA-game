import { Obstacle } from "./obstacle.js"


export class Map {
  constructor(loadedImages) {
    this.loadedImages = loadedImages
    this.position = { x: 0, y: 0, };
    this.newPosition = { x: 0, y: 0 }
    this.mapBackground =
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
    this.mapForeground =
      [["", "", "", "", "", "", "", "", "r", "", "", "", "", "i", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "i", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "i", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["11", "", "", "", "", "", "", "", "i", "", "", "r", "", "w", "", "", "", "", "", ""],
      ["", "", "", "", "", "r", "r", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "r", "", "i", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "i", "r", "", "", "", "", ""],
      ["12", "", "w", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "w", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["13", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["14", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "w", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "r", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "r", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
    this.size = { x: 64, y: 64 };
    this.obstacles = [];
  }
  drawBackground(ctx) {
    for (let i = 0; i < this.mapBackground.length; i++) {
      for (let j = 0; j < this.mapBackground[i].length; j++) {
        this.newPosition.x = ((i - 1) * 64) + (this.position.x);
        this.newPosition.y = ((j - 1) * 64) + (this.position.y);
        if (this.mapBackground[i][j] === 0) {
          ctx.drawImage(this.loadedImages["images/other/grass/grass1.png"], this.newPosition.x, this.newPosition.y, this.size.x, this.size.y);
        }
        if (this.mapBackground[i][j] === 1) {
          ctx.drawImage(this.loadedImages["images/other/grass/grass2.png"], this.newPosition.x, this.newPosition.y, this.size.x, this.size.y);
        }
        if (this.mapBackground[i][j] === 2) {
          ctx.drawImage(this.loadedImages["images/other/grass/grass3.png"], this.newPosition.x, this.newPosition.y, this.size.x, this.size.y);
        }
        if (this.mapBackground[i][j] === 3) {
          ctx.drawImage(this.loadedImages["images/other/grass/grass4.png"], this.newPosition.x, this.newPosition.y, this.size.x, this.size.y);
        }
      }
    }
  }

  drawForeground(ctx) {
    this.obstacles = [];
    for (let i = 0; i < this.mapForeground.length; i++) {
      for (let j = 0; j < this.mapForeground[i].length; j++) {
        this.newPosition.x = ((i - 1) * 64) + (this.position.x);
        this.newPosition.y = ((j - 1) * 64) + (this.position.y);
        if (this.mapForeground[i][j] === "w") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 200, y: 220 }, this.loadedImages["images/other/tree.png"], { x: 50, y: 80 }, "collide", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, 0);
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          obstacle.checkCollision();
          this.obstacles.push(obstacle);
        }
        if (this.mapForeground[i][j] === "r") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 80, y: 30 }, this.loadedImages["images/other/rocks.png"], { x: 70, y: 20 }, "collide", { x: this.position.x, y: this.position.y }, 0);
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          obstacle.checkCollision();
          this.obstacles.push(obstacle);
        }
        if (this.mapForeground[i][j][0] === "1") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 100, y: 100 }, this.loadedImages["images/other/markers/level_marker.png"], { x: 100, y: 100 }, "level", { x: this.position.x, y: this.position.y }, this.mapForeground[i][j][1]);
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          ctx.fillStyle = "#fc0f03"
          ctx.font = "bold 48px serif"
          ctx.fillText(obstacle.level, obstacle.position.x + 38, obstacle.position.y + 62)
          obstacle.makeHitbox(ctx);
          obstacle.checkCollision();
          this.obstacles.push(obstacle);
        }
        if (this.mapForeground[i][j] === "i") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 50, y: 50 }, this.loadedImages["images/other/bow.png"], { x: 20, y: 20 }, "item", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, "bow");
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          obstacle.checkCollision();
          this.obstacles.push(obstacle);
        }
      }
    }
  }


  getObstacles() {
    return this.obstacles;
  }

  create() {
    for (let i = 0; i < this.mapBackground.length; i++) {
      for (let j = 0; j < this.mapBackground[i].length; j++) {
        this.mapBackground[i][j] = (Math.floor(Math.random() * 4))
      }
    }
  }
}
