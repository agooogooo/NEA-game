// imports map and inventory so that they can be used in this file
import { map } from "./script.js"
import { inventory } from "./script.js"

export class Player {
  constructor(position, loadedImages, ctx, person) {
    this.loadedImages = loadedImages
    this.size = { x: 60, y: 92 }
    this.position = position
    this.velocity = { x: 0, y: 0 }
    this.direction = "forward"
    this.state = "idle"
    this.images = {//puts all the images in the order that they are animated
      forward: ["images/enemy/enemy_frontwalk1.png", "images/enemy/enemy_frontwalk2.png", "images/enemy/enemy_front.png"],
      left: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
      right: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
      back: ["images/enemy/enemy_backwalk1.png", "images/enemy/enemy_backwalk2.png", "images/enemy/enemy_back.png"]
    }
    this.image = this.loadedImages["images/player/been.png"]
    this.hitboxSize = { x: 40, y: 40 }
    this.hitboxPosition = { x: 0, y: 0 }
    this.collisions = { up: false, down: false, left: false, right: false }
    this.health = 100
    this.ctx = ctx
    //attributes for player animations
    this.currentFrameIndex = 0
    this.frameDuration = 120
    this.lastFrameChangeTime = 0
    //other attributes
    this.person = person
    this.lastStateChangeTime = 0
    this.lastDamageTime = 0
    this.levelcounter = 0
    this.instructions = { 0: 'defeat the enemies and collect the key', 1: 'defeat the enemies and collect the key', 2: 'defeat the enemies and collect the key' , 3: 'defeat the enemies and collect the key', 4: 'defeat the enemies and collect the key'}
    this.keyCollected = false
  }

  update(obstacles, currentTime) {
    // Updates the player's velocity every frame
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    for (const enemy of map.enemies) {
      if (enemy.velocity.y > 0) {
        enemy.direction = "forward"
      } else if (enemy.velocity.y < 0) {
        enemy.direction = "back"
      }
      const changeStateDuration = 500 + Math.random() * 1500//timer changes the velocity of the enemy randomly every 0.5 to 2 seconds
      if (!enemy.lastStateChangeTime || currentTime - enemy.lastStateChangeTime > changeStateDuration) {//only changes if it has been the set amount of time
        enemy.lastStateChangeTime = currentTime;

        //enemy movement based on state
        switch (enemy.state) {
          case "patrol":
            // Random velocity between -10 and 10 for both x and y
            enemy.velocity.x = (Math.random() * 2 - 1)//random value between -2 and 2
            enemy.velocity.y = (Math.random() * 2 - 1) //random value between -2 and 2
            break;

          case "chase"://move towards the player at random angles
            let angleToPlayer = Math.atan2(this.position.y - enemy.position.y, this.position.x - enemy.position.x);
            let randomAngleDeviation = (Math.random() * (Math.PI / 3)) - (Math.PI / 6); //deviation within +/- 30 degrees
            let adjustedAngle = angleToPlayer + randomAngleDeviation

            enemy.velocity.x = Math.cos(adjustedAngle) * 2; //move toward player with speed 2
            enemy.velocity.y = Math.sin(adjustedAngle) * 2; //same in y direction
            break;

          case "flee"://move away from the player at random angles
            let angleFromPlayer = Math.atan2(enemy.position.y - this.position.y, enemy.position.x - this.position.x);
            let randomFleeAngleDeviation = (Math.random() * (Math.PI / 3)) - (Math.PI / 6); //deviation within +/- 15 degrees
            let adjustedFleeAngle = angleFromPlayer + randomFleeAngleDeviation

            enemy.velocity.x = Math.cos(adjustedFleeAngle) * 5; //move away from player with speed 5
            enemy.velocity.y = Math.sin(adjustedFleeAngle) * 5;
            break;

          case "idle"://set velocity to 0 if idle
            enemy.velocity.x = 0
            enemy.velocity.y = 0
            break;
        }

      }

      //update enemy position
      enemy.position.x += enemy.velocity.x
      enemy.position.y += enemy.velocity.y

      enemy.animate(currentTime)

      //stop enemy from leaving the map in x direction
      if (enemy.position.x < -75) {
        enemy.position.x = -75
      } else if (enemy.position.x > 1800) {
        enemy.position.x = 1800
      }

      //stop enemy from leaving the map in y direction
      if (enemy.position.y < -120) {
        enemy.position.y = -120;
      } else if (enemy.position.y > 1100) {
        enemy.position.y = 1100;
      }


      for (const obstacle of obstacles) {
        if (obstacle.checkCollision(enemy, obstacle) && obstacle.obstacleType === "collide") {
          // Reverse enemy direction when it collides with an obstacle
          enemy.velocity.x *= -1; // Reverse x direction
          enemy.velocity.y *= -1; // Reverse y direction

          // Slightly adjust position to prevent getting stuck in the obstacle
          enemy.position.x += enemy.velocity.x * 2; // Move enemy back a bit
          enemy.position.y += enemy.velocity.y * 2;
        }
      }
    }





    //resets the collisions
    this.collisions = { up: false, down: false, left: false, right: false }

    //checks collisions on all obstacles
    for (const obstacle of obstacles) {
      if (obstacle.checkCollision(this, obstacle)) {
        this.handleCollision(obstacle)
      }

      //check projectile collision with obstacle
      for (let i = inventory.projectiles.length - 1; i >= 0; i--) {
        const projectile = inventory.projectiles[i];
        if (obstacle.obstacleType === "collide" && obstacle.checkCollision(projectile, obstacle)) {
          inventory.projectiles.splice(i, 1)
          break; // Exit loop after removing the projectile
        }

        // Check for collision with enemies
        for (const enemy of map.enemies) {
          if (obstacle.checkCollision(projectile, enemy)) {
            inventory.projectiles.splice(i, 1)
            enemy.health -= 10
          }
        }
      }

      // Player collision with enemies
      for (const enemy of map.enemies) {
        if (obstacle.checkCollision(this, enemy)) {
          // Initialize lastDamageTime for each enemy if it doesn't exist
          if (!enemy.lastDamageTime || (currentTime - enemy.lastDamageTime > 1000)) {
            this.health -= 5  //player takes damage
            enemy.lastDamageTime = currentTime //update the last damage time    
          }
        }
      }
    }



    // Set player state based on velocity for animations
    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.state = "idle"
    } else {
      this.state = "moving"
    }

    this.animate(currentTime)

    // Set the held item in the inventory
    inventory.heldItem = inventory.inventory[0][0]
  }


  handleCollision(obstacle) {
    const playerHitbox = this.hitboxPosition
    const obstacleHitbox = obstacle.hitboxPosition

    //checks the overlap between a ny hitboxes to check which direction the collision happens in whether it is vertical or horizontal
    const overlapX = Math.min(playerHitbox.x + this.hitboxSize.x, obstacleHitbox.x + obstacle.hitboxSize.x) -
      Math.max(playerHitbox.x, obstacleHitbox.x)
    const overlapY = Math.min(playerHitbox.y + this.hitboxSize.y, obstacleHitbox.y + obstacle.hitboxSize.y) -
      Math.max(playerHitbox.y, obstacleHitbox.y)

    if (overlapX < overlapY) {//checks whether it is vertical or horizontal
      if (playerHitbox.x < obstacleHitbox.x) { //checks if it left or right
        if (obstacle.obstacleType === "collide") {//if a collision is supposed to happen it blocks movement in that direction
          this.collisions.right = true;
        }
        else if (obstacle.obstacleType === "item") { // if it is supposed to be picked up then it removes the image from the map and adds it to the inventory
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = ""
          inventory.add(obstacle.image)
          if (obstacle.level === "key") {
            this.keyCollected = "true"
          }
        }
        else if (obstacle.obstacleType === "level") {//if there is a level marker then it changes to whichever level it is set to
          this.level()
        }
      } else {
        if (obstacle.obstacleType === "collide") {
          this.collisions.left = true;
        }
        else if (obstacle.obstacleType === "item") {
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = ""
          inventory.add(obstacle.image)
          if (obstacle.level === "key") {
            this.keyCollected = "true"
          }
        }
        else if (obstacle.obstacleType === "level") {
          this.level()
        }

      }
      if (obstacle.obstacleType === "collide") {
        this.velocity.x = 0
      }

    } else {
      if (playerHitbox.y < obstacleHitbox.y) {
        if (obstacle.obstacleType === "collide") {
          this.collisions.down = true
        }
        else if (obstacle.obstacleType === "item") {
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = ""
          inventory.add(obstacle.image)
          if (obstacle.level === "key") {
            this.keyCollected = "true"
          }
        }
        else if (obstacle.obstacleType === "level") {
          this.level()
        }
      } else {
        if (obstacle.obstacleType === "collide") {
          this.collisions.up = true;
        }
        else if (obstacle.obstacleType === "item") {
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = "";
          inventory.add(obstacle.image)
          if (obstacle.level === "key") {
            this.keyCollected = "true"
          }
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


  draw(ctx) { // draws the player every frame
    for (let i = 0; i < map.enemies.length; i++) {
      let enemy = map.enemies[i]
      ctx.drawImage(enemy.image, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y)
      enemy.makeHitbox(ctx)
      ctx.fillStyle = "#424ef5"
      ctx.textAlign = "center"
      ctx.fillText(`${enemy.health}`, enemy.position.x + 30, enemy.position.y)
      if (enemy.state === "flee") {
        ctx.fillText(`AHHHHHHH`, enemy.position.x + 30, enemy.position.y - 30)
      }
    }

    ctx.drawImage(this.image, this.position.x, this.position.y, this.size.x, this.size.y)
    inventory.items(ctx)
  }

  makeHitbox(ctx) {
    // creates the hitbox for the player and draws it on the map
    this.hitboxPosition.x = this.position.x + (this.size.x / 2 - this.hitboxSize.x / 2);
    this.hitboxPosition.y = this.position.y + (this.size.y - this.hitboxSize.y);
    ctx.strokeStyle = 'red';
    //ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y);
  }



  animate(currentTime) {
    // Handle player animations
    if (this.state === "moving" || this.state === "flee" || this.state === "patrol" || this.state === "chase") {

      if (currentTime - this.lastFrameChangeTime >= this.frameDuration) {
        this.lastFrameChangeTime = currentTime
        this.currentFrameIndex = (this.currentFrameIndex + 1) % this.images[this.direction].length
        //change animation frame every frame
        this.image = this.loadedImages[this.images[this.direction][this.currentFrameIndex]]
      }
    } else if (this.state === "idle") {//if the player is not moving then it uses a still image
      this.image = this.loadedImages[this.images[this.direction][2]]
    }
  }


  level() {
    // way to easily change the background between levels or when moving to a different place
    if ((this.keyCollected) && map.enemies.length ===0) {
      this.keyCollected = false
      this.levelcounter += 1
      if (this.levelcounter === 0){
        document.getElementById("game-container").style.backgroundColor = "#76A668";
        document.body.style.backgroundColor = "#76A668"
        map.location = "forest"
        map.mapForeground = [["", "", "", "", "", "", "", "", "r", "", "", "", "", "i", "", "", "", "", "", ""],
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
      }
      if (this.levelcounter === 1) {
        document.getElementById("game-container").style.backgroundColor = "#e7be2c";
        document.body.style.backgroundColor = "#e7be2c";
        map.location = "desert"
        map.mapForeground = [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", "", ""],
          ["", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "31", "", "w", "", "r", "", "", "", "", "", "", "", "", "", "w", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", ""],
          ["", "", "r", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "r", "", "", "", "34", "", "", "r", "", ""],
          ["", "13", "", "", "", "", "", "", "r", "r", "31", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "r", "r", "r", "r", "", "", "", "", "", "w", "", ""],
          ["", "", "", "", "", "", "w", "", "31", "r", "k", "r", "31", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "r", "r", "r", "", "", "", "", "", "", "", ""],
          ["", "w", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "31", "", "", "", "", "r", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", ""],
          ["", "", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "w", "", "", "", "", "r", "", "", "", "", "", "", "", "", "31", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "32", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "r", "", "w", "", "", "", "", "", "r", "", "", "", ""],
          ["", "", "w", "", "", "w", "", "", "33", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", ""]]
      }
      if (this.levelcounter === 2) {
        document.getElementById("game-container").style.backgroundColor = "#76A668";
        document.body.style.backgroundColor = "#76A668"
        map.location = "forest"
        map.mapForeground = [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "33", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "w", "", "", "", "r", "", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "r", "", "r", "r", "", "33", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "", "33", "", "", "", "", "", "", ""],
          ["", "", "w", "", "33", "", "", "", "", "", "w", "", "", "r", "", "r", "r", "", "", ""],
          ["", "14", "", "", "", "", "w", "", "", "", "", "", "r", "", "", "k", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "r", "r", "", "r", "r", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "r", "", "r", "", "33"],
          ["", "", "w", "", "33", "", "", "", "", "w", "", "", "", "r", "", "r", "", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "w", "", "", "", "33", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "41", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "w", "", "33", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "w", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "w", "", "", "", "", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "", "w", "w", "", "", "", "", "", ""],
          ["", "", "w", "", "33", "", "", "", "", "w", "", "", "", "", "", "", "", "w", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "", "w", "", "", "", "", "", "", ""],
          ["", "", "w", "", "33", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]]
      }
      if (this.levelcounter === 3) {
        document.body.style.backgroundColor = "#e7be2c";
        document.getElementById("game-container").style.backgroundColor = "#e7be2c";
        map.location = "desert"
        map.mapForeground =
        [["", "", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", ""],
         ["", "w", "", "", "", "", "r", "", "", "", "", "", "", "", "r", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "32", ""],
         ["", "", "r", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", "r", "", ""],
         ["", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", ""],
         ["", "", "", "31", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "", "", "", "", "", "w", "r", "", "", "", "33", "", ""],
         ["", "", "", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", ""],
         ["", "15", "", "", "", "", "", "w", "", "", "32", "", "", "", "", "r", "", "", "", ""],
         ["", "", "", "r", "", "41", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "", "w", "k", "", "", "", "r", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "", "", "r", "w", "", "41", "", "", "", "", "32", "", ""],
         ["", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", ""],
         ["", "", "", "", "", "", "", "r", "", "", "", "33", "", "", "", "", "", "", "", ""],
         ["", "", "w", "", "41", "", "", "", "", "r", "", "", "", "", "", "", "", "w", "", ""],
         ["", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "r", "", "", "", "", "w", "", "32", "", "", "", "", ""],
         ["", "", "r", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "w", "", "", "", "32", "", "", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "r", "", "", "", "", "", "", "w", "", "", "", "", ""],
         ["", "", "", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r"],
         ["", "r", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "", "r", "", "33", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "w", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "w", "", "", ""],
         ["", "", "", "", "", "", "", "", "", "w", "", "", "", "", "r", "", "", "", "", ""],
         ["", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "33", "", "w", "", ""],
         ["", "", "w", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", "", ""],
         ["", "", "", "", "", "", "r", "", "", "", "32", "", "", "", "", "", "w", "", "", ""],
         ["", "", "", "", "", "", "", "", "", "", "", "", "", "w", "", "", "", "", "", ""]]
      }
      if (this.levelcounter === 4){
        document.getElementById("game-container").style.backgroundColor = "#2d3439";
        document.body.style.backgroundColor = "#2d3439"
        map.location = "stone"
        map.mapForeground =
          [["", "", "r", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", ""],
           ["", "r", "", "", "", "", "r", "", "", "", "", "", "", "", "r", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "r", ""],
           ["", "", "r", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "r", "", ""],
           ["", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", ""],
           ["", "", "", "41", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "", "", "", "", "", "r", "r", "", "", "", "41", "", ""],
           ["", "", "", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
           ["", "15", "", "", "", "", "", "r", "", "", "", "", "", "", "", "r", "", "", "", ""],
           ["", "", "", "r", "", "41", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "", "r", "k", "", "", "", "r", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "", "", "r", "r", "", "", "", "", "", "", "41", "", ""],
           ["", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", ""],
           ["", "", "", "", "", "", "", "r", "", "", "", "41", "", "", "", "", "", "", "", ""],
           ["", "", "r", "", "41", "", "", "", "", "r", "", "", "", "", "", "", "", "r", "", ""],
           ["", "", "", "", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "r", "", "", "", "", "w", "", "41", "", "", "", "", ""],
           ["", "", "r", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "r", "", "", "", "", "", "", "r", "", "", "", "", ""],
           ["", "", "", "r", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "r"],
           ["", "", "", "", "", "", "", "w", "", "", "", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "", "r", "", "41", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "r", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "r", "", "", ""],
           ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", "", "", ""],
           ["", "r", "", "", "", "", "", "", "", "", "", "", "", "", "", "41", "", "r", "", ""],
           ["", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", "", "", "", "", ""],
           ["", "", "", "", "", "", "r", "", "", "", "41", "", "", "", "", "", "r", "", "", ""],
           ["", "", "", "", "", "", "", "", "", "", "", "", "", "r", "", "", "", "", "", ""]]
      }
      if (this.levelcounter === 5){
        this.state = "win"
      }
    }
  }
}


