var Util = require("./util");
var MovingObject = require("./movingObject");

var DEFAULTS = {
  COLOR: "#802A2A",
  LEVEL: 1,
};

var Shell = function (options) {
  var xCoord = options.pos[0];
  var yCoord = options.pos[1];
  var xDir = xCoord === 0 ? 1 : -1;

  options.pos[0] += (startPostion(yCoord, options.shellNum) * xDir);
  options.color = DEFAULTS.COLOR;
  options.vel = options.vel ||
    Util.rowVec(xDir, speedConstant(yCoord) * options.level);
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

var startPostion = function (yCoord, shellNum) {
  // var variation = Math.round((Math.random() * 50));
  if (yCoord === 120) {
    return shellNum * 275;
  } else if (yCoord === 210) {
    return shellNum * 400;
  } else {
    return shellNum * 266;
  }
};

Util.inherits(Shell, MovingObject);

Shell.prototype.type = "Shell";

Shell.prototype.draw = function (ctx) {
  var img = new Image();

  img.src = this.imgSource;
  ctx.drawImage(img, this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
};

module.exports = Shell;
