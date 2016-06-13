var Game = require("./game");
var GameView = require("./gameView");

// var Toadder = function () {
//   // this.LINKS = [];
//   // this.startNewGame = false;
// };
//
// Toadder.LINKS = [];
// Toadder.STARTGAME = false;

var canvasEl = document.getElementsByTagName("canvas")[0],
    canvasElLeft = canvasEl.offsetLeft,
    canvasElTop = canvasEl.offsetTop,
    ctx = canvasEl.getContext("2d"),
    links = [];
    startNewGame = false;

document.addEventListener("DOMContentLoaded", function(){
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var startScreen = new Image ();
  startScreen.src = './images/startscreen.png';

  startScreen.onload = function() {

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.drawImage(startScreen, 0, 0, canvasEl.width, canvasEl.height);
  };

  canvasEl.addEventListener("click", startGame, false);
  canvasEl.addEventListener("click", clickLink, false);
});

function startGame(event) {
  var game = new Game();
  var startButton = { yPos: 445, xPos: 200, xDim: 400, yDim: 60 };

  var x = event.pageX - canvasElLeft,
      y = event.pageY - canvasElTop;

  if (y > startButton.yPos &&
      y < startButton.yPos + startButton.yDim &&
      x > startButton.xPos &&
      x < startButton.xPos + startButton.xDim &&
      !startNewGame) {
        new GameView(game, ctx).start();
      }
  startNewGame = true;
}

function clickLink(event) {
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
}

links.push(
  { url: "http://michaelkshin.com", xPos: 50, yPos: 670, xDim: 145, yDim: 20 },
  { url: "http://github.com/whomikeshin", xPos: 355, yPos: 670, xDim: 95, yDim: 20 },
  { url: "https://www.linkedin.com/in/mikekshin", xPos: 640, yPos: 670, xDim: 110, yDim: 20 }
);
