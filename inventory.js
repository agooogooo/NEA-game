import { mouseDown } from './script.js'


export class Inventory {
  constructor(loadedImages, mousePos, playerPos) {
    this.loadedImages = loadedImages
    this.position = { x: 400, y: 120 }
    this.size = { x: 45, y: 45 }
    this.inventoryOpened = false
    this.mousePos = mousePos
    this.hoverImage = loadedImages["images/other/hover.png"]
    this.playerPos = playerPos
    this.angle = 0

    // List of projectiles
    this.projectiles = []

    // Cooldown timer for firing
    this.fireCooldown = 100; // time delay seconds
    this.lastFireTime = 0; // Time when the last projectile was fired

    this.inventory = [//array to hold any picked up items
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
    ];
    this.heldItem = this.inventory[0][0]
  }

  toggleInventory() {
    this.inventoryOpened = !this.inventoryOpened
    //changes whenever the inventory is opened or closed
  }

  draw(ctx) {
    for (let i = 0; i < this.inventory[0].length; i++) {//goes through the inventory and draws all the squares
      for (let j = 0; j < this.inventory.length; j++) {
        const invX = this.position.x + 50 * i
        const invY = this.position.y + 50 * j

        ctx.drawImage(this.loadedImages["images/other/inventorySlot.png"], invX, invY, this.size.x, this.size.y)

        const item = this.inventory[j][i]
        if (item) {
          ctx.drawImage(item, invX, invY, this.size.x, this.size.y)
        }//if there is an item in the slot then it draws an image of that item
      }
    }
  }

  add(image) {
    for (let i = 0; i < this.inventory.length; i++) {
      for (let j = 0; j < this.inventory[i].length; j++) {
        if (this.inventory[i][j] === "") {
          this.inventory[i][j] = image
          return;
        }//adds an image to the inventory when it gets picked up
      }
    }
  }

  items(ctx) {
    const currentTime = Date.now(); // Get the current time

    if (this.heldItem === this.loadedImages["images/other/bow.png"]) {
      const X = this.mousePos.x - 600
      const Y = this.mousePos.y - 346
      this.angle = Math.atan2(Y, X);//calculates the angle from the player to the mouse

      // Calculate the position of the bow relative to the player
      const bowX = 600 + Math.cos(this.angle) * 100;
      const bowY = 346 + Math.sin(this.angle) * 100;

      ctx.save();
      ctx.translate(bowX + this.playerPos.x - 570, bowY + this.playerPos.y - 300);
      ctx.rotate(this.angle + 3 * (Math.PI) / 4);//alters the rotation
      ctx.drawImage(this.loadedImages["images/other/bow.png"], -22.5, -22.5, 45, 45);

      // Check if the mouse is down and the cooldown has expired
      if (mouseDown === true && currentTime - this.lastFireTime >= this.fireCooldown) {
        // Create a new projectile at the exact position of the bow
        const projectile = new Projectile(
          this.loadedImages["images/other/tree.png"],
          bowX + this.playerPos.x - 570,
          bowY + this.playerPos.y - 300,
          this.angle
        );
        this.projectiles.push(projectile)

        // Update the lastFireTime to the current time
        this.lastFireTime = currentTime
      }

      ctx.restore()
    }

    // Update and draw each projectile
    this.projectiles.forEach((projectile, index) => {
      projectile.update()
      projectile.draw(ctx)

      // Remove the projectile if it has traveled out of bounds
      if (projectile.isOutOfBounds()) {
        this.projectiles.splice(index, 1);
      }
    })
    
  }
}

export class Projectile{
  constructor(image, x, y, angle) {
    this.image = image
    this.x = x
    this.y = y
    this.startX = x; // Store the starting position
    this.startY = y;
    this.angle = angle
    this.speed = 10 // Speed of the projectile

    // Define hitbox dimensions
    this.hitboxWidth = 30
    this.hitboxHeight = 30
    this.maxDistance = 500;
  }

  // Update the projectile's position based on its angle and speed
  update() {
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
  }

  // Draw the projectile and its hitbox on the canvas
  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle + 3 * (Math.PI) / 4)

    // Draw the projectile image
    ctx.drawImage(this.image, -22.5, -22.5, 45, 45)

    // Draw the hitbox 
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.strokeRect(
      -this.hitboxWidth / 2,
      -this.hitboxHeight / 2,
      this.hitboxWidth,
      this.hitboxHeight
    );

    ctx.restore()
  }

  // Check if the projectile is out of bounds
  isOutOfBounds() {
    // Calculate the distance traveled using the Pythagorean theorem
    const distanceTraveled = Math.sqrt(
      Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2)
    );

    // Return true if the projectile has traveled farther than maxDistance
    return distanceTraveled > this.maxDistance;
  }

  // Get the hitbox for collision detection
  getHitbox() {
    return {
      x: this.x - this.hitboxWidth / 2,
      y: this.y - this.hitboxHeight / 2,
      width: this.hitboxWidth,
      height: this.hitboxHeight,
    }
  }
}

