const canvas = document.createElement("canvas");
const canvas3d = document.createElement("canvas");
canvas.width = 600;
canvas.height = 400;
canvas3d.width = 600;
canvas3d.height = 400;
canvas3d.style = "background-color:black";
canvas.style = "background-color:black";
const ctx = canvas.getContext("2d");
const ctx3d = canvas3d.getContext("2d");
document.body.appendChild(canvas);
document.body.appendChild(canvas3d);

let input = {
  w: false,
  s: false,
  a: false,
  d: false,
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", function (e) {
  input[e.key] = true;
});

document.addEventListener("keyup", function (e) {
  input[e.key] = false;
});

const FOV = Math.PI / 3;
const HALF_FOV = FOV / 2;
const NUM_RAYS = 120;
const MAX_DEPTH = 600;
const TILE = 50;
const DELTA_ANGLE = FOV / NUM_RAYS;
const DIST = NUM_RAYS / (2 * Math.tan(HALF_FOV));
const PROJ_COEFF = 3 * DIST * TILE;
const SCALE = canvas.width / NUM_RAYS;
const HALF_HEIGHT = canvas.height / 2;
const HALF_WIDTH = canvas.width / 2;
function Player() {
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
  this.dx = 0.1;
  this.dy = 0.1;
  this.a = 0;
  this.speed = 5;
  this.radius = 5;
}
Player.prototype.getPos = function () {
  return { x: this.x, y: this.y };
};
Player.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "green";
  ctx.lineWidth = 5;
  ctx.fill();

  // dir ray
  // ctx.beginPath();
  // ctx.strokeStyle = "#ff0000";
  // ctx.lineWidth = 1;
  // ctx.moveTo(this.x, this.y);
  // ctx.lineTo(
  //   this.x * canvas.width * Math.cos(this.a),
  //   this.y * canvas.height * Math.sin(this.a)
  // );
  // ctx.stroke();
};

Player.prototype.update = function () {
  let sin_a = Math.sin(this.a);
  let cos_a = Math.cos(this.a);
  if (input.w == true) {
    this.y += this.speed * sin_a;
    this.x += this.speed * cos_a;
  }
  if (input.s == true) {
    this.y += -this.speed * sin_a;
    this.x += -this.speed * cos_a;
  }

  if (input.a == true) {
    this.y += -this.speed * cos_a;
    this.x += this.speed * cos_a;
  }
  if (input.d == true) {
    this.y += this.speed * cos_a;
    this.x += -this.speed * sin_a;
  }

  if (input.ArrowLeft == true) {
    this.a -= 0.2;
  }
  if (input.ArrowRight == true) {
    this.a += 0.2;
  }
};

function Map() {
  this.tileSize = TILE;
  this.grid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  this.worldMap = [];

  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      if (this.grid[i][j] == 1)
        this.worldMap.push([i * this.tileSize, j * this.tileSize]);
    }
  }
  console.log(this.worldMap);
}

Map.prototype.draw = function () {
  ctx.strokeStyle = "#ffffff";
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      if (this.grid[i][j] == 1)
        ctx.strokeRect(
          j * this.tileSize,
          i * this.tileSize,
          this.tileSize,
          this.tileSize
        );
    }
  }
};

let p = new Player();
let m = new Map();

function rayCasting(px, py, pangle) {
  //tx.lineWidth = 1;

  let current_angle = pangle - HALF_FOV;
  for (let ray = 0; ray < NUM_RAYS; ray++) {
    let sin_a = Math.sin(current_angle);
    let cos_a = Math.cos(current_angle);
    for (let depth = 0; depth < MAX_DEPTH; depth++) {
      let x = px + depth * cos_a;
      let y = py + depth * sin_a;
      ctx.strokeStyle = "#ff0000";
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stroke();

      let dy = parseInt(parseInt(y / m.tileSize) * m.tileSize);
      let dx = parseInt(parseInt(x / m.tileSize) * m.tileSize);
      //console.log(dy, dx);
      if (m.worldMap.some((c) => c[0] == dy && c[1] == dx)) {
        let color = parseInt(255 / (1 + depth * depth * 0.001));
        depth = depth * Math.cos(pangle - current_angle);
        let projHeight = PROJ_COEFF / depth;

        ctx3d.fillStyle = `#${color}${color}${color / 3}`;
        ctx3d.fillRect(
          ray * SCALE,
          HALF_HEIGHT - projHeight / 2,
          SCALE,
          projHeight
        );
        ctx3d.fill();

        break;
        // draw ray
      }
    }
    current_angle += DELTA_ANGLE;
  }
}

let update = () => {
  // main update objects
  p.update();
};

let draw = () => {
  // sky
  ctx3d.fillStyle = `#0000ff`;
  ctx3d.fillRect(0, 0, canvas3d.width, HALF_HEIGHT);
  // ground
  ctx3d.fillStyle = `#cccccc`;
  ctx3d.fillRect(0, HALF_HEIGHT, canvas3d.width, HALF_HEIGHT);
  ctx3d.fillStyle = "#000000";
  // main draw objects
  m.draw();
  p.draw();
  rayCasting(p.x, p.y, p.a);
};
let loop = () => {
  update();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "#000000";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx3d.clearRect(0, 0, canvas3d.width, canvas3d.height);
  draw();

  setTimeout(loop, 1000 / 45);
};

loop();
