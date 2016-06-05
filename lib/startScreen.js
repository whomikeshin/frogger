var Game = require("./game");

var StartScreen = function () {
  this.objects = [];
  this.gameStart = false;
};

StartScreen.prototype.draw = function (ctx) {
  ctx.fillStyle = "#9BCA94";
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
};

// StartScreen.prototype.startButton = function (ctx) {
//   var button = new Image ();
//   button.src = './images/life.png';
//   ctx.drawImage(button, 400, 400, 30, 40);
//
//   button.addEventListener("click", function () {
//     this.gameStart = true;
//   });
// };




module.exports = StartScreen;
