// imports map and inventory so that they can be used in this file
import { map, player } from "./script.js"
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
      forward: ["images/player/playerFrontWalk1.png", "images/player/playerFrontWalk2.png", "images/player/been.png"],
      left: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
      right: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
      back: ["images/player/playerBackWalk1.png", "images/player/playerBackWalk2.png", "images/player/playerBack.png"]
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
  }

  update(obstacles, currentTime) {
    // Updates the player's velocity every frame
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

        
    for (const enemy of map.enemies) {
      const changeStateDuration = 500 + Math.random() * 1500//timer changes the velocity of the enemy randomly every 0.5 to 2 seconds
      if (!enemy.lastStateChangeTime || currentTime - enemy.lastStateChangeTime > changeStateDuration) {//only changes if it has been the set amount of time
        enemy.lastStateChangeTime = currentTime;

        //enemy movement based on state
        switch (enemy.state) {
          case "patrol":
            // Random velocity between -10 and 10 for both x and y
            enemy.velocity.x = (Math.random() * 2 - 1); // Random value between -2 and 2
            enemy.velocity.y = (Math.random() * 2 - 1); // Random value between -2 and 2
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

            enemy.velocity.x = Math.cos(adjustedFleeAngle) * 5; //mve away from player with speed 5
            enemy.velocity.y = Math.sin(adjustedFleeAngle) * 5;
            break;

          case "idle"://set velocity to 0 if idle
            enemy.velocity.x = 0
            enemy.velocity.y = 0
            break;
        }
        if (enemy.velocity.y > 0) {
          enemy.direction = "back"
          enemy.image = this.loadedImages["images/player/been.png"]
        }
        if (enemy.velocity.y < 0) {
          enemy.direction = "forward"
          enemy.image = this.loadedImages["images/player/playerBack.png"]
        }
      }

      //update enemy position
      enemy.position.x += enemy.velocity.x;
      enemy.position.y += enemy.velocity.y;

      //stop enemy from leaving the map in x direction
      if (enemy.position.x < -75) {
        enemy.position.x = -75;
      } else if (enemy.position.x > 1800) {
        enemy.position.x = 1800;
      }

      //stop enemy from leaving the map in y direction
      if (enemy.position.y < -120) {
        enemy.position.y = -120;
      } else if (enemy.position.y > 1100) {
        enemy.position.y = 1100;
      }
    }

    //resets the collisions
    this.collisions = { up: false, down: false, left: false, right: false };

    //checks collisions on all obstacles
    for (const obstacle of obstacles) {
      if (obstacle.checkCollision(this, obstacle)) {
        this.handleCollision(obstacle);
      }

      //check projectile collision with obstacle
      for (let i = inventory.projectiles.length - 1; i >= 0; i--) {
        const projectile = inventory.projectiles[i];
        if (obstacle.obstacleType === "collide" && obstacle.checkCollision(projectile, obstacle)) {
          inventory.projectiles.splice(i, 1);
          break; // Exit loop after removing the projectile
        }

        // Check for collision with enemies
        for (const enemy of map.enemies) {
          if (obstacle.checkCollision(projectile, enemy)) {
            inventory.projectiles.splice(i, 1);
            enemy.health -= 5;
          }
        }
      }
      // Player collision with enemies
      for (const enemy of map.enemies) {
        if (obstacle.checkCollision(this, enemy)){
        // Initialize lastDamageTime for each enemy if it doesn't exist
        if (!enemy.lastDamageTime || (currentTime - enemy.lastDamageTime > 1000)) {
          this.health -= 1  //player takes damage
          enemy.lastDamageTime = currentTime //update the last damage time    
          }
        }
      }
    }



    // Set player state based on velocity for animations
    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.state = "idle";
    } else {
      this.state = "moving";
    }

    // Handle player animations
    if (this.state === "moving") {
      if (currentTime - this.lastFrameChangeTime >= this.frameDuration) {
        this.lastFrameChangeTime = currentTime
        this.currentFrameIndex = (this.currentFrameIndex + 1) % this.images[this.direction].length
        this.image = this.loadedImages[this.images[this.direction][this.currentFrameIndex]]
      }
    } else if (this.state === "idle") {
      this.image = this.loadedImages[this.images[this.direction][2]]
    }

    // Set the held item in the inventory
    inventory.heldItem = inventory.inventory[0][0];
  }



  handleCollision(obstacle) {
    const playerHitbox = this.hitboxPosition;
    const obstacleHitbox = obstacle.hitboxPosition;

    //checks the overlap between a ny hitboxes to check which direction the collision happens in whether it is vertical or horizontal
    const overlapX = Math.min(playerHitbox.x + this.hitboxSize.x, obstacleHitbox.x + obstacle.hitboxSize.x) -
      Math.max(playerHitbox.x, obstacleHitbox.x);
    const overlapY = Math.min(playerHitbox.y + this.hitboxSize.y, obstacleHitbox.y + obstacle.hitboxSize.y) -
      Math.max(playerHitbox.y, obstacleHitbox.y);

    if (overlapX < overlapY) {//checks whether it is vertical or horizontal
      if (playerHitbox.x < obstacleHitbox.x) { //checks if it left or right
        if (obstacle.obstacleType === "collide") {//if a collision is supposed to happen it blocks movement in that direction
          this.collisions.right = true;
        }
        else if (obstacle.obstacleType === "item") { // if it is supposed to be picked up then it removes the image from the map and adds it to the inventory
          map.mapForeground[obstacle.coords.x][obstacle.coords.y] = "";
          inventory.add(obstacle.image)
        }
        else if (obstacle.obstacleType === "level") {//if there is a level marker then it changes to whichever level it is set to
          this.level()
        }
      } else {
        if (obstacle.obstacleType === "collide") {
          this.collisions.left = true;
        }
        else if (obstacle.obstacleType === "item") {
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


  draw(ctx) { // draws the player every frame
    if (this.direction === "forward" && this.state === "moving" && this.currentFrameIndex !== 2) {
      this.size.y = 96
    }//changes the sizes of the image when moving down because the sizes of the image files are different
    else {
      this.size.y = 92
    }
    for (let i = 0; i < map.enemies.length; i++) {
      let enemy = map.enemies[i]
      ctx.drawImage(enemy.image, enemy.position.x, enemy.position.y, enemy.size.x, enemy.size.y)
      enemy.makeHitbox(ctx)
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
    ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y);
  }





  level() {
    // way to easily change the background between levels or when moving to a different place
    if (map.enemies.length === 0) {
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



}



