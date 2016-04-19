var Util = require("./util");

var Gate = function (options) {
  this.color = "#0000FF";
  this.dim = [80, 90];
  this.pos = options.pos;
  this.game = options.game;
  this.marked = false;
};

Gate.prototype.draw = function (ctx) {
  var gate = this;
  var pipe = new Image();
  pipe.src = './images/pipe_med.png';

  if (gate.marked) {
    var plant = new Image();
    plant.src = './images/plant.png';
    ctx.drawImage(plant, gate.pos[0], 60, gate.dim[0], 60);
  }

  ctx.drawImage(pipe, gate.pos[0], gate.pos[1], gate.dim[0], gate.dim[1]);
};

Gate.prototype.type = "Gate";

module.exports = Gate;
