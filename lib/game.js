var Vehicle = require("./vehicle");
var Frog = require("./frog");
var Log = require("./log");

var Game = function () {
  this.vehicles = [];
  this.frogs = [];
  this.logs = [];

  this.addVehicles();
  this.addLogs();
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
  } else {
    throw "Error";
  }
};

Game.prototype.addVehicles = function () {
  for (var i = 5; i < 10; i++) {
    var rowPos = this.rowPositions()[i];
    for (var j = 0; j < this.numVehicles(rowPos); j++) {
      this.add(new Vehicle({
        game: this,
        pos: this.rowPositions()[i],
        vehicleNum: j
      }));
    }
  }
};

Game.prototype.addLogs = function () {
  for (var i = 0; i < 5; i++) {
    var rowPos = this.rowPositions()[i];
    for (var j = 0; j < this.numLogs(rowPos); j++) {
      this.add(new Log({
        game: this,
        pos: this.rowPositions()[i],
        logNum: j
      }));
    }
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

Game.prototype.numLogs = function (rowPos) {
  if (rowPos[1] === 200) {
    return 2;
  } else {
    return 3;
  }
};

Game.prototype.addFrog = function () {
  var frog = new Frog({
    pos: [375, 650], //600
    game: this
  });

  this.add(frog);

  return frog;
};

Game.prototype.allObjects = function () {
  return [].concat(this.frogs, this.vehicles, this.logs);
};

Game.prototype.checkCollisions = function () {
  var game = this;
  //change to friendy Objects
  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1 == obj2) {
        return;
      } else if (obj1.type == obj2.type) {
        return;
      }

      if (obj1.isCollidedWith(obj2)) {
        // obj1.collideWith(obj2);
        console.log(obj1.type, obj2.type);
        console.log(obj1.pos, obj2.pos);
        // obj1.relocate();
      }
    });
  });
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
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[0] > Game.DIM_X);
};

Game.prototype.moveObjects = function (delta) {

  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.rowPositions = function () {
  return [
    [50, 100],
    [750, 150],
    [50, 200],
    [50, 250],
    [750, 300],
    [750, 400],
    [50, 450],
    [750, 500],
    [50, 550],
    [750, 600],
  ];
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

module.exports = Game;
