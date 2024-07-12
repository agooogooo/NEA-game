import { Player } from './player.js'
import { Map } from './map.js'
import {Inventory} from './inventory.js'

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let mousePos = { x: 0, y: 0 };
let keysPressed = [];
export let player;
let map;
let inventory

const mapImages = ["images/other/floor.png", "images/other/inventorySlot.png", "images/other/waste_bucket.png", "images/other/tree.png", "images/other/rocks.png", "images/other/grass/grass1.png", "images/other/grass/grass2.png", "images/other/grass/grass3.png", "images/other/grass/grass4.png"];

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

function gamesetup() {
  player = new Player({ x: 570, y: 300 }, loadedImages)
  map = new Map(loadedImages);
  inventory = new Inventory(loadedImages, mousePos)
  map.create()
  console.log(map.mapBackground)
  gameloop()
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);


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
  if (key.toLowerCase() === "e"){
    inventory.toggleInventory()
  }
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
function canvasMovement() {
  player.velocity.y = 0
  player.velocity.x = 0
  if(player.collisions.right){
    console.log("colliding")
  }
    if (keysPressed.includes("w") && (!player.collisions.up)) {
      ctx.translate(0, 5)
      player.velocity.y -= 5
    }
    if (keysPressed.includes("s") && (player.collisions.down === false)) {
      ctx.translate(0, -5)
      player.velocity.y += 5
    }
    if (keysPressed.includes("a") && (player.collisions.left === false)) {
      ctx.translate(5, 0)
      player.velocity.x -= 5
    }
    if (((keysPressed.includes("d")) && (player.collisions.right === false))) {
      ctx.translate(-5, 0)
      player.velocity.x += 5
    }
    if (keysPressed.includes("0")) {
      ctx.translate((player.position.x), (player.position.y))
      player.position.x = 0
      player.position.y = 0
  }
  player.resetCollisions()
}


function drawUI() {
  ctx.font = "30px Comic Sans MS"
  ctx.fillStyle = "#424ef5"
  ctx.fillText(player.health, -100 + player.position.x, -200 + player.position.y)
}
function draw() {
  map.drawBackground(ctx)
  player.draw(ctx)
  player.makeHitbox(ctx)
  map.drawForeground(ctx)
  if(inventory.inventoryOpened === true){
    inventory.draw(ctx)
  }
  drawUI()
}

function update() {
  canvasMovement()
  player.update()
  inventory.position.x += player.velocity.x
  inventory.position.y += player.velocity.y
}

function gameloop() {
  ctx.clearRect(-100000, -100000, 10000000, 1000000)
  update()
  draw()
  requestAnimationFrame(gameloop);
}
