var GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.toad = this.game.addToad();
};

GameView.MOVES = {
  up: [ 0, -45],
  left: [-50,  0],
  down: [ 0,  45],
  right: [ 50,  0],
};


GameView.prototype.bindKeyHandlers = function () {
  var toad = this.toad;

  Object.keys(GameView.MOVES).forEach(function (k) {
    var move = GameView.MOVES[k];
    key(k, function () { toad.jump(move); });
  });
};

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
  var timeDelta = this - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
