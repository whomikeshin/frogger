var Bullet = require("./bullet");
var Toad = require("./toad");
var Shell = require("./shell");
var Gate = require("./gate");
var Mushroom = require("./mushroom");

var Game = function () {
  this.bullets = [];
  this.toads = [];
  this.shells = [];
  this.gates = [];
  this.extras = [];

  this.addBullets();
  this.addShells();
  this.addGates();
  this.addMushroom();
};

Game.FONT_COLOR = "#ffffff";
Game.BG_WATER = "#3232ff";
Game.DIM_X = 800;
Game.DIM_Y = 700;
Game.FPS = 32;
Game.LIVES = Game.LIVES || 3;
Game.TIME = Game.TIME || new Date();
Game.SCORE = Game.SCORE || 0;
Game.LEVEL = Game.LEVEL || 1;

Game.prototype.add = function (object) {
  if (object.type === "Bullet") {
    this.bullets.push(object);
  } else if (object.type === "Toad") {
    this.toads.push(object);
  } else if (object.type === "Shell") {
    this.shells.push(object);
  } else if (object.type === "Gate") {
    this.gates.push(object);
  // } else if (object.type === "Extra") {
  //   this.extras.push(object);
  } else {
    this.extras.push(object);
  }
};

Game.prototype.addToad = function () {
  var frog = new Toad({
    pos: [375, 615],
    game: this
  });

  this.add(frog);
  return frog;
};

Game.prototype.addGates = function () {
  for (var i = 0; i < 5; i++) {
    this.add(new Gate({
      game: this,
      pos: [40 + (160 * i), 30]
    }));
  }
};

Game.prototype.addShells = function () {
  for (var i = 0; i < 5; i++) {
    var rowPos = this.rowPositions()[i];
    for (var num = 0; num < this.numShells(rowPos); num++) {
      this.add(new Shell({
        game: this,
        pos: this.rowPositions()[i],
        shellNum: num,
        level: Game.LEVEL
      }));
    }
  }
};

Game.prototype.addMushroom = function () {
  this.add(new Mushroom({
    game: this
  }));
};

Game.prototype.drawLives = function (ctx) {
  var life = new Image ();
  life.src = './images/toad_life.png';

  for (var num = 0; num < Game.LIVES; num++) {
    var xPos = 10 + (num * 40);
    ctx.drawImage(life, xPos, 660, 30, 40);
  }

  if (Game.LIVES === 0) {
    this.gameOver(ctx);
  }
};

Game.prototype.updateTimer = function () {
  var timeLimit = 40;
  var timeNow = new Date();
  var timeElapsed = (timeNow - Game.TIME) * 0.001;
  var timeBar = Math.round((400 / timeLimit) * timeElapsed);

  if (timeBar === 400) {
    this.toads[0].relocate();
    this.resetTime();
  }

  return timeBar;
};


Game.prototype.drawTimer = function (ctx) {
  var timeBar = this.updateTimer();

  ctx.fillStyle = "#00C200";
  ctx.fillRect(200, 670, 400, 20);

  ctx.fillStyle = "#000000";
  ctx.fillRect(200, 670, timeBar, 20);

  ctx.fillStyle = Game.FONT_COLOR;
  ctx.font = "26px sans-serif";
  ctx.fillText("TIME", 610, 690);
};

Game.prototype.drawScore = function (ctx) {
  ctx.fillStyle = Game.FONT_COLOR;
  ctx.font = "26px sans-serif";
  ctx.fillText("SCORE", 20, 25);
  ctx.fillText(Game.SCORE, 130, 25);
};

Game.prototype.drawLevel = function (ctx) {
  ctx.fillStyle = Game.FONT_COLOR;
  ctx.font = "26px sans-serif";
  ctx.fillText("LEVEL", 670, 25);
  ctx.fillText(Game.LEVEL, 770, 25);
};

Game.prototype.gameOver = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  ctx.fillStyle = Game.FONT_COLOR;
  ctx.textAlign = "center";
  ctx.font = "72px sans-serif";

  ctx.fillText("GAME OVER", 400, 400);
};

Game.prototype.resetTime = function () {
  Game.TIME = new Date();
};

Game.prototype.addBullets = function () {
  for (var i = 5; i < 10; i++) {
    var rowPos = this.rowPositions()[i];
    for (var num = 0; num < this.numBullets(rowPos); num++) {
      this.add(new Bullet({
        game: this,
        pos: this.rowPositions()[i],
        vehicleNum: num,
        level: Game.LEVEL
      }));
    }
  }
};

Game.prototype.numShells = function (rowPos) {
  if (rowPos[1] === 210) {
    return 2;
  } else {
    return 3;
  }
};

Game.prototype.numBullets = function (rowPos) {
  if (rowPos[1] === 390)  {
    return 2;
  } else if (rowPos[1] === 435) {
    return 1;
  } else {
    return 3;
  }
};

Game.prototype.allObjects = function () {
  return [].concat(this.bullets, this.shells, this.extras, this.gates, this.toads);
};

Game.prototype.allCollisionObjects = function () {
  return [].concat(this.bullets);
};

Game.prototype.checkCollisions = function () {
  var game = this;
  var frog = this.toads[0];
  var extras = this.extras;
  game.allCollisionObjects().forEach(function (obj2) {
    if (frog.isCollidedWith(obj2)) {
      frog.relocate();
      }
  });

  extras.forEach(function (obj2) {
    if (frog.isCollidedWith(obj2) && obj2.show) {
      var points = 200;
      game.updateScore(points);
      obj2.show = false;
    }
  });
};

Game.prototype.checkRides = function () {
  var game = this;
  var frog = this.toads[0];
  if (frog.pos[1] < 345) {
    for (var i = 0; i < game.shells.length; i++) {
      var obj2 = game.shells[i];
      if (frog.isRidingOn(obj2)) {
        frog.ride(obj2);
        break;
      }
      frog.vel = [0, 0];
    }
  } else {
    frog.vel = [0, 0];
  }
};

Game.prototype.checkInWater = function () {
  var game = this;
  var frog = this.toads[0];
  if (frog.pos[1] < 345 && frog.pos[1] > 80 &&
    frog.vel[0] === 0) {
    frog.relocate();
  }
};

Game.prototype.checkGates = function () {
  var game = this;
  var frog = this.toads[0];

  if (frog.pos[1] < 120) {
    for (var i = 0; i < game.gates.length; i++) {
      current_gate = game.gates[i];
      if (frog.isInGate(current_gate) && !current_gate.marked) {
        frog.mark();
        current_gate.marked = true;
        var points = 400 - game.updateTimer();
        game.updateScore(points);
        game.resetTime();
        return;
      }
    }
    frog.relocate();
  }
};

Game.prototype.loseLife = function () {
  Game.LIVES -= 1;
  this.resetTime();
};

Game.prototype.updateScore = function (points) {
  Game.SCORE += points;
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.drawScore(ctx);
  this.drawLevel(ctx);

  var top = new Image ();
  top.src = './images/top_background.png';
  ctx.drawImage(top, 0, 30, Game.DIM_X, 80);

  ctx.fillStyle = Game.BG_WATER;
  ctx.fillRect(0, 110, Game.DIM_X, 240);

  var ground = new Image ();
  ground.src = './images/ground.png';
  ctx.drawImage(ground, 0, 345, Game.DIM_X, 45);
  ctx.drawImage(ground, 0, 615, Game.DIM_X, 45);

  var road = new Image();
  road.src = './images/road.png';
  ctx.drawImage(road, 20, 0, Game.DIM_X, 225, 0, 389, Game.DIM_X, 227);

  this.drawTimer(ctx);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });

  this.drawLives(ctx);
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
  this.checkRides();
  this.checkInWater();
  this.checkGates();
  // this.nextLevel();
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    if (object.type !== "Gate") {
      object.move(delta);
    }
  });
};


Game.prototype.wrap = function (pos) {
  return [
    wrap(pos[0], Game.DIM_X), wrap(pos[1], Game.DIM_Y)
  ];

  function wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

Game.prototype.rowPositions = function () {
  var _left = 0;
  var _right = 800;
  return [
    [_left, 120],
    [_right, 165],
    [_left, 210],
    [_left, 255],
    [_right, 300],
    [_right, 390],
    [_left, 435],
    [_right, 480],
    [_left, 525],
    [_left, 570],
  ];
};

Game.prototype.resetGame = function () {
  this.bullets = [];
  this.toads = [];
  this.shells = [];
  this.gates = [];
  this.extras = [];

  this.addBullets();
  this.addShells();
  this.addGates();
  this.addMushroom();
};

Game.prototype.nextLevel = function () {
  var won = true;
  this.gates.forEach(function(gate) {
    if (!gate.marked) {
      won = false;
    }
  });

  if (won && Game.LIVES > 0) {
    Game.SCORE += 1000;
    Game.LEVEL += 1;
    this.resetGame();
  }
};

module.exports = Game;
