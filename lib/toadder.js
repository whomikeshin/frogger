var Game = require("./game");
var GameView = require("./gameView");

var canvasEl = document.getElementsByTagName("canvas")[0],
    canvasElLeft = canvasEl.offsetLeft,
    canvasElTop = canvasEl.offsetTop,
    ctx = canvasEl.getContext("2d"),
    links = [];

document.addEventListener("DOMContentLoaded", function(){
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var startScreen = new Image ();
  startScreen.src = './images/startscreen.png';

  startScreen.onload = function() {

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(startScreen, 0, 0, canvasEl.width, canvasEl.height);
  };

  canvasEl.addEventListener("click", function(event){
    var game = new Game();
    var button = { yPos: 445, xPos: 200, xDim: 400, yDim: 60 };

    var x = event.pageX - canvasElLeft,
        y = event.pageY - canvasElTop;

    if (y > button.yPos &&
        y < button.yPos + button.yDim &&
        x > button.xPos &&
        x < button.xPos + button.xDim) {
          new GameView(game, ctx).start();
        }
  }, false);

  canvasEl.addEventListener("click", function(event){

    var x = event.pageX - canvasElLeft,
        y = event.pageY - canvasElTop;

    links.forEach(function(link){

      if (y > link.yPos &&
          y < link.yPos + link.yDim &&
          x > link.xPos &&
          x < link.xPos + link.xDim) {
            window.location = link.url;
          }
    });
  }, false);
});

links.push(
  { url: "http://michaelkshin.com", xPos: 50, yPos: 670, xDim: 145, yDim: 20 },
  { url: "http://github.com/whomikeshin", xPos: 355, yPos: 670, xDim: 95, yDim: 20 },
  { url: "https://www.linkedin.com/in/mikekshin", xPos: 640, yPos: 670, xDim: 110, yDim: 20 }
);
