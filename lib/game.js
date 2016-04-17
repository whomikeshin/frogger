var Vehicle = require("./vehicle");
var Frog = require("./frog");
var Log = require("./log");
var Gate = require("./gate");
var Score = require("./score");

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

Game.BG_WATER = "#3232ff";
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
      pos: [40 + (160 * i), 0]
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

Game.prototype.allImages = function () {
  return [].concat(Game.BG_IMG);
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

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  var top = new Image ();
  top.src = './images/top.png';
  ctx.drawImage(top, 0, 0, Game.DIM_X, 90);

  var ground = new Image ();
  ground.src = './images/ground.png';
  ctx.drawImage(ground, 0, 350, Game.DIM_X, 50);
  ctx.drawImage(ground, 0, 650, Game.DIM_X, 50);

  var road = new Image();
  road.src = './images/road.png';
  ctx.drawImage(road, 20, 0, Game.DIM_X, 250, 0, 400, Game.DIM_X, 250);

  ctx.fillStyle = Game.BG_WATER;
  ctx.fillRect(0, 90, Game.DIM_X, 260);

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
