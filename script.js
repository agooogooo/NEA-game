import {Player} from './player.js'
import {Map} from './map.js'
 
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let mousePos = { x: 0, y: 0 };
let keysPressed = [];
let player;
let map;

const mapImages = ["images/other/floor.png", "images/other/inventorySlot.png", "images/other/waste_bucket.png", "images/other/tree.png", "images/other/rocks.png"];

const playerImages = {
  forward: ["images/player/bean.png"],
  left: ["images/player/bean.png"],
  right: ["images/player/been.png"],
  back: ["images/player/been.png"],
};

const loadedImages = {};

function loadImages(images, callback) {
  let loadedCount = 0;
  const totalCount = images.length;

  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    const src = images[i];
    img.src = src;
    img.onload = function() {
      console.log("loaded", src);
      loadedImages[src] = img;
      loadedCount++;
      if (loadedCount === totalCount) {
        callback();
      }
    };
  }
}

const allImages = [...Object.values(playerImages).flat(), ...mapImages];


loadImages(allImages, function() {
  gamesetup()
});

function gamesetup(){
  player = new Player({x:500, y:375}, loadedImages)
  map = new Map(loadedImages);
  gameloop()
}

addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mousePos.x = event.clientX - rect.left;
  mousePos.y = event.clientY - rect.top;
  mousePos.x *= canvas.width / canvas.clientWidth;
  mousePos.y *= canvas.height / canvas.clientHeight;
});

addEventListener("mouseup", () => {
  console.log(`click: ${mousePos.x}, ${mousePos.y}`);
});

addEventListener("keydown", ({ key, repeat }) => {
  if (repeat) { return; }
  if (!keysPressed.includes(key.toLowerCase())) {
    keysPressed.unshift(key.toLowerCase());
  }
  console.log(keysPressed);
});

addEventListener("keyup", ({ key }) => {
  if (keysPressed.includes(key.toLowerCase())) {
    keysPressed.splice(keysPressed.indexOf(key.toLowerCase()), 1);
    console.log(keysPressed)
  }
});
function canvasMovement(){
  player.velocity.y = 0
  player.velocity.x = 0
  if(keysPressed.includes("w")){
    ctx.translate(0,5)
    player.velocity.y -= 5
  }
  if(keysPressed.includes("s")){
    ctx.translate(0,-5)
    player.velocity.y += 5
  }
  if(keysPressed.includes("a")){
    ctx.translate(5,0)
    player.velocity.x -= 5
  }
  if(keysPressed.includes("d")){
    ctx.translate(-5,0)
    player.velocity.x += 5
  }
  if(keysPressed.includes("0")){
    ctx.translate((player.position.x), (player.position.y))
    player.position.x = 0
    player.position.y = 0
  }
}

function draw(){
  map.drawBackground(ctx)
  player.draw(ctx)
  player.makeHitbox(ctx)
  map.drawForeground(ctx)
}

function update(){
  canvasMovement()
  player.update()
}

function gameloop(){
  ctx.clearRect(-100000, -100000, 10000000, 1000000)
  ctx.drawImage(loadedImages["images/other/floor.png"], 200, 200, 200, 200)
  update()
  draw()
  requestAnimationFrame(gameloop);
}
