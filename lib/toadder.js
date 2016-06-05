var Game = require("./game");
var GameView = require("./gameView");

var canvasEl = document.getElementsByTagName("canvas")[0],
    canvasElLeft = canvasEl.offsetLeft,
    canvasElTop = canvasEl.offsetTop,
    ctx = canvasEl.getContext("2d"),
    objects = [];

document.addEventListener("DOMContentLoaded", function(){
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  ctx.fillStyle = "#00ff7f";
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  var button = {
    color: "#05EFFF",
    width: 150,
    height: 100,
    top: 20,
    left: 15
  };

  ctx.fillStyle = button.color;
  ctx.fillRect(0, 0, button.width, button.height);

  canvasEl.addEventListener("click", function(event){
    var game = new Game();

    var x = event.pageX - canvasElLeft,
        y = event.pageY - canvasElTop;

    if (y > button.top &&
        y < button.top + button.height &&
        x > button.left &&
        x < button.left + button.width) {
          new GameView(game, ctx).start();
        }
  }, false);


  // var game = new Game();

  // new StartScreen().draw(ctx);
  // if (StartScreen.gameStart) {
  //   new GameView(game, ctx).start();
  // }
});

// canvasEl.addEventListener("click", function(event){
//   var game = new Game();
//
//   var x = event.pageX - canvasElLeft,
//       y = event.pageY - canvasElTop;
//
//   ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//
//   objects.forEach(function(obj) {
//     if (y > obj.top &&
//         y < obj.top + obj.height &&
//         x > obj.left &&
//         x < obj.left + obj.width) {
//           new GameView(game, ctx).start();
//         }
//   });
// }, false);

// objects.push({
//   color: "#05EFFF",
//   width: 150,
//   height: 100,
//   top: 20,
//   left: 15
// });
//
// objects.forEach(function(obj) {
//   ctx.fillStyle = obj.color;
//   ctx.fillRect(obj.left, obj.top, obj.width, obj.height);
// });
