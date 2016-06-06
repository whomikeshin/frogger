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

    links.forEach(function(link) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px sans-serif";
      ctx.fillText(link.text, link.xPos, link.yPos + 20);
    });
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
          x < link.xPos + ctx.measureText(link.text).width) {
            window.location = link.url;
          }
    });
  }, false);

});

links.push(
  { url: "http://michaelkshin.com", text: "Portfolio",
    xPos: 100, yPos: 665, yDim: 20, mouseOver: false },
  { url: "http://github.com/whomikeshin", text: "Github",
    xPos: 367, yPos: 665, yDim: 20, mouseOver: false },
  { url: "https://www.linkedin.com/in/mikekshin", text: "LinkedIn",
    xPos: 634, yPos: 665, yDim: 20, mouseOver: false }
);
