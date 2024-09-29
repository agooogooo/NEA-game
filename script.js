// imports Player, Map and Inventory classes so they can be used in this file
import { Player } from './player.js'
import { Map } from './map.js'
import { Inventory } from './inventory.js'

// sets key variables before the code started to run
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let mousePos = { x: 0, y: 0 };
let keysPressed = [];
export let player;
export let map;
export let inventory

//sets a timer
let startTime = Date.now();
let elapsedTime = 0;

export let mouseDown = false

// stores all of the images so they can be loaded
const mapImages = ["images/other/floor.png", "images/other/inventorySlot.png", "images/other/waste_bucket.png", "images/other/tree.png", "images/other/rocks.png", "images/other/grass/grass1.png", "images/other/grass/grass2.png", "images/other/grass/grass3.png", "images/other/grass/grass4.png", "images/other/markers/level_marker.png", "images/other/bow.png", "images/player/playerBackWalk1.png", "images/player/playerBackWalk2.png", "images/player/playerFrontWalk1.png", "images/player/playerFrontWalk2.png", "images/enemy/enemy_front.png", "images/enemy/enemy_back.png", "images/enemy/enemy_backwalk1.png", "images/enemy/enemy_backwalk2.png", "images/enemy/enemy_frontwalk2.png", "images/enemy/enemy_frontwalk1.png"]

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

  for (let i = 0; i < images.length; i++) { //goes through the array
    const img = new Image();
    const src = images[i];
    img.src = src;
    img.onload = function() { //loads in all of the images 
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
  player = new Player({ x: 570, y: 300 }, loadedImages, ctx, "player") //defines key classes as variables
  player.images = {//puts all the images in the order that they are animated
      forward: ["images/player/playerFrontWalk1.png", "images/player/playerFrontWalk2.png", "images/player/been.png"],
      left: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
      right: ["images/player/been.png", "images/player/been.png", "images/player/been.png"],
      back: ["images/player/playerBackWalk1.png", "images/player/playerBackWalk2.png", "images/player/playerBack.png"]
    }
  map = new Map(loadedImages);
  inventory = new Inventory(loadedImages, mousePos, player.position, mouseDown)
  map.create() //creates the map before anything else happens
  gameloop()
}

function resizeCanvas() { //a function that resizes the canvas so that the player is always centred
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.translate(570 - player.position.x, 300 - player.position.y)
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);


addEventListener("mousemove", (event) => { //function that keeps the position of the mouse relative to the canvas
  const rect = canvas.getBoundingClientRect();
  mousePos.x = event.clientX - rect.left;
  mousePos.y = event.clientY - rect.top;
  mousePos.x *= canvas.width / canvas.clientWidth;
  mousePos.y *= canvas.height / canvas.clientHeight;
});

// functions that say whether or not the mouse has been clicked
addEventListener("mousedown", () => {
  mouseDown = true
});
addEventListener("mouseup", () => {
  mouseDown = false
});

// controls inputs so that they are added to a keysPressed array
addEventListener("keydown", ({ key, repeat }) => {
  if (key.toLowerCase() === "e") {//opens and closes the inventory
    inventory.toggleInventory()
  }
  if (repeat) { return; }
  if (!keysPressed.includes(key.toLowerCase())) {
    keysPressed.unshift(key.toLowerCase());
  }
  console.log(keysPressed);
});

// removes when that key is still not pressed
addEventListener("keyup", ({ key }) => {
  if (keysPressed.includes(key.toLowerCase())) {
    keysPressed.splice(keysPressed.indexOf(key.toLowerCase()), 1);
    console.log(keysPressed)
  }
});

function canvasMovement() { //controls player movement and direction changing depending on inputs
  let maxVelocity = 0

  //the number of pixels that the canvas will be translated each frame
  let translateX = 0
  let translateY = 0
  
  if (keysPressed.includes("a")) {
    player.direction = "left"
    if (!player.collisions.left) {
      player.velocity.x = -5
      translateX = 5
    } else {
      player.velocity.x = Math.min(player.velocity.x, maxVelocity)
      translateX = 0
    }
  } else if (keysPressed.includes("d")) {
    player.direction = "right"
    if (!player.collisions.right) {
      player.velocity.x = 5
      translateX = -5
    } else {
      player.velocity.x = Math.max(player.velocity.x, maxVelocity)
      translateX = 0
    }
  } else {
    player.velocity.x = 0
    translateX = 0
  }
  if ((keysPressed.includes("a")) && (keysPressed.includes("d"))) {//makes sure if they player tries to go left and right at the same time they stay still
    player.velocity.x = 0
    translateX = 0
  }

  if (keysPressed.includes("w")) {
    player.direction = "back"//sets the players direction depending on the keys pressd
    if (!player.collisions.up) {//checks if there is a collision in that direction
      player.velocity.y = -5 // sets how much the player should move
      translateY = 5 // sets how much the canvas should move
    } else {
      player.velocity.y = Math.min(player.velocity.y, maxVelocity); // otherwise makes sure there can't be any movement
      translateY = 0
    }
  } else if (keysPressed.includes("s")) {//repeats for all directions
    player.direction = "forward"
    if (!player.collisions.down) {
      player.velocity.y = 5
      translateY = -5
    } else {
      player.velocity.y = Math.max(player.velocity.y, maxVelocity)
      translateY = 0
    }
  } else {
    player.velocity.y = 0
    translateY = 0
  }
  if ((keysPressed.includes("s")) && (keysPressed.includes("w"))) {//makes sure if the player is trying to go up and down then they just stay still
    player.velocity.y = 0
    translateY = 0
  }
  ctx.translate(translateX, translateY);//translates the canvas after the movement is set
}


// draws any UI
function drawUI() {
  ctx.font = "30px Comic Sans MS"
  ctx.fillStyle = "#424ef5"
  ctx.fillText(`Time: ${elapsedTime}s, ${Math.floor(mousePos.x)},${Math.floor(mousePos.y)}, ${Math.floor(player.position.x)},${Math.floor(player.position.y)}, ${player.health}, ${map.enemies.length}, ${player.state}`, -100 + player.position.x, -200 + player.position.y)
}

// keeps all of the functions for anything that gets drawn onto the canvas
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

// runs any functions or changes any variables that need to be updated
function update(timestamp) {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  canvasMovement();
  player.update(map.obstacles, timestamp, ctx);
  map.update()
  inventory.position.x = player.position.x - 170;
  inventory.position.y = player.position.y - 180;

}

// the gameloop which repeats and holds all functions clearing, updating and drawing everything every frame
function gameloop(timestamp) {
  if (player.health === 0){//if the player has run out of health then they lose the game
    ctx.clearRect(-100000, -100000, 10000000, 1000000)
  ctx.fillText(`YOU DIED,`, player.position.x, player.position.y)
    player.state ="dead"
    if (keysPressed.includes("r")) {
      player.health = 100
    }
  }
  else{ctx.clearRect(-100000, -100000, 10000000, 1000000)
    update(timestamp)
    draw()
    }
  requestAnimationFrame(gameloop)
}
