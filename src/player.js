import game from "./game.js";

function Player() {}

Player.prototype.draw = () => {
  //   game.ctx.beginPath();
  //   game.ctx.moveTo(75, 50);
  //   game.ctx.lineTo(100, 75);
  //   game.ctx.lineTo(100, 25);
  //   game.ctx.fill();
  game.ctx.arc(75, 75, 50, 1, Math.PI * 2); // Outer circle
};

export default Player;
