export class Inventory {
  constructor(loadedImages, mousePos) {
    this.inventory = [1, 2, 3, 4, 5, 6];
    this.loadedImages = loadedImages
    this.position = { x: 100, y: 100 };
    this.size = { x: 45, y: 45 };
    this.inventoryOpened = false
    this.mousePos = mousePos
    this.hoverImage = loadedImages["images/other/hover.png"]
  }

  toggleInventory() {
    this.inventoryOpened = !this.inventoryOpened;
  }


  draw(ctx) {
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 5; j++) {
        const invX = this.position.x + 50 * i;
        const invY = this.position.y + 50 * j; 
        if (this.mousePos.x > invX && this.mousePos.x < invX + this.size.x && 
            this.mousePos.y > invY && this.mousePos.y < invY + this.size.y) {console.log(invX, invY)
        }
        else{
          ctx.drawImage(this.loadedImages["images/other/inventorySlot.png"], invX, invY, this.size.x, this.size.y);
        }
      }
    }
  }
}
