var Util = require("./util");

var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.game = options.game;
  this.dim = options.dim;
  this.imgSource = options.imgSource;
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
