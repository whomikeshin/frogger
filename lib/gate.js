var Util = require("./util");

var gateCount = 5;

var Gate = function (options) {
  this.color = "#0000FF";
  this.dim = [80, 70];
  this.pos = options.pos;
  this.game = options.game;
  this.marked = false;
};

Gate.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.rect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
  ctx.fill();
};

Gate.prototype.type = "Gate";

module.exports = Gate;
