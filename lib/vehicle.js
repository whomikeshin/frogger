var Util = require("./util");
var MovingObject = require("./movingObject");
var Frog = require("./frog");

var DEFAULTS = {
  COLOR: "#FF0000",
  LEVEL: 1.5,
};

var Vehicle = function (options = {}) {
  var xCoord = options.pos[0];
  var yCoord = options.pos[1];
  var xDir = xCoord === 50 ? 1 : -1;

  options.pos[0] += (startPostion(options.vehicleNum) * xDir);
  options.color = DEFAULTS.COLOR;
  options.vel = options.vel ||
    Util.rowVec(xDir, speedConstant(yCoord) * DEFAULTS.LEVEL);
  options.dim = options.dim || Util.dim(yCoord);

  MovingObject.call(this, options);
};

var speedConstant = function (yCoord) {
  if (yCoord === 400) {
    return 0.8;
  } else if (yCoord === 450) {
    return 0.9;
  } else if (yCoord === 500) {
    return 0.75;
  } else if (yCoord === 550) {
    return 0.6;
  } else {
    return 0.5;
  }
};

var startPostion = function (vehicleNum) {
  return (vehicleNum + 1) * 250 + Math.round((Math.random() * 50));
};

// Vehicle.prototype.collideWith = function (otherObject) {
//   if (otherObject.type === "Frog") {
//     otherObject.relocate();
//   }
// };

Util.inherits(Vehicle, MovingObject);

Vehicle.prototype.type = "Vehicle";

module.exports = Vehicle;
