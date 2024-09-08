export class Inventory {
  constructor(loadedImages, mousePos, playerPos) {
    this.loadedImages = loadedImages;
    this.position = { x: 400, y: 120 };
    this.size = { x: 45, y: 45 };
    this.inventoryOpened = false;
    this.mousePos = mousePos;
    this.hoverImage = loadedImages["images/other/hover.png"];
    this.playerPos = playerPos;
    this.angle = 0



    this.inventory = [
      [ this.loadedImages["images/other/bow.png"], "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", "", ""],
    ];
    this.heldItem = this.inventory[0][0]
  }

  toggleInventory() {
    this.inventoryOpened = !this.inventoryOpened;
  }

  draw(ctx) {
    for (let i = 0; i < this.inventory[0].length; i++) {
      for (let j = 0; j < this.inventory.length; j++) {
        const invX = this.position.x + 50 * i;
        const invY = this.position.y + 50 * j;

        if ((this.mousePos.x + this.position.x - 400) > invX && (this.mousePos.x + this.position.x - 400) < invX + this.size.x &&
          (this.mousePos.y + this.position.y - 120) > invY && (this.mousePos.y + this.position.y - 120) < invY + this.size.y) {

        }
        else {
          ctx.drawImage(this.loadedImages["images/other/inventorySlot.png"], invX, invY, this.size.x, this.size.y);
        }


        const item = this.inventory[j][i];
        if (item) {
          ctx.drawImage(item, invX, invY, this.size.x, this.size.y);
        }
      }
    }
  }


  add(image) {
    for (let i = 0; i < this.inventory.length; i++) {
      for (let j = 0; j < this.inventory[i].length; j++) {
        if (this.inventory[i][j] === "") {
          this.inventory[i][j] = image;
          return
        }
      }
    }
  }
  items(ctx){
    if (this.heldItem === this.loadedImages["images/other/bow.png"]){

        const X = this.mousePos.x - 600
        const Y = this.mousePos.y - 346
        this.angle = Math.atan2(Y , X)

      const bowX = 600 + Math.cos(this.angle) * 100 
      const bowY = 346 + Math.sin(this.angle) * 100 
      
      
      ctx.save();
      ctx.translate(bowX +this.playerPos.x-570, bowY +this.playerPos.y-300);
      ctx.rotate(this.angle + 3*(Math.PI) / 4);
      ctx.drawImage(this.loadedImages["images/other/bow.png"], -22.5, -22.5, 45, 45);
      ctx.restore();
    }
  }
}
