var Frog = require("./frog");
var MovingObject = require("./movingObject");
var Util = require("./util");
var Lives = 3;

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
  this.pos = [375, 650]; //600
  this.vel = [0, 0];
  Lives -= 1;
  console.log(Lives);
};

Frog.prototype.ride = function (otherObject) {
  if (this.pos[1] > 300) {
    debugger;
    this.vel = [0, 0];
  } else {
    this.vel = otherObject.vel;
  }
};


module.exports = Frog;
