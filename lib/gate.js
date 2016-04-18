var Util = require("./util");

var Gate = function (options) {
  this.color = "#0000FF";
  this.dim = [80, 90];
  this.pos = options.pos;
  this.game = options.game;
  this.marked = false;
  // this.extra = options.extra;
};

Gate.prototype.draw = function (ctx) {
  var gate = this;
  var pipe = new Image();
  pipe.src = './images/pipe_med.png';

  // if (gate.extra) {
  //   var shroom = new Image();
  //   shroom.src = './images/shroom.png';
  //   ctx.drawImage(shroom, gate.pos[0], 60, gate.dim[0], 60);
  // }

  if (gate.marked) {
    var plant = new Image();
    plant.src = './images/plant.png';
    ctx.drawImage(plant, gate.pos[0], 60, gate.dim[0], 60);
  }

  ctx.drawImage(pipe, gate.pos[0], gate.pos[1], gate.dim[0], gate.dim[1]);
};

Gate.prototype.type = "Gate";

module.exports = Gate;
