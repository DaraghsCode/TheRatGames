let canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.fillStyle = "red";


let fpsInterval= 1000 / 30;
let now;
let then = Date.now();
let request_id;
document.addEventListener("DOMContentLoaded",init,false);
/*
function positionPlayerBottomLeft() {
    player.x = 0;
    player.y = canvas.height - player.size;
}
*/
function init(){
    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    positionPlayerBottomLeft();
    draw();
}

function positionPlayerBottomLeft() {
    player.x = 0;
    player.y = canvas.height - player.size;
}


function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);
    context.clearRect(0,0,canvas.width,canvas.height);
  
  
    //draw tiles
    const map = {
  cols: 8,
  rows: 8,
  tsize: 64,
  tiles: [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1
  ],
  getTile(col, row) {
    return map.tiles[row * map.cols + col];
  }
};

for (let c = 0; c < map.cols; c++) {
  for (let r = 0; r < map.rows; r++) {
    let tile = map.getTile(c, r);
    if (tile === 1) {
      context.fillRect(
        c * map.tsize + ((map.tsize/2)/2),  // x
        r * map.tsize + ((map.tsize/2)/2),  // y
        map.tsize/2,      // width
        map.tsize/2       // height
      );
    }
    else if(tile === 2){
      context.fillStyle="green";
      context.fillRect(
        c * map.tsize + ((map.tsize/2)/2),  // x
        r * map.tsize + ((map.tsize/2)/2),  // y
        map.tsize/2,      // width
        map.tsize/2       // height
      );
      context.fillStyle="red";
    }
  }
}

    //Draw player
    context.fillStyle="yellow"
    context.fillRect(player.x, player.y, player.size, player.size);
    context.fillStyle="red"

    //player movement
    if (moveRight && player.x + player.size < canvas.width) {
        player.x = player.x + player.xChange;
    }
    if (moveUp && player.y > 0) {
        player.y = player.y - player.yChange;
    }
    if (moveDown && player.y + player.size < canvas.height) {
        player.y = player.y + player.yChange;
    }
    if (moveLeft && player.x > 0) {
        player.x = player.x - player.xChange;
    }
  }

function activate(event){
    let key = event.key;
    if (event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"){
            event.preventDefault();
        }
    if (key === "ArrowLeft"){
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowDown"){
        moveDown=true;
    } else if (key === "ArrowRight"){
        moveRight = true;
    }

}
function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft"){
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowDown"){
        moveDown=false;
    } else if (key === "ArrowRight"){
        moveRight = false;
    }
}


let player = {
    x: 0,
    y: 150,
    size: 30,
    xChange:10,
    yChange:10,
    color:"yellow",
};

let moveLeft = false;
let moveUp = false;
let moveDown = false;
let moveRight = false;

