/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(9);
	
	var canvasEl = document.getElementsByTagName("canvas")[0],
	    canvasElLeft = canvasEl.offsetLeft,
	    canvasElTop = canvasEl.offsetTop,
	    ctx = canvasEl.getContext("2d"),
	    objects = [];
	
	document.addEventListener("DOMContentLoaded", function(){
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  ctx.fillStyle = "#00ff7f";
	  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
	
	  var button = {
	    color: "#05EFFF",
	    width: 150,
	    height: 100,
	    top: 20,
	    left: 15
	  };
	
	  ctx.fillStyle = button.color;
	  ctx.fillRect(0, 0, button.width, button.height);
	
	  canvasEl.addEventListener("click", function(event){
	    var game = new Game();
	
	    var x = event.pageX - canvasElLeft,
	        y = event.pageY - canvasElTop;
	
	    if (y > button.top &&
	        y < button.top + button.height &&
	        x > button.left &&
	        x < button.left + button.width) {
	          new GameView(game, ctx).start();
	        }
	  }, false);
	
	
	  // var game = new Game();
	
	  // new StartScreen().draw(ctx);
	  // if (StartScreen.gameStart) {
	  //   new GameView(game, ctx).start();
	  // }
	});
	
	// canvasEl.addEventListener("click", function(event){
	//   var game = new Game();
	//
	//   var x = event.pageX - canvasElLeft,
	//       y = event.pageY - canvasElTop;
	//
	//   ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
	//
	//   objects.forEach(function(obj) {
	//     if (y > obj.top &&
	//         y < obj.top + obj.height &&
	//         x > obj.left &&
	//         x < obj.left + obj.width) {
	//           new GameView(game, ctx).start();
	//         }
	//   });
	// }, false);
	
	// objects.push({
	//   color: "#05EFFF",
	//   width: 150,
	//   height: 100,
	//   top: 20,
	//   left: 15
	// });
	//
	// objects.forEach(function(obj) {
	//   ctx.fillStyle = obj.color;
	//   ctx.fillRect(obj.left, obj.top, obj.width, obj.height);
	// });


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Bullet = __webpack_require__(2);
	var Toad = __webpack_require__(5);
	var Shell = __webpack_require__(6);
	var Gate = __webpack_require__(7);
	var Mushroom = __webpack_require__(8);
	
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
	
	Game.prototype.isOutOfBounds = function (pos, dim) {
	  return (pos[0] + dim[0] < 0) || (pos[1] < 0) ||
	    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
	};
	
	Game.prototype.moveObjects = function (delta) {
	  this.allObjects().forEach(function (object) {
	    if (object.type !== "Gate") {
	      object.move(delta);
	    }
	  });
	};
	
	
	Game.prototype.wrap = function (pos, dim) {
	  return [ wrap(pos[0], Game.DIM_X), pos[1] ];
	
	  function wrap(xPos, max) {
	    if (xPos < -dim[0]) {
	      return max;
	    } else if (xPos > max) {
	      return -dim[0];
	    } else {
	      return xPos;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	// var Frog = require("./frog");
	
	var DEFAULTS = {
	  COLOR: "#FF0000",
	  LEVEL: 1
	};
	
	var Bullet = function (options = {}) {
	
	  var xCoord = options.pos[0],
	      yCoord = options.pos[1],
	      xDir = xCoord === 0 ? 1 : -1;
	
	  options.pos[0] += (startPostion(options.vehicleNum) * xDir);
	  options.color = DEFAULTS.COLOR;
	  options.vel = options.vel ||
	    Util.rowVec(xDir, speedConstant(yCoord) * options.level);
	  options.dim = options.dim || Util.dim(yCoord);
	
	  if (options.pos[1] === 390) {
	    options.imgSource = './images/chomper.png';
	  } else {
	    options.imgSource = options.imgSource ||
	      xCoord === 0 ?
	      './images/bullet_right.png' : './images/bullet_left.png';
	  }
	
	  MovingObject.call(this, options);
	};
	
	var speedConstant = function (yCoord) {
	  if (yCoord === 390) {
	    return 0.8;
	  } else if (yCoord === 435) {
	    return 0.9;
	  } else if (yCoord === 480) {
	    return 0.75;
	  } else if (yCoord === 525) {
	    return 0.6;
	  } else {
	    return 0.5;
	  }
	};
	
	var startPostion = function (vehicleNum) {
	  return (vehicleNum * 250 + Math.round((Math.random() * 50)));
	};
	
	Util.inherits(Bullet, MovingObject);
	
	Bullet.prototype.type = "Bullet";
	
	Bullet.prototype.draw = function (ctx) {
	  var bullet = new Image();
	
	  bullet.src = this.imgSource;
	  ctx.drawImage(bullet, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	};
	
	module.exports = Bullet;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	
	  objBounds: function(object) {
	    var xCoord = object.pos[0],
	        yCoord = object.pos[1],
	        width = object.dim[0],
	        height = object.dim[1];
	
	    return [xCoord, yCoord, width, height];
	  },
	
	  dim: function (rowPos) {
	    if (rowPos === 390 || rowPos === 165) {
	      return [100, 40];
	    } else if (rowPos === 120) {
	      return [175, 40];
	    } else if (rowPos === 210) {
	      return [225, 40];
	    } else if (rowPos === 255) {
	      return [125, 40];
	    } else if (rowPos === 300) {
	      return [150, 40];
	    } else {
	      return [50, 40];
	    }
	  },
	
	  dist: function (pos1, dim1, pos2, dim2) {
	    var center1 = [pos1[0] + (dim1[0] / 2), pos1[1] + (dim1[1] / 2)];
	    var center2 = [pos2[0] + (dim2[0] / 2), pos2[1] + (dim2[1] / 2)];
	
	    var centerDist = Math.sqrt(
	      Math.pow(center2[0] - center1[0], 2) + Math.pow(center2[1] - center1[1], 2)
	    );
	
	    return centerDist;
	  },
	
	  inherits: function (ChildClass, ParentClass) {
	    function Surrogate () {};
	    Surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	
	  rowVec: function (xDir, speed) {
	    var velDefault = 1;
	
	    return Util.scale([velDefault * xDir, 0], speed);
	  },
	
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.color = options.color;
	  this.game = options.game;
	  this.dim = options.dim;
	  this.imgSource = options.imgSource;
	  this.level = options.level;
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.rect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var thisObj = Util.objBounds(this);
	  var otherObj = Util.objBounds(otherObject);
	
	  var thisX = thisObj[0],
	      thisY = thisObj[1],
	      thisW = thisObj[2],
	      thisH = thisObj[3];
	
	  var otherX = otherObj[0],
	      otherY = otherObj[1],
	      otherW = otherObj[2],
	      otherH = otherObj[3];
	
	  var intersect = !((thisX + thisW < otherX) || (otherX + otherW < thisX) ||
	        (thisY + thisH) < otherY || (otherY + otherH) < thisY );
	
	  return intersect;
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	MovingObject.prototype.isWrappable = true;
	
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta number of milliseconds since last move
	  //velocity of object is how far it should move in 1/60th of a second
	  // debugger;
	  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0];
	      offsetY = this.vel[1];
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	  if (this.game.isOutOfBounds(this.pos, this.dim)) {
	    if (this.isWrappable) {
	
	      this.pos = this.game.wrap(this.pos, this.dim);
	    } else {
	      this.relocate();
	    }
	  }
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	
	var Toad = function (options) {
	  options.dim = [40, 40];
	  options.vel = options.vel || [0, 0];
	  options.imgSource = options.imgSource || './images/toad.png';
	
	  MovingObject.call(this, options);
	};
	
	Toad.JUMP_COUNTER = Toad.JUMP_COUNTER || 0;
	Toad.JUMP_SCORE = Toad.JUMP_SCORE || 0;
	
	Util.inherits(Toad, MovingObject);
	
	Toad.prototype.draw = function (ctx) {
	  var toad = new Image();
	  toad.src = this.imgSource;
	
	  ctx.drawImage(toad, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	};
	
	Toad.prototype.type = "Toad";
	
	Toad.prototype.jump = function (displace) {
	  this.pos[0] += displace[0];
	  this.pos[1] += displace[1];
	
	  if (displace[0] === -50) {
	    this.imgSource = './images/toad_left.png';
	  } else if (displace[0] === 50) {
	    this.imgSource = './images/toad_right.png';
	  } else if (displace[1] === 45) {
	    this.imgSource = './images/toad_front.png';
	  } else {
	    this.imgSource = './images/toad.png';
	  }
	
	  if (displace[1] !== 0) {
	    this.jumpScore(displace);
	  }
	};
	
	Toad.prototype.jumpScore = function (displace) {
	  var game = this.game;
	  var points = 0;
	
	  if (displace[1] === -45) {
	    Toad.JUMP_COUNTER += 1;
	  } else if (displace[1] === 45) {
	    Toad.JUMP_COUNTER -= 1;
	  }
	
	  if (Toad.JUMP_COUNTER > Toad.JUMP_SCORE) {
	    Toad.JUMP_SCORE = Toad.JUMP_COUNTER;
	    points = 10;
	  }
	
	  game.updateScore(points);
	};
	
	Toad.prototype.relocate = function () {
	  this.pos = [375, 615];
	  this.game.loseLife();
	  Toad.JUMP_COUNTER = 0;
	};
	
	Toad.prototype.mark = function () {
	  var game = this.game;
	  var points = 50;
	  this.pos = [375, 615];
	  Toad.JUMP_COUNTER = 0;
	  Toad.JUMP_SCORE = 0;
	
	  game.updateScore(50);
	};
	
	Toad.prototype.ride = function (otherObject) {
	  if (this.pos[1] > 300) {
	    this.vel = [0, 0];
	  } else {
	    this.vel = otherObject.vel;
	  }
	};
	
	Toad.prototype.isRidingOn = function (otherObject) {
	  var ridingOn = this.centerInBounds(otherObject);
	  return ridingOn;
	};
	
	Toad.prototype.centerInBounds = function (otherObject) {
	  var center =
	    [this.pos[0] + (this.dim[0]/2), this.pos[1] + (this.dim[1]/2)];
	  var inBounds =
	    ((center[0] > otherObject.pos[0] &&
	      center[0] < (otherObject.pos[0] + otherObject.dim[0])) &&
	    (center[1] > otherObject.pos[1] &&
	      center[1] < (otherObject.pos[1] + otherObject.dim[1])));
	  return inBounds;
	};
	
	Toad.prototype.isInGate = function (otherObject) {
	  return this.centerInBounds(otherObject);
	};
	
	Toad.prototype.isWrappable = false;
	
	
	module.exports = Toad;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	var DEFAULTS = {
	  COLOR: "#802A2A",
	  LEVEL: 1,
	};
	
	var Shell = function (options) {
	  var xCoord = options.pos[0];
	  var yCoord = options.pos[1];
	  var xDir = xCoord === 0 ? 1 : -1;
	
	  options.pos[0] += (startPostion(yCoord, options.shellNum) * xDir);
	  options.color = DEFAULTS.COLOR;
	  options.vel = options.vel ||
	    Util.rowVec(xDir, speedConstant(yCoord) * options.level);
	  options.dim = options.dim || Util.dim(yCoord);
	
	  if (options.pos[1] === 165) {
	    options.imgSource = './images/2shells.png';
	  } else if (options.pos[1] === 300) {
	    options.imgSource = './images/3shells.png';
	  } else if (options.pos[1] === 120) {
	    options.imgSource = './images/brick_100.png';
	  } else if (options.pos[1] === 210) {
	    options.imgSource = './images/brick_200.png';
	  } else {
	    options.imgSource = './images/brick_250.png';
	  }
	
	  MovingObject.call(this, options);
	};
	
	var speedConstant = function (yCoord) {
	  if (yCoord === 120) {
	    return 0.9;
	  } else if (yCoord === 165) {
	    return 1;
	  } else if (yCoord === 210) {
	    return 1;
	  } else if (yCoord === 255) {
	    return 0.6;
	  } else {
	    return 0.8;
	  }
	};
	
	var startPostion = function (yCoord, shellNum) {
	  if (yCoord === 120) {
	    return shellNum * 275;
	  } else if (yCoord === 210) {
	    return shellNum * 400;
	  } else {
	    return shellNum * 266;
	  }
	};
	
	Util.inherits(Shell, MovingObject);
	
	Shell.prototype.type = "Shell";
	
	Shell.prototype.draw = function (ctx) {
	  var img = new Image();
	
	  img.src = this.imgSource;
	  ctx.drawImage(img, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	};
	
	module.exports = Shell;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var Gate = function (options) {
	  this.color = "#0000FF";
	  this.dim = [80, 90];
	  this.pos = options.pos;
	  this.game = options.game;
	  this.marked = false;
	};
	
	Gate.prototype.draw = function (ctx) {
	  var gate = this;
	  var pipe = new Image();
	  pipe.src = './images/pipe_med.png';
	
	  if (gate.marked) {
	    var plant = new Image();
	    plant.src = './images/plant.png';
	    ctx.drawImage(plant, gate.pos[0], 60, gate.dim[0], 60);
	  }
	
	  ctx.drawImage(pipe, gate.pos[0], gate.pos[1], gate.dim[0], gate.dim[1]);
	};
	
	Gate.prototype.type = "Gate";
	
	module.exports = Gate;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	
	var Mushroom = function (options) {
	  this.dim = [80, 60];
	  this.vel = [0, 0];
	  this.pos = [40 + (160 * Math.floor(Math.random() * 5)), 59];
	  this.game = options.game;
	  this.imgSource = './images/shroom.png';
	  this.show = this.show || false;
	};
	
	Mushroom.TIME = Math.floor((Math.random() * 400) + 1);
	
	Mushroom.prototype.type = "Extra";
	
	Util.inherits(Mushroom, MovingObject);
	
	Mushroom.prototype.draw = function (ctx) {
	  var shroom = this;
	  var game = this.game;
	  var time = Mushroom.TIME;
	
	  if (time === game.updateTimer()) {
	    shroom.show = true;
	  } else if ((time + 200) < game.updateTimer()) {
	    shroom.show = false;
	  }
	
	  if (shroom.show) {
	    var mushshroom = new Image();
	    mushshroom.src = shroom.imgSource;
	
	    ctx.drawImage(mushshroom, shroom.pos[0], shroom.pos[1], shroom.dim[0], shroom.dim[1]);
	  }
	};
	
	
	
	module.exports = Mushroom;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.toad = this.game.addToad();
	};
	
	GameView.MOVES = {
	  up: [ 0, -45],
	  left: [-50,  0],
	  down: [ 0,  45],
	  right: [ 50,  0]
	};
	
	
	GameView.prototype.bindKeyHandlers = function () {
	  var toad = this.toad;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    var move = GameView.MOVES[k];
	    key(k, function () { toad.jump(move); });
	  });
	};
	
	GameView.prototype.start = function () {
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function (time) {
	  var timeDelta = this - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map