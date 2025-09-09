class GameManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.currentGame = null;
  }

  start(game) {
    if (this.currentGame) {
      this.currentGame.stop();
    }
    this.currentGame = game;
    game.start(this.context, this.canvas);
  }

  stop() {
    if (this.currentGame) {
      this.currentGame.stop();
      this.currentGame = null;
    }
  }
}

class RatShooterIII {
  constructor(manager) {
    // game state variables
    this.manager=manager;
    this.fpsInterval = 1000 / 30;
    this.then = Date.now();
    this.player = null;
    this.enemy = null;
    this.bullets = [];
    this.enemies = [];
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.spaceBarPressed = false;
    this.bulletDirection = "w";
  }

  start(context, canvas) {
    this.context = context;
    this.canvas = canvas;

    // initialize player, enemy, etc.
    this.player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 50,
      xChange: 2,
      yChange: 2,
      color: "yellow",
    };

    this.enemy = {
      x: 0,
      y: 0,
      size: 25,
      speed: 0.2,
      color: "blue",
    };

    this.bullets = [];
    this.enemies = [];

    // keyboard input
    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    window.addEventListener("keydown", this.activate);
    window.addEventListener("keyup", this.deactivate);

    // bind loop
    this.loop = this.loop.bind(this);
    this.requestId = requestAnimationFrame(this.loop);

    // spawn some enemies
    this.spawnEnemies(4);
  }

  loop() {
    this.requestId = requestAnimationFrame(this.loop);

    const now = Date.now();
    const elapsed = now - this.then;
    if (elapsed < this.fpsInterval) return;
    this.then = now;

    // clear screen
    this.context.fillStyle = "red";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw player
    this.context.fillStyle = this.player.color;
    this.context.fillRect(
      this.player.x,
      this.player.y,
      this.player.size,
      this.player.size
    );

    // player movement
    if (this.moveRight && this.player.x + this.player.size < this.canvas.width) {
      this.player.x += this.player.xChange;
    }
    if (this.moveLeft && this.player.x > 0) {
      this.player.x -= this.player.xChange;
    }
    if (this.moveDown && this.player.y + this.player.size < this.canvas.height) {
      this.player.y += this.player.yChange;
    }
    if (this.moveUp && this.player.y > 0) {
      this.player.y -= this.player.yChange;
    }

    // enemies
    this.context.fillStyle = this.enemy.color;
    for (let i = 0; i < this.enemies.length; i++) {
      this.context.fillRect(this.enemies[i][0], this.enemies[i][1], this.enemies[i][2], this.enemies[i][3])
    }
    /*
    for (let [x, y, w, h] of this.enemies) {
      this.context.fillRect(x, y, w, h);
    }
      */
    this.moveEnemiesTowardsPlayer();

    // bullets
    this.shoot();
  }

  activate(event) {
    const key = event.key;
    if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", " "].includes(key)) {
      event.preventDefault();
    }

    if (key === "ArrowRight") this.moveRight = true;
    if (key === "ArrowLeft") this.moveLeft = true;
    if (key === "ArrowUp") this.moveUp = true;
    if (key === "ArrowDown") this.moveDown = true;
    if (key === " ") this.spaceBarPressed = true;

    if (["w", "a", "s", "d"].includes(key)) {
      this.bulletDirection = key;
    }
  }

  deactivate() {
    this.moveUp = this.moveDown = this.moveLeft = this.moveRight = false;
    this.spaceBarPressed = false;
  }

  spawnEnemies(num) {
    this.enemies = [];
    for (let i = 0; i < num; i++) {
      let margin = 20;
      let randx =
        Math.floor(Math.random() * (this.canvas.width + margin * 2)) - margin;
      let randy =
        Math.floor(Math.random() * (this.canvas.height + margin * 2)) - margin;

      // keep enemies outside canvas
      while (
        randx > 0 &&
        randx + this.enemy.size < this.canvas.width &&
        randy > 0 &&
        randy + this.enemy.size < this.canvas.height
      ) {
        randx =
          Math.floor(Math.random() * (this.canvas.width + margin * 2)) - margin;
        randy =
          Math.floor(Math.random() * (this.canvas.height + margin * 2)) - margin;
      }

      this.enemies.push([randx, randy, this.enemy.size, this.enemy.size]);
    }
  }

  moveEnemiesTowardsPlayer() {
    for (let i = 0; i < this.enemies.length; i++) {
      let ex = this.enemies[i][0] + this.enemy.size / 2;
      let ey = this.enemies[i][1] + this.enemy.size / 2;

      let px = this.player.x + this.player.size / 2;
      let py = this.player.y + this.player.size / 2;

      let dx = px - ex;
      let dy = py - ey;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        let nx = dx / dist;
        let ny = dy / dist;
        this.enemies[i][0] += nx * this.enemy.speed;
        this.enemies[i][1] += ny * this.enemy.speed;
      }
    }
  }

  shoot() {
    if (this.spaceBarPressed) {
      this.bullets.push([
        this.player.x + this.player.size / 2,
        this.player.y + this.player.size / 2,
        this.bulletDirection,
      ]);
      this.spaceBarPressed = false; // fire once per press
    }

    this.context.fillStyle = "green";
    for (let i = 0; i < this.bullets.length; i++) {
      let [bx, by, dir] = this.bullets[i];
      this.context.fillRect(bx, by, 5, 5);

      if (dir === "w") this.bullets[i][1] -= 5;
      else if (dir === "a") this.bullets[i][0] -= 5;
      else if (dir === "s") this.bullets[i][1] += 5;
      else if (dir === "d") this.bullets[i][0] += 5;

      // remove offscreen bullets
      if (
        bx < 0 ||
        by < 0 ||
        bx > this.canvas.width ||
        by > this.canvas.height
      ) {
        this.bullets.splice(i, 1);
        i--;//arrays collapse after you splice, as such i++ would skip over the next item in the array. i-- prevents this.
      }
    }
  }
  gameOver(){
    document.getElementById("canvas")
    .addEventListener("click", () => this.manager.start(this));
  }
  stop() {
    cancelAnimationFrame(this.requestId);
    window.removeEventListener("keydown", this.activate);
    window.removeEventListener("keyup", this.deactivate);
  }
}


class RatRaceII {
  constructor(manager) {
    this.manager=manager
    this.level = 1;
    this.fpsInterval = 1000 / 30;
    this.map;
    this.tileImage = new Image();
    this.tileImage.src = 'WallTileNormal.png';
    this.playerImage = new Image();
    this.playerImage.src = 'cheese.png';
    this.timerInterval = null;
    this.player = null
    this.enemies = [];
    this.enemyImage = new Image();
    this.enemyImage.src = 'ratEnemy.png';
    this.exit = null;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.moveUp = false;
    this.startTime=null;
    this.endTime=null;
    this.timeDiff=null;
  };

  startTimer(){
    this.startTime=new Date();
  };
  recordTime(){
    this.endTime=new Date();
    this.timeDiff=(this.endTime-this.startTime)/1000;
  };

  displayPlayerTime(){
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    };
    const start = Date.now();
    this.timerInterval=setInterval(keepTime,1000);
    function keepTime() {
      let timeTaken = Date.now() - start;
      document.getElementById("playerTime").innerHTML = 'time: ' + Math.floor(timeTaken / 1000) + ' seconds';
    }
  }

  start(ctx, canvas) {
    this.context = ctx;
    this.canvas = canvas;
    this.loop = this.loop.bind(this);
    this.requestId = requestAnimationFrame(this.loop);
    document.getElementById("level").innerHTML = 'Level: ' + this.level;

    this.player = {
      x: 0,
      y: 150,
      size: 30,
      xChange: 10,
      yChange: 10,
      color: "yellow",
    };
    this.exit = {
      x: 448, //512-64
      y: 0,
      size: 64,
      color: "green"
    };



    this.activate = this.activate.bind(this); //this will always mean ratraceII in the activate function
    this.deactivate = this.deactivate.bind(this);
    window.addEventListener('keydown', this.activate, false);
    window.addEventListener('keyup', this.deactivate, false);
    this.positionPlayerBottomLeft();
    this.spawnEnemies(3);
    this.displayPlayerTime();
    this.startTimer();


  }

  loop() {
    this.requestId = requestAnimationFrame(this.loop);
    //checks for ghosting
    const now = Date.now();
    const elapsed = now - this.then;
    if (elapsed < this.fpsInterval) return;
    this.then = now;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //draw map
    if (this.level === 1) {
      this.drawLevel(1)
    }
    else if (this.level === 2) {
      this.drawLevel(2)
    }
    else if (this.level === 3) {
      this.drawLevel(3)
    }
    else if (this.level === 4) {
      this.drawLevel(4)
    }
    else if (this.level === 5) {
      this.drawLevel(5)
    }
    else {
      this.endGame()
    }

    //draw player
    this.context.drawImage(
      this.playerImage,
      this.player.x,
      this.player.y,
      this.player.size,
      this.player.size);

    //player movement
    if (this.moveRight && this.player.x + this.player.size < this.canvas.width) {
      this.player.x += this.player.xChange;
    }
    if (this.moveLeft && this.player.x > 0) {
      this.player.x -= this.player.xChange;
    }
    if (this.moveUp && this.player.y > 0) {
      this.player.y -= this.player.yChange;
    }
    if (this.moveDown && this.player.y + this.player.size < canvas.height) {
      this.player.y += this.player.yChange;
    }

     //enemies
    for (let e of this.enemies) {
      // Calculate direction towards player
      let dx = this.player.x - e.x;
      let dy = this.player.y - e.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      // distance calculated as you'd expect -> square root of (x2-x1)^2 + (y2-y1)^2

      // Normalize direction and move enemy
      if (distance > 0) {
        e.x += (dx / distance) * e.speed; //when dividing dx by distance we can normalize the direction, i.e make the mouse move diagonally if needs be
        e.y += (dy / distance) * e.speed; // same for dy, e.speed will increase for every level adding to the difficulty
      }
      //draw enemies as frames refresh
      this.context.drawImage(this.enemyImage, e.x, e.y, e.size, e.size);

      if (distance < this.player.size / 2 + e.size / 2) { //if the distance between the player and the enemy is less than (half the enemy's width + half the player's width) they are overlapping
        this.gameOver();
        return;
      }
    }

    this.checkCollisions();

  }

  gameOver(){
    
    this.recordTime();
    cancelAnimationFrame(this.requestId);
    this.context.font = "bold 50px Arial";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.fillText("Game Over", this.canvas.width / 2, this.canvas.height / 2);
    this.context.font = "bold 15px Arial";
    this.context.fillText("Your Time: " + this.timeDiff + ' seconds', this.canvas.width / 2, this.canvas.height / 2 + 100);
    this.context.font = "bold 15px Arial";
    this.context.fillText("Click anywhere to start again", this.canvas.width / 2, this.canvas.height / 2 + 200);
    document.getElementById("canvas")
    .addEventListener("click", () => this.manager.start(this));
    if (this.timerInterval) {
     clearInterval(this.timerInterval);
    }
  }

  activate(event) {
    const key = event.key;
    if (key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown") {
      event.preventDefault();
    }
    if (key === "ArrowLeft") {
      this.moveLeft = true;
    } else if (key === "ArrowUp") {
      this.moveUp = true;
    } else if (key === "ArrowDown") {
      this.moveDown = true;
    } else if (key === "ArrowRight") {
      this.moveRight = true;
    }

  }


  deactivate(event) {
    const key = event.key;
    if (key === "ArrowLeft") {
      this.moveLeft = false;
    } else if (key === "ArrowUp") {
      this.moveUp = false;
    } else if (key === "ArrowDown") {
      this.moveDown = false;
    } else if (key === "ArrowRight") {
      this.moveRight = false;
    }
  }


spawnEnemies(num){
    this.enemies = [];
    //creates a safe zone in the bottom left that enemies wont spawn in using isSafe (see below) 
    let safeZone = {
      x: 0,
      y: this.canvas.height - 200,
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
        ex = Math.random() * (this.canvas.width - 40); //-40 such that the full enemy fits in the canvas
        ey = Math.random() * (this.canvas.height - 40);

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

      this.enemies.push({
        x: ex,
        y: ey,
        size: 40,
        speed: 1, //add if you want faster enemies + level * 0.2,
        img: this.enemyImage
      });
    }
  }
 checkCollisions(){
    //exit collisions
    if (
      this.player.x < this.exit.x + this.exit.size &&
      this.player.x + this.player.size > this.exit.x &&
      this.player.y < this.exit.y + this.exit.size &&
      this.player.y + this.player.size > this.exit.y
    ) {
      this.level += 1;
      document.getElementById("level").innerHTML = 'Level: ' + this.level;
      this.positionPlayerBottomLeft();
      this.spawnEnemies(3);
    }

    // wall collisions
    for (let c = 0; c < this.map.cols; c++) {
      for (let r = 0; r < this.map.rows; r++) {
        let tile = this.map.getTile(c, r);
        if (tile === 1) {
          let tileX = c * this.map.tsize;
          let tileY = r * this.map.tsize;
          if (
            this.player.x + this.player.size > tileX && //if this.players right is whithin tiles left
            this.player.x < tileX + this.map.tsize &&//if this.players left whithin tiles right
            this.player.y + this.player.size > tileY && // if bot of this.player is below the top of tile
            this.player.y < tileY + this.map.tsize //if top of this.player is above the bot of tile
          ) {
            this.positionPlayerBottomLeft(); // a collision has occured, should any one of our if conditions fail, no collision has occured
          }
        }
      }
    }
  }

  endGame(){
    cancelAnimationFrame(this.requestId);
    this.recordTime();
    this.context.font = "bold 50px Arial";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.fillText("Congratulations!", this.canvas.width / 2, this.canvas.height / 2);
    this.context.font = "bold 30px Arial";
    this.context.fillText("You finished all levels in " + this.timeDiff + " seconds!", this.canvas.width / 2, this.canvas.height / 2 + 100);
    this.context.font = "bold 15px Arial";
    this.context.fillText("Click the canvas to play again", this.canvas.width / 2, this.canvas.height / 2 + 200);
    //document.getElementById("canvas").addEventListener("click", () => manager.start(race));;
    if (this.timerInterval) {
     clearInterval(this.timerInterval);
    };
  }
  drawLevel(number) {
    if (number === 1) {
      //draw tiles (level 1)
      this.map = {
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
          return this.tiles[row * this.cols + col];
        }
      };
    }
    else if (number === 2) {
      //draw tiles (level 2)
      this.map = {
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
          return this.tiles[row * this.cols + col];
        }
      };
    }
    else if (number === 3) {
      // Level 3 - narrow winding path
      this.map = {
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
          return this.tiles[row * this.cols + col];
        }
      };
    }
    else if (number === 4) {
      // Level 4 - multiple small chambers
      this.map = {
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
          return this.tiles[row * this.cols + col];
        }
      };
    }
    else if (number === 5) {
      // Level 5 - long looping route
      this.map = {
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
          return this.tiles[row * this.cols + col];
        }
      };
    }
    //draw exit
    this.context.fillStyle = "green";
    this.context.fillRect(this.exit.x, this.exit.y, this.exit.size, this.exit.size);

    this.context.fillStyle = "red";
    for (let c = 0; c < this.map.cols; c++) {
      for (let r = 0; r < this.map.rows; r++) {
        let tile = this.map.getTile(c, r);
        if (tile === 1) {
          this.context.drawImage(
            this.tileImage,
            c * this.map.tsize,  // x
            r * this.map.tsize,  // y
            this.map.tsize,      // width
            this.map.tsize       // height
          );
        }
      }
    }
  }




  positionPlayerBottomLeft() {
    this.player.x = 0;
    this.player.y = this.canvas.height - this.player.size;
  }
  stop() {
    cancelAnimationFrame(this.requestId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const manager = new GameManager("canvas");

  const shooter = new RatShooterIII();
  const race = new RatRaceII(manager);

  document.getElementById("ratShooterIII")
    .addEventListener("click", () => manager.start(shooter));

  document.getElementById("ratRaceII")
    .addEventListener("click", () => manager.start(race));

  document.getElementById("gameTitle").innerHTML = "Main Menu";
  manager.context.font = "bold 20px Arial";
  manager.context.fillStyle = "black";
  manager.context.textAlign = "center";
  manager.context.fillText("Welcome", manager.canvas.width / 2, manager.canvas.height / 2);
});