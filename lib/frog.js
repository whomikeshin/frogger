var MovingObject = require("./movingObject");
var Util = require("./util");

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
