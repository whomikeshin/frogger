var Util = require("./util");

var gateCount = 5;

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

  if (gate.marked) {
    var plant = new Image();
    plant.src = './images/plant.png';
    ctx.drawImage(plant, gate.pos[0], 35, gate.dim[0], 60);
  }
  pipe.src = './images/pipe_big.png';

  ctx.drawImage(pipe, gate.pos[0], gate.pos[1], gate.dim[0], gate.dim[1]);

};

Gate.prototype.type = "Gate";

module.exports = Gate;
