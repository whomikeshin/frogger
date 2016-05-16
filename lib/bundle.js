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
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Vehicle = __webpack_require__(2);
	var Frog = __webpack_require__(5);
	var Log = __webpack_require__(6);
	var Gate = __webpack_require__(7);
	var Mushroom = __webpack_require__(8);
	
	var Game = function () {
	  this.vehicles = [];
	  this.frogs = [];
	  this.logs = [];
	  this.gates = [];
	  this.extras = [];
	
	  this.addVehicles();
	  this.addLogs();
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
	  if (object.type === "Vehicle") {
	    this.vehicles.push(object);
	  } else if (object.type === "Frog") {
	    this.frogs.push(object);
	  } else if (object.type === "Log") {
	    this.logs.push(object);
	  } else if (object.type === "Gate") {
	    this.gates.push(object);
	  // } else if (object.type === "Extra") {
	  //   this.extras.push(object);
	  } else {
	    this.extras.push(object);
	  }
	};
	
	Game.prototype.addFrog = function () {
	  var frog = new Frog({
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
	
	Game.prototype.addLogs = function () {
	  for (var i = 0; i < 5; i++) {
	    var rowPos = this.rowPositions()[i];
	    for (var num = 0; num < this.numLogs(rowPos); num++) {
	      this.add(new Log({
	        game: this,
	        pos: this.rowPositions()[i],
	        logNum: num,
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
	    this.frogs[0].relocate();
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
	
	Game.prototype.addVehicles = function () {
	  for (var i = 5; i < 10; i++) {
	    var rowPos = this.rowPositions()[i];
	    for (var num = 0; num < this.numVehicles(rowPos); num++) {
	      this.add(new Vehicle({
	        game: this,
	        pos: this.rowPositions()[i],
	        vehicleNum: num,
	        level: Game.LEVEL
	      }));
	    }
	  }
	};
	
	Game.prototype.numLogs = function (rowPos) {
	  if (rowPos[1] === 210) {
	    return 2;
	  } else {
	    return 3;
	  }
	};
	
	Game.prototype.numVehicles = function (rowPos) {
	  if (rowPos[1] === 390)  {
	    return 2;
	  } else if (rowPos[1] === 435) {
	    return 1;
	  } else {
	    return 3;
	  }
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.vehicles, this.logs, this.extras, this.gates, this.frogs);
	};
	
	Game.prototype.allCollisionObjects = function () {
	  return [].concat(this.vehicles);
	};
	
	Game.prototype.checkCollisions = function () {
	  var game = this;
	  var frog = this.frogs[0];
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
	  var frog = this.frogs[0];
	  if (frog.pos[1] < 345) {
	    for (var i = 0; i < game.logs.length; i++) {
	      var obj2 = game.logs[i];
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
	  var frog = this.frogs[0];
	  if (frog.pos[1] < 345 && frog.pos[1] > 80 &&
	    frog.vel[0] === 0) {
	    frog.relocate();
	  }
	};
	
	Game.prototype.checkGates = function () {
	  var game = this;
	  var frog = this.frogs[0];
	
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
	  this.vehicles = [];
	  this.frogs = [];
	  this.logs = [];
	  this.gates = [];
	  this.extras = [];
	
	  this.addVehicles();
	  this.addLogs();
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

	var Util = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./util\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var MovingObject = __webpack_require__(4);
	var Frog = __webpack_require__(5);
	
	var DEFAULTS = {
	  COLOR: "#FF0000",
	  LEVEL: 1,
	};
	
	var Vehicle = function (options = {}) {
	
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
	
	Util.inherits(Vehicle, MovingObject);
	
	Vehicle.prototype.type = "Vehicle";
	
	Vehicle.prototype.draw = function (ctx) {
	  var bullet = new Image();
	
	  bullet.src = this.imgSource;
	  ctx.drawImage(bullet, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	};
	
	module.exports = Vehicle;


/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./util\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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
	  if (this.game.isOutOfBounds(this.pos)) {
	    if (this.isWrappable) {
	      this.pos = this.game.wrap(this.pos);
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
	var Util = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./util\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var Frog = function (options) {
	  options.dim = [40, 40];
	  options.vel = options.vel || [0, 0];
	  options.imgSource = options.imgSource || './images/toad.png';
	
	  MovingObject.call(this, options);
	};
	
	Frog.JUMP_COUNTER = Frog.JUMP_COUNTER || 0;
	Frog.JUMP_SCORE = Frog.JUMP_SCORE || 0;
	
	Util.inherits(Frog, MovingObject);
	
	Frog.prototype.draw = function (ctx) {
	  var toad = new Image();
	  toad.src = this.imgSource;
	
	  ctx.drawImage(toad, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	};
	
	Frog.prototype.type = "Frog";
	
	Frog.prototype.jump = function (displace) {
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
	
	Frog.prototype.jumpScore = function (displace) {
	  var game = this.game;
	  var points = 0;
	
	  if (displace[1] === -45) {
	    Frog.JUMP_COUNTER += 1;
	  } else if (displace[1] === 45) {
	    Frog.JUMP_COUNTER -= 1;
	  }
	
	  if (Frog.JUMP_COUNTER > Frog.JUMP_SCORE) {
	    Frog.JUMP_SCORE = Frog.JUMP_COUNTER;
	    points = 10;
	  }
	
	  game.updateScore(points);
	};
	
	Frog.prototype.relocate = function () {
	  this.pos = [375, 615];
	  this.game.loseLife();
	  Frog.JUMP_COUNTER = 0;
	};
	
	Frog.prototype.mark = function () {
	  var game = this.game;
	  var points = 50;
	  this.pos = [375, 615];
	  Frog.JUMP_COUNTER = 0;
	  Frog.JUMP_SCORE = 0;
	
	  game.updateScore(50);
	};
	
	Frog.prototype.ride = function (otherObject) {
	  if (this.pos[1] > 300) {
	    this.vel = [0, 0];
	  } else {
	    this.vel = otherObject.vel;
	  }
	};
	
	Frog.prototype.isRidingOn = function (otherObject) {
	  var ridingOn = this.centerInBounds(otherObject);
	  return ridingOn;
	};
	
	Frog.prototype.centerInBounds = function (otherObject) {
	  var center =
	    [this.pos[0] + (this.dim[0]/2), this.pos[1] + (this.dim[1]/2)];
	  var inBounds =
	    ((center[0] > otherObject.pos[0] &&
	      center[0] < (otherObject.pos[0] + otherObject.dim[0])) &&
	    (center[1] > otherObject.pos[1] &&
	      center[1] < (otherObject.pos[1] + otherObject.dim[1])));
	  return inBounds;
	};
	
	Frog.prototype.isInGate = function (otherObject) {
	  return this.centerInBounds(otherObject);
	};
	
	Frog.prototype.isWrappable = false;
	
	
	module.exports = Frog;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./util\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var MovingObject = __webpack_require__(4);
	var Frog = __webpack_require__(5);
	
	var DEFAULTS = {
	  COLOR: "#802A2A",
	  LEVEL: 1,
	};
	
	var Log = function (options) {
	  var xCoord = options.pos[0];
	  var yCoord = options.pos[1];
	  var xDir = xCoord === 0 ? 1 : -1;
	
	  options.pos[0] += (startPostion(yCoord, options.logNum) * xDir);
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
	
	var startPostion = function (yCoord,logNum) {
	  var variation = Math.round((Math.random() * 50));
	  if (yCoord === 120) {
	    return logNum * 275;
	  } else if (yCoord === 210) {
	    return logNum * 400;
	  } else {
	    return logNum * 266;
	  }
	};
	
	Util.inherits(Log, MovingObject);
	
	Log.prototype.type = "Log";
	
	Log.prototype.draw = function (ctx) {
	  var img = new Image();
	
	  img.src = this.imgSource;
	  ctx.drawImage(img, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	};
	
	module.exports = Log;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./util\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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
	var Util = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./util\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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
	  var fly = this;
	  var game = this.game;
	  var time = Mushroom.TIME;
	
	  if (time === game.updateTimer()) {
	    fly.show = true;
	  } else if ((time + 200) < game.updateTimer()) {
	    fly.show = false;
	  }
	
	  if (fly.show) {
	    var shroom = new Image();
	    shroom.src = fly.imgSource;
	
	    ctx.drawImage(shroom, fly.pos[0], fly.pos[1], fly.dim[0], fly.dim[1]);
	  }
	};
	
	
	
	module.exports = Mushroom;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.frog = this.game.addFrog();
	};
	
	GameView.MOVES = {
	  up: [ 0, -45],
	  left: [-50,  0],
	  down: [ 0,  45],
	  right: [ 50,  0]
	};
	
	
	GameView.prototype.bindKeyHandlers = function () {
	  var frog = this.frog;
	
	  Object.keys(GameView.MOVES).forEach(function (k) {
	    var move = GameView.MOVES[k];
	    key(k, function () { frog.jump(move); });
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