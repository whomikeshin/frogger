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

  MovingObject.call(this, options);
};

var speedConstant = function (yCoord) {
  if (yCoord === 100) {
    return 0.9;
  } else if (yCoord === 150) {
    return 1;
  } else if (yCoord === 200) {
    return 1;
  } else if (yCoord === 250) {
    return 0.6;
  } else {
    return 0.8;
  }
};

var startPostion = function (yCoord,logNum) {
  var variation = Math.round((Math.random() * 50));
  if (yCoord === 100) {
    return logNum * 275;
  } else if (yCoord === 200) {
    return logNum * 400;
  } else {
    return logNum * 266;
  }
};

Util.inherits(Log, MovingObject);

Log.prototype.type = "Log";

module.exports = Log;
