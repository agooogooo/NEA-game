import { Player } from './player.js'
import { Map } from './map.js'
import { Inventory } from './inventory.js'


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let mousePos = { x: 0, y: 0 };
let keysPressed = [];
export let player;
export let map;
export let inventory

let startTime = Date.now();
let elapsedTime = 0;


const mapImages = ["images/other/floor.png", "images/other/inventorySlot.png", "images/other/waste_bucket.png", "images/other/tree.png", "images/other/rocks.png", "images/other/grass/grass1.png", "images/other/grass/grass2.png", "images/other/grass/grass3.png", "images/other/grass/grass4.png", "images/other/markers/level_marker.png", "images/other/bow.png", "images/player/playerBackWalk1.png", "images/player/playerBackWalk2.png", "images/player/playerFrontWalk1.png", "images/player/playerFrontWalk2.png"];

const playerImages = {
  forward: ["images/player/been.png"],
  left: ["images/player/been.png"],
  right: ["images/player/been.png"],
  back: ["images/player/playerBack.png"],
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
  player = new Player({ x: 570, y: 300 }, loadedImages, ctx)
  map = new Map(loadedImages);
  inventory = new Inventory(loadedImages, mousePos, player.position)
  map.create()
  console.log(map.mapBackground)
  gameloop()
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(570 - player.position.x, 300 - player.position.y)
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
  if (key.toLowerCase() === "e") {
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
  let maxVelocity = 0;

  let translateX = 0;
  let translateY = 0;


  if (keysPressed.includes("w")) {
    player.direction = "back"
    if (!player.collisions.up) {
      player.velocity.y = -5;
      translateY = 5;
    } else {
      player.velocity.y = Math.min(player.velocity.y, maxVelocity);
      translateY = 0;
    }
  } else if (keysPressed.includes("s")) {
    player.direction = "forward"
    if (!player.collisions.down) {
      player.velocity.y = 5;
      translateY = -5;
    } else {
      player.velocity.y = Math.max(player.velocity.y, maxVelocity);
      translateY = 0;
    }
  } else {
    player.velocity.y = 0;
    translateY = 0;
  }
  if ((keysPressed.includes("s")) && (keysPressed.includes("w"))) {
    player.velocity.y = 0;
    translateY = 0;
  }


  if (keysPressed.includes("a")) {
    player.direction = "left"
    if (!player.collisions.left) {
      player.velocity.x = -5;
      translateX = 5;
    } else {
      player.velocity.x = Math.min(player.velocity.x, maxVelocity);
      translateX = 0;
    }
  } else if (keysPressed.includes("d")) {
    player.direction = "right"
    if (!player.collisions.right) {
      player.velocity.x = 5;
      translateX = -5;
    } else {
      player.velocity.x = Math.max(player.velocity.x, maxVelocity);
      translateX = 0;
    }
  } else {
    player.velocity.x = 0;
    translateX = 0;
  }
  if ((keysPressed.includes("a")) && (keysPressed.includes("d"))) {
    player.velocity.x = 0;
    translateX = 0;
  }

  ctx.translate(translateX, translateY);
}



function drawUI() {
  ctx.font = "30px Comic Sans MS"
  ctx.fillStyle = "#424ef5"
  ctx.fillText(`Time: ${elapsedTime}s`, -100 + player.position.x, -200 + player.position.y)
}
function draw() {
  map.drawBackground(ctx)
  player.draw(ctx)
  player.makeHitbox(ctx)
  map.drawForeground(ctx)
  if (inventory.inventoryOpened === true) {
    inventory.draw(ctx)
  }
  drawUI()
}

function update(timestamp) {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  canvasMovement();
  player.update(map.obstacles, timestamp);
  inventory.position.x = player.position.x - 170;
  inventory.position.y = player.position.y - 180;

}


function gameloop(timestamp) {
  ctx.clearRect(-100000, -100000, 10000000, 1000000)
  update(timestamp)
  draw()
  requestAnimationFrame(gameloop);
}
