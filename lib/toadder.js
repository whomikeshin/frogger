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


  var startScreen = new Image ();
  startScreen.src = './images/startscreen.png';

  startScreen.onload = function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(startScreen, 0, 0, canvasEl.width, canvasEl.height);

    // objects.forEach(function(obj) {
    //   ctx.fillStyle = obj.color;
    //   ctx.fillRect(obj.left, obj.top, obj.width, obj.height);
    // });
  };

  var button = objects[0];

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

});

objects.push({
  width: 400,
  height: 60,
  top: 430,
  left: 200
});
