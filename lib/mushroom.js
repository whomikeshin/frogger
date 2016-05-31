var MovingObject = require("./movingObject");
var Util = require("./util");

var Mushroom = function (options) {
  this.dim = [80, 60];
  this.vel = [0, 0];
  this.pos = [40 + (160 * Math.floor(Math.random() * 5)), 59];
  this.game = options.game;
  this.imgSource = './images/shroom.png';
  this.show = this.show || false;
};

Mushroom.TIME = Math.floor((Math.random() * 400) + 1);

Mushroom.prototype.type = "Extra";

Util.inherits(Mushroom, MovingObject);

Mushroom.prototype.draw = function (ctx) {
  var shroom = this;
  var game = this.game;
  var time = Mushroom.TIME;

  if (time === game.updateTimer()) {
    shroom.show = true;
  } else if ((time + 200) < game.updateTimer()) {
    shroom.show = false;
  }

  if (shroom.show) {
    var shroom = new Image();
    shroom.src = shroom.imgSource;

    ctx.drawImage(shroom, shroom.pos[0], shroom.pos[1], shroom.dim[0], shroom.dim[1]);
  }
};



module.exports = Mushroom;
