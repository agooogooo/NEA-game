export class Inventory {
  constructor(loadedImages, mousePos, playerPos) {
    this.loadedImages = loadedImages;
    this.position = { x: 400, y: 120 };
    this.size = { x: 45, y: 45 };
    this.inventoryOpened = false;
    this.mousePos = mousePos;
    this.hoverImage = loadedImages["images/other/hover.png"];
    this.playerPos = playerPos;



    this.inventory = [
      ["", "", "", "", "", "", "", "", "", "", ""],
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
  items(){
    
  }
}
