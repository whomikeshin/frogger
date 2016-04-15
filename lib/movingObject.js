var Util = require("./util");

var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.game = options.game;
  this.dim = options.dim;
};

// MovingObject.prototype.collideWith = function (otherObject) {
//
// };

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.rect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
  ctx.fill();
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, this.dim, otherObject.pos, otherObject.dim);
  var xDimSum = (this.dim[0]/2) + (otherObject.dim[0]/2);
  var yDimSum = (this.dim[1]/2) + (otherObject.dim[1]/2);

  return centerDist < xDimSum && centerDist < yDimSum;
};

MovingObject.prototype.isRidingOn = function (otherObject) {
  // var frogBounds = Util.bounds(this.pos);
  // var otherObjectBounds = Util.bounds(otherObject.pos);
  var center = [this.pos[0] + (this.dim[0] / 2), this.pos[1] + (this.dim[1] / 2)];
  var isRiding = ((center[0] > otherObject.pos[0] && center[0] < (otherObject.pos[0] + otherObject.dim[0])) &&
    (center[1] > otherObject.pos[1] && center[1] < (otherObject.pos[1] + otherObject.dim[1])));
  return (this.pos[1] < 350 && isRiding);
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
      this.remove();
    }
  }
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

module.exports = MovingObject;
