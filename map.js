import { Obstacle } from "./obstacle.js"
import { Player } from "./player.js"
import { map, player } from "./script.js"


export class Map {
  constructor(loadedImages) {
    this.loadedImages = loadedImages
    this.position = { x: 0, y: 0, };
    this.newPosition = { x: 0, y: 0 }
    this.mapBackground = //creates an array for the map background which is randomly filled
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
    this.mapForeground = //creates an array for the foreground which gets changed depending on the level
      [["", "", "", "", "", "", "", "", "r", "", "", "", "", "i", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "i", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "k", "i", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "i", "", "", "r", "", "w", "", "", "", "", "", ""],
      ["", "", "", "", "", "r", "r", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "r", "", "i", "", "", "", "", "", "", "", "", "", "32", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "i", "r", "", "", "", "", ""],
      ["12", "", "w", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "w", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "33", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "w", "", ""],
      ["", "", "", "w", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "32", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "w", "", "", "", "", "", "", "", "r", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "w", "w", "", "r", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "r", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "r", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]

    this.size = { x: 64, y: 64 }
    this.obstacles = []//adds an obstacles array to deal with any collisions later on
    this.enemies = []
    this.enemySpawnCooldown = 2000
    this.location = "forest"
  }

  drawBackground(ctx) {
    if (this.location === "desert") {
      ctx.fillStyle = "#e7be2c"
      ctx.fillRect(this.position.x - 64, this.position.y - 64, 1920, 1280)
    }
    if (this.location === "stone") {
      ctx.fillStyle = "#2d3439"
      ctx.fillRect(this.position.x - 64, this.position.y - 64, 1920, 1280)
    }
    if (this.location === "forest") {
      for (let i = 0; i < this.mapBackground.length; i++) {//goes through every tile in the map to draw it with a random drawing which is created at the start
        for (let j = 0; j < this.mapBackground[i].length; j++) {
          this.newPosition.x = ((i - 1) * 64) + (this.position.x);
          this.newPosition.y = ((j - 1) * 64) + (this.position.y);
          //selects a different image based on the random number put in the map array
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
  }

  drawForeground(ctx) {
    this.obstacles = [];//clears the obstacles array
    for (let i = 0; i < this.mapForeground.length; i++) {//goes through every tile to be drawn and draws them depending on what they are
      for (let j = 0; j < this.mapForeground[i].length; j++) {
        this.newPosition.x = ((i - 1) * 64) + (this.position.x);
        this.newPosition.y = ((j - 1) * 64) + (this.position.y);
        if (this.mapForeground[i][j] === "w") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 200, y: 220 }, this.loadedImages["images/other/tree.png"], { x: 50, y: 80 }, "collide", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, 0);//creates and obstacle on the map setting its specific attributes
          if (this.location === "desert") {
            obstacle.image = this.loadedImages["images/other/cactus.png"]
            obstacle.size.x = 60; obstacle.size.y = 96
          }
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);//draws the obstacle
          obstacle.makeHitbox(ctx);//makes its hitbox
          this.obstacles.push(obstacle); //adds it to the obstacles array
        }
        else if (this.mapForeground[i][j] === "r") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 80, y: 30 }, this.loadedImages["images/other/rocks.png"], { x: 70, y: 20 }, "collide", { x: this.position.x, y: this.position.y }, 0);
          if (this.location === "desert") {
            if (this.mapBackground[i][j] % 2 === 0) {
              obstacle.image = this.loadedImages["images/other/skull.png"]
              obstacle.size.x = 52; obstacle.size.y = 52
            }
            else {
              obstacle.image = this.loadedImages["images/other/bone.png"]
              obstacle.size.x = 52; obstacle.size.y = 20
            }
          }
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y)
          obstacle.makeHitbox(ctx)
          this.obstacles.push(obstacle)
        }
        else if (this.mapForeground[i][j][0] === "1") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 100, y: 100 }, this.loadedImages["images/other/markers/level_marker.png"], { x: 100, y: 100 }, "level", { x: this.position.x, y: this.position.y }, this.mapForeground[i][j][1]);
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          ctx.fillStyle = "#fc0f03"
          ctx.font = "bold 48px serif"
          ctx.fillText(obstacle.level, obstacle.position.x + 38, obstacle.position.y + 62)
          //if it is a level marker then it also writes the level number
          obstacle.makeHitbox(ctx);
          this.obstacles.push(obstacle)
        }
        else if (this.mapForeground[i][j] === "i") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 50, y: 50 }, this.loadedImages["images/other/bow.png"], { x: 20, y: 20 }, "item", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, "bow");
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          this.obstacles.push(obstacle);
        }
        else if (this.mapForeground[i][j] === "k") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 36, y: 80 }, this.loadedImages["images/other/key.png"], { x: 20, y: 20 }, "item", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, "key");
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          this.obstacles.push(obstacle);
        }
        else if (this.mapForeground[i][j] > 30 && this.mapForeground[i][j] < 40) {
          this.mapForeground[i][j] -= 1
          let enemy = new Player({ x: this.newPosition.x, y: this.newPosition.y }, this.loadedImages, ctx, "enemy")
          this.enemies.push(enemy)
        }
        else if (this.mapForeground[i][j] > 40 && this.mapForeground[i][j] < 50) {
          this.mapForeground[i][j] -= 1
          let enemy = new Player({ x: this.newPosition.x, y: this.newPosition.y }, this.loadedImages, ctx, "enemy")
          enemy.images =  {//puts all the images in the order that they are animated
              forward: ["images/enemy/boss.png", "images/enemy/boss.png", "images/enemy/boss.png"],
              left: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
              right: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
              back: ["images/enemy/enemy_backwalk1.png", "images/enemy/enemy_backwalk2.png", "images/enemy/enemy_back.png"]
            }
          enemy.size.x = 92
          enemy.size.y = 112
          enemy.health = 300
          this.enemies.push(enemy)
        }
      }
    }
  }

  update() {
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].health < 1) {
        this.enemies.splice(i, 1)
        i--
        if (i === -1) {
          break
        }
      }
      this.enemies[i].state = this.chooseEnemyState(player, this.enemies[i])
    }
  }
  chooseEnemyState(player, enemy) {
    let distance = 0
    let x = enemy.position.x - player.position.x
    let y = enemy.position.y - player.position.y
    distance = Math.sqrt(x * x + y * y)
    if (distance > 1999) {
      enemy.state = "idle"
    } else if (distance > 499 && distance < 2000) {
      enemy.state = "patrol"
    } else if (distance < 500) {
      enemy.state = "chase"
    } if (enemy.health < 25) {
      enemy.state = "flee"
    }
    return enemy.state
  }

  getObstacles() {
    return this.obstacles
  }

  create() {//randomly fills the map array with number from 0-3 so that it can be different every time
    for (let i = 0; i < this.mapBackground.length; i++) {
      for (let j = 0; j < this.mapBackground[i].length; j++) {
        this.mapBackground[i][j] = (Math.floor(Math.random() * 4))
      }
    }
  }
}
