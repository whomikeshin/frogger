var MovingObject = require("./movingObject");
var Util = require("./util");
var Gates = 0;

var Frog = function (options) {
  options.dim = [50, 40];
  options.vel = options.vel || [0, 0];

  MovingObject.call(this, options);
};

Util.inherits(Frog, MovingObject);

Frog.prototype.draw = function (ctx) {
  var img = new Image();
  img.src = './images/toad.png';


  ctx.drawImage(img, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
};

Frog.prototype.type = "Frog";

Frog.prototype.jump = function (displace) {
  this.pos[0] += displace[0];
  this.pos[1] += displace[1];
};

Frog.prototype.relocate = function () {
  this.pos = [375, 615];
  this.game.loseLife();
};

Frog.prototype.mark = function () {
  this.pos = [375, 615];
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
