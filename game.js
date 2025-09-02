let canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.fillStyle = "red";
let currentGame;

let fpsInterval = 1000 / 30;
let now;
let then = Date.now();
let request_id;
document.querySelector('#gameList').addEventListener('click', ratShooterIII, false);
document.addEventListener("DOMContentLoaded", startMenu, false);

function startMenu() {
  context.font = "bold 20px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText("Click anywhere to start", canvas.width / 2, canvas.height / 2);
  canvas.addEventListener('click', ratRaceII, { once: true });

}

function ratShooterIII() {
  if (currentGame == 'mazeGame') {
    return;
  }
  let request_id;
  canvas.removeEventListener('click', ratRaceII, { once: true });
  currentGame = 'shooterGame';
  canvas.removeEventListener('click', ratRaceII);
  console.log('you have selected our other game!')
  document.getElementById('playerTime').innerHTML = "";
  let randCoordinate;
  let player = {
    x: canvas.height / 2,
    y: canvas.width / 2,
    size: 50,
    xChange: 10,
    yChange: 10,
    color: "yellow"
  }
  let enemy = {
    x: 0,
    y: 0,
    size: 10,
    speed:1,
    xChange: 10,
    yChange: 10,
    color: 'blue'
  }
  let enemies = [];
  init()

  function init() {
    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    draw()
  }

  let moveUp = true;
  let moveDown = true;
  let moveRight = true;
  let moveLeft = true;


  function activate(event) {
    const key = event.key;
    event.preventDefault();
    if (moveRight && key === 'ArrowRight' && player.x + player.size < canvas.width) {
      player.x = player.x + player.xChange;
    }
    else if (moveLeft && key === 'ArrowLeft' && player.x > canvas.width - canvas.width) {
      player.x = player.x - player.xChange;
    }
    else if (moveDown && key === 'ArrowDown' && player.y + player.size < canvas.height) {
      player.y = player.y + player.yChange;
    }
    else if (moveUp && key === 'ArrowUp' && player.y > canvas.height - canvas.height) {
      player.y = player.y - player.yChange;
    }

  }

  function deactivate() {
    //todo
  }

  function spawnEnemies(num) {
    //spawn number of enemies enemies must come from outside the screen and move towards player.
    for (let i = 0; i < num; i++) {
      let margin = 20;
      //generate random x and y coordinate between -20 and 532 (532= 512 +40 -20)
      let randxCoordinate = (Math.floor((Math.random() * (canvas.height + margin * 2)))) - margin;
      let randyCoordinate = (Math.floor((Math.random() * (canvas.height + margin * 2)))) - margin;

      let whithinbounds = true;
      //if coordinates are whithin the canvas bounds, generate new coords
      while (whithinbounds) {
        if (randxCoordinate > 0 &&
          randxCoordinate + enemy.size < 0 + canvas.height &&
          randyCoordinate > 0 &&
          randyCoordinate + enemy.size < canvas.height) 
        {
            randxCoordinate = (Math.floor((Math.random() * (canvas.height + margin * 2)))) - margin;
            randyCoordinate = (Math.floor((Math.random() * (canvas.height + margin * 2)))) - margin;
        }
        //if coords are outside the canvas - exit loop and push to enemies list
        else{
          whithinbounds = false;
        }
      }
     // console.log('enemy number ' + i + " has spawned" + ' at coordinates ' + randxCoordinate + ',' + randyCoordinate);
      enemies.push([randxCoordinate, randyCoordinate, enemy.size, enemy.size])
    }
    //console.log(enemies);

  }
  spawnEnemies(4);

 function moveEnemiesTowardsPlayer(){
  // a function that updates the coords of enemies
  console.log('enemies have moved towards player!')
  console.log('player coords are' + (player.x+player.size/2) + ',' + (player.x+player.size/2))
  for (let i=0; i < enemies.length; i++){
    let centerOfPlayerX=player.x+player.size/2;
    let centerOfPlayerY=player.y+player.size/2;
    let enemyXcoords=enemies[i][0];
    let enemyYcoords=enemies[i][1];
    //find distance between enemy and player
    let distance=Math.sqrt( ((centerOfPlayerX-enemyXcoords) ** 2) + ((centerOfPlayerY-enemyYcoords) ** 2))

    //normalize direction towards player (give appropriate x and y change)
    let dx=Math.abs(centerOfPlayerX-enemyXcoords);
    let dy=Math.abs(centerOfPlayerY-enemyYcoords);
    
    let newEnemyX= dx/distance;
    let newEnemyY= dy/distance;
    
    if (enemyXcoords>player.x){
      newEnemyX=newEnemyX*-1;
    }
    if (enemyYcoords>player.y){
      newEnemyY=newEnemyY*-1;
    }

    enemies[i][0]= enemyXcoords + newEnemyX;
    enemies[i][1]=enemyYcoords + newEnemyY;

    //console.log('new coords: '+ enemies[i][0] +','+ enemies[i][1]);
  }
 } 
//moveEnemiesTowardsPlayer();
document.getElementById('makeEnemiesMove').addEventListener('click',moveEnemiesTowardsPlayer,false);

  function draw() {
    now = Date.now();
    request_id = requestAnimationFrame(draw);
    context.fillStyle = "red";
    context.fillRect(0, 0, canvas.width, canvas.height);


    //draw player(yellow brick for now)
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.size, player.size);

    //draw enemies
    context.fillStyle = enemy.color;
    for (let i = 0; i < enemies.length; i++) {
      context.fillRect(enemies[i][0], enemies[i][1], enemies[i][2], enemies[i][3]);
      //console.log(enemies[i][0]);
    }
    moveEnemiesTowardsPlayer();
    //i think this helps the screen refresh but we'll have to see
    context.clearRect(0, 0, canvas.size, canvas.size);

  }
  function pauseGame(){
    cancelAnimationFrame(request_id);
    console.log('game paused');
  };

  document.getElementById('pause').addEventListener('click',pauseGame,false);
}

//RatRaceII
function ratRaceII() {
  console.log(currentGame);
  if (currentGame == 'shooterGame') {
    console.log('RatRaceII called but RatRaceShooter is running')
    return;
  }
  console.log('you have succesfully started RatRaceII')
  let level = 1;
  let map;
  let tileImage = new Image();
  let playerImage = new Image();
  playerImage.src = 'cheese.png';
  tileImage.src = "WallTileNormal.png";
  let timerInterval = null;
  let timerStopped = false;
  let player = {
    x: 0,
    y: 150,
    size: 30,
    xChange: 10,
    yChange: 10,
    color: "yellow",
  };
  let enemies = [];
  let enemyImage = new Image();
  enemyImage.src = "ratEnemy.png";
  let exit = {
    x: 448, //512-64
    y: 0,
    size: 64,
    color: "green"

  }

  let moveLeft = false;
  let moveUp = false;
  let moveDown = false;
  let moveRight = false;


  function init() {
    console.log('init function has been called!');
    window.addEventListener("keydown", activate, false);
    window.addEventListener("keyup", deactivate, false);
    positionPlayerBottomLeft();
    draw();
    spawnEnemies(3);
    level = 1;
    document.getElementById("level").innerHTML = 'Level: ' + level;
    displayPlayerTime()
    startTimer()
  }
  init();
  var startTime;
  var endTime;
  var timeDiff;
  function startTimer() {
    startTime = new Date();
  };
  function recordTime() {
    endTime = new Date();
    timeDiff = (endTime - startTime) / 1000;
  };



  function displayPlayerTime() {
    if (timerInterval) {
      clearInterval(timerInterval);
    };
    const start = Date.now();
    timerInterval = setInterval(keepTime, 1000);
    function keepTime() {
      let timeTaken = Date.now() - start;
      document.getElementById("playerTime").innerHTML = 'time: ' + Math.floor(timeTaken / 1000) + ' seconds';
    }
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
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (level === 1) {
      drawLevel(1)
    }
    else if (level === 2) {
      drawLevel(2)
    }
    else if (level === 3) {
      drawLevel(3)
    }
    else if (level === 4) {
      drawLevel(4)
    }
    else if (level === 5) {
      drawLevel(5)
    }
    else {
      endGame()
    }
    //Draw player
    context.fillStyle = "yellow"
    context.drawImage(playerImage, player.x, player.y, player.size, player.size);
    context.fillStyle = "red"

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
    //enemies
    for (let e of enemies) {
      // Calculate direction towards player
      let dx = player.x - e.x;
      let dy = player.y - e.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      // distance calculated as you'd expect -> square root of (x2-x1)^2 + (y2-y1)^2

      // Normalize direction and move enemy
      if (distance > 0) {
        e.x += (dx / distance) * e.speed; //when dividing dx by distance we can normalize the direction, i.e make the mouse move diagonally if needs be
        e.y += (dy / distance) * e.speed; // same for dy, e.speed will increase for every level adding to the difficulty
      }
      //draw enemies as frames refresh
      context.drawImage(e.img, e.x, e.y, e.size, e.size);

      if (distance < player.size / 2 + e.size / 2) { //if the distance between the player and the enemy is less than (half the enemy's width + half the player's width) they are overlapping
        gameOver();
        return;
      }
    }

    checkCollisions();
  }



  function gameOver() {
    recordTime();
    cancelAnimationFrame(request_id);
    context.font = "bold 50px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    context.font = "bold 30px Arial";
    context.fillText("Your Time: " + timeDiff + ' seconds', canvas.width / 2, canvas.height / 2 + 100);
    context.font = "bold 15px Arial";
    context.fillText("Click anywhere to start again", canvas.width / 2, canvas.height / 2 + 200);
    canvas.addEventListener("click", ratRaceII, { once: true });
    timerStopped = true;
    if (timerInterval) {
      clearInterval(timerInterval);
    };
  }


  function endGame() {
    cancelAnimationFrame(request_id);
    recordTime();
    context.font = "bold 50px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Congratulations!", canvas.width / 2, canvas.height / 2);
    context.font = "bold 30px Arial";
    context.fillText("You finished all levels in " + timeDiff + " seconds!", canvas.width / 2, canvas.height / 2 + 100);
    context.font = "bold 15px Arial";
    context.fillText("Click the canvas to play again", canvas.width / 2, canvas.height / 2 + 200);
    canvas.addEventListener("click", init, { once: true });
    if (timerInterval) {
      clearInterval(timerInterval);
    };
  }

  function drawLevel(number) {
    if (number === 1) {
      //draw tiles (level 1)
      map = {
        cols: 8,
        rows: 8,
        tsize: 64,
        tiles: [
          1, 1, 1, 1, 1, 1, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 1, 0, 1, 1, 0, 1,
          1, 0, 1, 0, 1, 1, 0, 1,
          1, 0, 1, 0, 0, 0, 0, 1,
          1, 0, 0, 0, 1, 1, 1, 1,
          1, 0, 1, 1, 1, 1, 1, 1,
          0, 0, 1, 1, 1, 1, 1, 1
        ],
        getTile(col, row) {
          return map.tiles[row * map.cols + col];
        }
      };
    }
    else if (number === 2) {
      //draw tiles (level 2)
      map = {
        cols: 8,
        rows: 8,
        tsize: 64,
        tiles: [
          1, 1, 1, 1, 1, 1, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 1, 1, 1, 1, 0, 1,
          1, 0, 1, 1, 1, 1, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 1,
          1, 1, 1, 1, 1, 1, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 1,
          0, 0, 1, 1, 1, 1, 1, 1
        ],
        getTile(col, row) {
          return map.tiles[row * map.cols + col];
        }
      };
    }
    else if (number === 3) {
      // Level 3 - narrow winding path
      map = {
        cols: 8,
        rows: 8,
        tsize: 64,
        tiles: [
          1, 1, 1, 1, 1, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 1, 1,
          1, 0, 1, 0, 0, 0, 0, 1,
          1, 0, 1, 0, 0, 0, 1, 1,
          1, 0, 1, 1, 1, 0, 0, 1,
          1, 0, 0, 0, 1, 1, 0, 1,
          1, 1, 1, 0, 0, 0, 0, 1,
          0, 0, 0, 0, 1, 1, 1, 1
        ],
        getTile(col, row) {
          return map.tiles[row * map.cols + col];
        }
      };
    }
    else if (number === 4) {
      // Level 4 - multiple small chambers
      map = {
        cols: 8,
        rows: 8,
        tsize: 64,
        tiles: [
          1, 1, 1, 1, 1, 1, 0, 0,
          1, 0, 0, 1, 0, 0, 0, 1,
          1, 0, 0, 1, 0, 1, 0, 1,
          1, 0, 0, 0, 0, 1, 0, 1,
          1, 1, 0, 1, 1, 1, 0, 1,
          1, 0, 0, 0, 0, 0, 0, 1,
          1, 0, 1, 1, 1, 1, 1, 1,
          0, 0, 1, 1, 1, 1, 1, 1
        ],
        getTile(col, row) {
          return map.tiles[row * map.cols + col];
        }
      };
    }
    else if (number === 5) {
      // Level 5 - long looping route
      map = {
        cols: 8,
        rows: 8,
        tsize: 64,
        tiles: [
          1, 1, 1, 1, 0, 0, 0, 0,
          1, 0, 0, 1, 0, 1, 0, 1,
          1, 0, 1, 1, 0, 0, 0, 1,
          1, 0, 1, 0, 0, 1, 0, 1,
          1, 0, 1, 0, 1, 1, 0, 1,
          1, 0, 0, 0, 1, 0, 0, 1,
          1, 1, 1, 0, 1, 0, 1, 1,
          0, 0, 0, 0, 1, 0, 1, 1
        ],
        getTile(col, row) {
          return map.tiles[row * map.cols + col];
        }
      };
    }
    //draw exit
    context.fillStyle = "green";
    context.fillRect(exit.x, exit.y, exit.size, exit.size);

    context.fillStyle = "red";
    for (let c = 0; c < map.cols; c++) {
      for (let r = 0; r < map.rows; r++) {
        let tile = map.getTile(c, r);
        if (tile === 1) {
          context.drawImage(
            tileImage,
            c * map.tsize,  // x
            r * map.tsize,  // y
            map.tsize,      // width
            map.tsize       // height
          );
        }
      }
    }
  }

  function checkCollisions() {
    //exit collisions
    if (
      player.x < exit.x + exit.size &&
      player.x + player.size > exit.x &&
      player.y < exit.y + exit.size &&
      player.y + player.size > exit.y
    ) {
      level += 1;
      document.getElementById("level").innerHTML = 'Level: ' + level;
      positionPlayerBottomLeft();
      spawnEnemies(3);
    }

    // wall collisions
    for (let c = 0; c < map.cols; c++) {
      for (let r = 0; r < map.rows; r++) {
        let tile = map.getTile(c, r);
        if (tile === 1) {
          let tileX = c * map.tsize;
          let tileY = r * map.tsize;
          if (
            player.x + player.size > tileX && //if players right is whithin tiles left
            player.x < tileX + map.tsize &&//if players left whithin tiles right
            player.y + player.size > tileY && // if bot of player is below the top of tile
            player.y < tileY + map.tsize //if top of player is above the bot of tile
          ) {
            positionPlayerBottomLeft(); // a collision has occured, should any one of our if conditions fail, no collision has occured
          }
        }
      }
    }
  }

  function activate(event) {
    let key = event.key;
    if (event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown") {
      event.preventDefault();
    }
    if (key === "ArrowLeft") {
      moveLeft = true;
    } else if (key === "ArrowUp") {
      moveUp = true;
    } else if (key === "ArrowDown") {
      moveDown = true;
    } else if (key === "ArrowRight") {
      moveRight = true;
    }

  }
  function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
      moveLeft = false;
    } else if (key === "ArrowUp") {
      moveUp = false;
    } else if (key === "ArrowDown") {
      moveDown = false;
    } else if (key === "ArrowRight") {
      moveRight = false;
    }
  }


  function spawnEnemies(num) {
    enemies = [];
    //creates a safe zone in the bottom left that enemies wont spawn in using isSafe (see below) 
    let safeZone = {
      x: 0,
      y: canvas.height - 200,
      width: 200,
      height: 200
    };


    /*
    note: this part of the project was pretty tough for me so ive put in some comments for more details,
    specifically the creation of a safe area in the botLeft where the player will spawn and enemies cant.
    */
    for (let i = 0; i < num; i += 1) {
      let ex, ey;
      let isSafe = false; //set to false by default, we will use isSafe to check if the generated Spawn position is inside the safeZone

      /*
      is Safe will generate random positions for new enemies to spawn at, 
      it will then check if said position is whithin the "safe zone" as defined earlier
      this gives the player a fair chance, as previously i found enemies could spawn on top 
      of the player leading to an instant game over.
      */

      while (!isSafe) {
        ex = Math.random() * (canvas.width - 40); //-40 such that the full enemy fits in the canvas
        ey = Math.random() * (canvas.height - 40);

        //if enemy square and safe Zone do NOT overlap
        if (
          !(ex < safeZone.x + safeZone.width && //left of enemy is whithin the right edge of safeZone
            ex + 40 > safeZone.x && //right of enemy is whithin the left edge of safeZone
            ey < safeZone.y + safeZone.height && //top of enemy is above bottom of safeZone
            ey + 40 > safeZone.y) // bottom of enemy is below top of safeZone
        ) {//pass the position through when spawning the enemy
          isSafe = true;
        }
      }

      enemies.push({
        x: ex,
        y: ey,
        size: 40,
        speed: 1, //add if you want faster enemies + level * 0.2,
        img: enemyImage
      });
    }
  }

  function resetGame() {
    level = 1;
    document.getElementById("level").innerHTML = 'Level: ' + level;
    startTimer();
    positionPlayerBottomLeft();
    level = 1;
    spawnEnemies(3);
  }
}
