import { Obstacle } from "./obstacle.js"
import { Player } from "./player.js"
import {player} from "./script.js"

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
      ["", "", "", "", "", "39", "", "", "", "", "", "", "i", "", "", "39", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["11", "", "", "", "", "", "", "", "i", "", "", "r", "", "w", "", "", "", "", "", ""],
      ["", "", "", "", "", "r", "r", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "r", "", "i", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "i", "r", "", "", "", "", ""],
      ["12", "", "w", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "w", ""],
      ["", "", "39", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "39", ""],
      ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["13", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["14", "", "", "", "", "", "", "39", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "w", "", ""],
      ["", "", "", "w", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["15", "", "", "w", "", "", "", "", "w", "", "", "", "", "", "", "", "r", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "w", "w", "", "r", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "r", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "39", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "w", "39", "", "", "", "", "", "", "r", "", "", "", "", "", "", "r", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "39", "", "", "", ""]]
    this.size = { x: 64, y: 64 }
    this.obstacles = []//adds an obstacles array to deal with any collisions later on
    this.enemies = []
  }
  
  drawBackground(ctx) {
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

  drawForeground(ctx) {
    this.obstacles = [];//clears the obstacles array
    for (let i = 0; i < this.mapForeground.length; i++) {//goes through every tile to be drawn and draws them depending on what they are
      for (let j = 0; j < this.mapForeground[i].length; j++) {
        this.newPosition.x = ((i - 1) * 64) + (this.position.x);
        this.newPosition.y = ((j - 1) * 64) + (this.position.y);
        if (this.mapForeground[i][j] === "w") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 200, y: 220 }, this.loadedImages["images/other/tree.png"], { x: 50, y: 80 }, "collide", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, 0);//creates and obstacle on the map setting its specific attributes
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);//draws the obstacle
          obstacle.makeHitbox(ctx);//makes its hitbox
          this.obstacles.push(obstacle); //adds it to the obstacles array
        }
        if (this.mapForeground[i][j] === "r") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 80, y: 30 }, this.loadedImages["images/other/rocks.png"], { x: 70, y: 20 }, "collide", { x: this.position.x, y: this.position.y }, 0);
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          this.obstacles.push(obstacle);
        }
        if (this.mapForeground[i][j][0] === "1") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 100, y: 100 }, this.loadedImages["images/other/markers/level_marker.png"], { x: 100, y: 100 }, "level", { x: this.position.x, y: this.position.y }, this.mapForeground[i][j][1]);
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          ctx.fillStyle = "#fc0f03" 
          ctx.font = "bold 48px serif"
          ctx.fillText(obstacle.level, obstacle.position.x + 38, obstacle.position.y + 62)
          //if it is a level marker then it also writes the level number
          obstacle.makeHitbox(ctx);
          this.obstacles.push(obstacle);
        }
        if (this.mapForeground[i][j] === "i") {
          let obstacle = new Obstacle({ x: this.newPosition.x, y: this.newPosition.y }, { x: 50, y: 50 }, this.loadedImages["images/other/bow.png"], { x: 20, y: 20 }, "item", { x: (this.newPosition.x / 64), y: (this.newPosition.y / 64) }, "bow");
          ctx.drawImage(obstacle.image, obstacle.position.x, obstacle.position.y, obstacle.size.x, obstacle.size.y);
          obstacle.makeHitbox(ctx);
          this.obstacles.push(obstacle);
        }
        if (this.mapForeground[i][j] > 30 && this.mapForeground[i][j] < 40) {
          console.log(this.mapForeground[i][j])
            this.mapForeground[i][j] -= 1
          let enemy = new Player({ x: this.newPosition.x, y: this.newPosition.y }, this.loadedImages, ctx, "enemy")
          this.enemies.push(enemy)
          console.log(this.enemies)
          }
        }
      }
    }
  
  update(){
    for (let i = 0; i < this.enemies.length; i++) {
      console.log(this.enemies[i])
        if (this.enemies[i].health === 0) {
            this.enemies.splice(i, 1)
            i--
            if (i === -1){
              break
            }
        }
      this.enemies[i].state = this.chooseEnemyState(player, this.enemies[i])
      console.log(this.enemies[i].state)
    }
  }
  chooseEnemyState(player, enemy){
    let distance = 0
    let x = enemy.position.x - player.position.x
    let y = enemy.position.y - player.position.y
    distance = Math.sqrt(x*x+y*y)
    if (distance > 1999){
      enemy.state = "idle"
    }else if(distance >499 && distance < 2000){
      enemy.state = "patrol"
    }else if(distance < 500){
      enemy.state = "chase"
    }if(enemy.health < 20){
      enemy.state = "flee"
    }
    console.log(enemy.state)
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
