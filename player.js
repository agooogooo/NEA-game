// import {collisions} from './collisions.js'
export class Player{
  constructor(position, loadedImages){
    this.loadedImages = loadedImages
    this.size = { x: 70, y: 70 };
    this.position = position
    this.velocity = { x: 0, y: 0 };
    this.direction = "forward"
    this.hitboxSize = {x:40, y:40}
    this.hitboxPosition = {x:0, y:0,}
    this.collisions = {up:false, down:false, left:false, right:false}
    this.health = 100
  }
  update(){
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
  }
  draw(ctx){
    ctx.drawImage(this.loadedImages["images/player/been.png"], this.position.x, this.position.y, this.size.x, this.size.y);
  }
  makeHitbox(ctx){
    this.hitboxPosition.x = this.position.x + (this.size.x/2 - this.hitboxSize.x/2)
    this.hitboxPosition.y = this.position.y +(this.size.y - this.hitboxSize.y)
    ctx.strokeStyle = 'red';
    ctx.strokeRect(this.hitboxPosition.x, this.hitboxPosition.y, this.hitboxSize.x, this.hitboxSize.y)
  }
}
