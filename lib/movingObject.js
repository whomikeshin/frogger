var Util = require("./util");

var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.game = options.game;
  this.dim = options.dim;
};

MovingObject.prototype.collideWith = function (otherObject) {

};

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.rect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
  ctx.fill();
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, this.dim, otherObject.pos, otherObject.dim);

  return centerDist < ((this.dim[0]/2) + (otherObject.dim[0]/2)) &&
    centerDist < (((this.dim[1]/2) + (otherObject.dim[1]/2)));
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
