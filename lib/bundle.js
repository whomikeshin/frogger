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
	var GameView = __webpack_require__(7);
	
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
	var Gate = __webpack_require__(8);
	var Score = __webpack_require__(9);
	
	var Game = function () {
	  this.vehicles = [];
	  this.frogs = [];
	  this.logs = [];
	  this.gates = [];
	  this.counters = [];
	
	  this.addVehicles();
	  this.addLogs();
	  this.addGates();
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 800;
	Game.DIM_Y = 700;
	Game.FPS = 32;
	
	Game.prototype.add = function (object) {
	  if (object.type === "Vehicle") {
	    this.vehicles.push(object);
	  } else if (object.type === "Frog") {
	    this.frogs.push(object);
	  } else if (object.type === "Log") {
	    this.logs.push(object);
	  } else if (object.type === "Gate") {
	    this.gates.push(object);
	  } else if (object.type === "Score") {
	    this.counters.push(object);
	  } else {
	    throw "Error";
	  }
	};
	
	Game.prototype.addFrog = function () {
	  var frog = new Frog({
	    pos: [375, 650],
	    game: this
	  });
	
	  this.add(frog);
	  return frog;
	};
	
	Game.prototype.addGates = function () {
	  for (var i = 0; i < 5; i++) {
	    this.add(new Gate({
	      game: this,
	      pos: [40 + (160 * i), 20]
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
	        logNum: num
	      }));
	    }
	  }
	};
	
	Game.prototype.addVehicles = function () {
	  for (var i = 5; i < 10; i++) {
	    var rowPos = this.rowPositions()[i];
	    for (var num = 0; num < this.numVehicles(rowPos); num++) {
	      this.add(new Vehicle({
	        game: this,
	        pos: this.rowPositions()[i],
	        vehicleNum: num
	      }));
	    }
	  }
	};
	
	Game.prototype.numLogs = function (rowPos) {
	  if (rowPos[1] === 200) {
	    return 2;
	  } else {
	    return 3;
	  }
	};
	
	Game.prototype.numVehicles = function (rowPos) {
	  if (rowPos[1] === 400)  {
	    return 2;
	  } else if (rowPos[1] === 450) {
	    return 1;
	  } else {
	    return 3;
	  }
	};
	
	Game.prototype.allObjects = function () {
	  return [].concat(this.vehicles, this.logs, this.gates, this.frogs);
	};
	
	Game.prototype.allCollisionObjects = function () {
	  return [].concat(this.vehicles);
	};
	
	Game.prototype.checkCollisions = function () {
	  var game = this;
	  var frog = this.frogs[0];
	  game.allCollisionObjects().forEach(function (obj2) {
	    if (frog.isCollidedWith(obj2)) {
	      frog.relocate();
	    }
	  });
	};
	
	Game.prototype.checkRides = function () {
	  var game = this;
	  var frog = this.frogs[0];
	  if (frog.pos[1] < 350) {
	    for (var i = 0; i < game.logs.length; i++) {
	      var obj2 = game.logs[i];
	      if (frog.isRidingOn(obj2)) {
	        frog.ride(obj2);
	        break;
	      }
	      frog.vel = [0, 0];
	    }
	  }
	};
	
	Game.prototype.checkInWater = function () {
	  var game = this;
	  var frog = this.frogs[0];
	  if (frog.pos[1] < 350 && frog.pos[1] > 50 &&
	    frog.vel[0] === 0) {
	    frog.relocate();
	  }
	};
	
	Game.prototype.checkGates = function () {
	  var game = this;
	  var frog = this.frogs[0];
	
	  if (frog.pos[1] < 100) {
	    for (var i = 0; i < game.gates.length; i++) {
	      current_gate = game.gates[i];
	      if (frog.isInGate(current_gate) && !current_gate.marked) {
	        frog.mark();
	        current_gate.marked = true;
	        return;
	      }
	    }
	    frog.relocate();
	  }
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.step = function (delta) {
	  this.moveObjects(delta);
	  this.checkCollisions();
	  this.checkRides();
	  this.checkInWater();
	  this.checkGates();
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
	    [_left, 100],
	    [_right, 150],
	    [_left, 200],
	    [_left, 250],
	    [_right, 300],
	    [_right, 400],
	    [_left, 450],
	    [_right, 500],
	    [_left, 550],
	    [_left, 600],
	  ];
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Frog = __webpack_require__(5);
	
	var DEFAULTS = {
	  COLOR: "#FF0000",
	  LEVEL: 1.5,
	};
	
	var Vehicle = function (options = {}) {
	  var xCoord = options.pos[0];
	  var yCoord = options.pos[1];
	  var xDir = xCoord === 0 ? 1 : -1;
	
	  options.pos[0] += (startPostion(options.vehicleNum) * xDir);
	  options.color = DEFAULTS.COLOR;
	  options.vel = options.vel ||
	    Util.rowVec(xDir, speedConstant(yCoord) * DEFAULTS.LEVEL);
	  options.dim = options.dim || Util.dim(yCoord);
	
	  MovingObject.call(this, options);
	};
	
	var speedConstant = function (yCoord) {
	  if (yCoord === 400) {
	    return 0.8;
	  } else if (yCoord === 450) {
	    return 0.9;
	  } else if (yCoord === 500) {
	    return 0.75;
	  } else if (yCoord === 550) {
	    return 0.6;
	  } else {
	    return 0.5;
	  }
	};
	
	var startPostion = function (vehicleNum) {
	  return (vehicleNum * 250 + Math.round((Math.random() * 50)));
	};
	
	// Vehicle.prototype.collideWith = function (otherObject) {
	//   if (otherObject.type === "Frog") {
	//     otherObject.relocate();
	//   }
	// };
	
	Util.inherits(Vehicle, MovingObject);
	
	Vehicle.prototype.type = "Vehicle";
	
	module.exports = Vehicle;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	
	  bounds: function(pos) {
	    var left = this.pos[0];
	    var right = this.pos[0] + this.dim[0];
	    var top = this.pos[1];
	    var bottom = this.pos[1] + this.dim[1];
	
	    return [left, right, top, bottom];
	  },
	
	  dim: function (rowPos) {
	    if (rowPos === 400 || rowPos === 150) {
	      return [100, 40];
	    } else if (rowPos === 100) {
	      return [175, 40];
	    } else if (rowPos === 200) {
	      return [225, 40];
	    } else if (rowPos === 250) {
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
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.rect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	  ctx.fill();
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist =
	    Util.dist(this.pos, this.dim, otherObject.pos, otherObject.dim);
	  var xDimSum = (this.dim[0]/2) + (otherObject.dim[0]/2);
	  var yDimSum = (this.dim[1]/2) + (otherObject.dim[1]/2);
	
	  return centerDist < xDimSum && centerDist < yDimSum;
	};
	
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	MovingObject.prototype.isWrappable = true;
	
	MovingObject.prototype.move = function (timeDelta) {
	  //timeDelta number of milliseconds since last move
	  //velocity of object is how far it should move in 1/60th of a second
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
	var Util = __webpack_require__(3);
	var Lives = 3;
	var Gates = 0;
	
	var Frog = function (options) {
	  options.dim = [50, 40];
	  options.vel = options.vel || [0, 0];
	  options.color = "#00e500";
	
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Frog, MovingObject);
	
	Frog.prototype.type = "Frog";
	
	Frog.prototype.jump = function (displace) {
	  this.pos[0] += displace[0];
	  this.pos[1] += displace[1];
	};
	
	Frog.prototype.relocate = function () {
	  this.pos = [375, 650];
	  Lives -= 1;
	  console.log(Lives);
	};
	
	Frog.prototype.mark = function () {
	  this.pos = [375, 650];
	  Gates += 1;
	  console.log(Gates);
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

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Frog = __webpack_require__(5);
	
	var DEFAULTS = {
	  COLOR: "#802A2A",
	  LEVEL: 1.5,
	};
	
	var Log = function (options = {}) {
	  var xCoord = options.pos[0];
	  var yCoord = options.pos[1];
	  var xDir = xCoord === 0 ? 1 : -1;
	
	  options.pos[0] += (startPostion(yCoord, options.logNum) * xDir);
	  options.color = DEFAULTS.COLOR;
	  options.vel = options.vel ||
	    Util.rowVec(xDir, speedConstant(yCoord) * DEFAULTS.LEVEL);
	  options.dim = options.dim || Util.dim(yCoord);
	
	  MovingObject.call(this, options);
	};
	
	var speedConstant = function (yCoord) {
	  if (yCoord === 100) {
	    return 0.9;
	  } else if (yCoord === 150) {
	    return 1;
	  } else if (yCoord === 200) {
	    return 1;
	  } else if (yCoord === 250) {
	    return 0.6;
	  } else {
	    return 0.8;
	  }
	};
	
	var startPostion = function (yCoord,logNum) {
	  var variation = Math.round((Math.random() * 50));
	  if (yCoord === 100) {
	    return logNum * 275;
	  } else if (yCoord === 200) {
	    return logNum * 400;
	  } else {
	    return logNum * 266;
	  }
	};
	
	Util.inherits(Log, MovingObject);
	
	Log.prototype.type = "Log";
	
	module.exports = Log;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.frog = this.game.addFrog();
	};
	
	GameView.MOVES = {
	  up: [ 0, -50],
	  left: [-50,  0],
	  down: [ 0,  50],
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var gateCount = 5;
	
	var Gate = function (options) {
	  this.color = "#0000FF";
	  this.dim = [80, 70];
	  this.pos = options.pos;
	  this.game = options.game;
	  this.marked = false;
	};
	
	Gate.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.rect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
	  ctx.fill();
	};
	
	Gate.prototype.type = "Gate";
	
	module.exports = Gate;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Frog = __webpack_require__(5);
	
	var Score = function (options) {
	  this.pos = options.pos;
	};
	
	module.exports = Score;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map