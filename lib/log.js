var Util = require("./util");
var MovingObject = require("./movingObject");
var Frog = require("./frog");

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
