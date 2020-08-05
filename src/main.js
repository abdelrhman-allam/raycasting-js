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
const NUM_RAYS = 300;
const MAX_DEPTH = 600;
const TILE = 50;
const DELTA_ANGLE = FOV / NUM_RAYS;
const DIST = NUM_RAYS / (2 * Math.tan(HALF_FOV));
const PROJ_COEFF = DIST * TILE;
const SCALE = canvas.width / NUM_RAYS;
const HALF_HEIGHT = canvas.height / 2;
const HALF_WIDTH = canvas.width / 2;
function Player() {
  this.x = 100; //canvas.width / 2;
  this.y = 100; //canvas.height / 2;
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
  ctx.lineWidth = 1;
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
    this.a -= 0.3;
  }
  if (input.ArrowRight == true) {
    this.a += 0.3;
  }
};

function Map() {
  this.tileSize = TILE;
  this.grid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  this.worldMap = [];

  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      if (this.grid[i][j] != 0)
        this.worldMap.push([j * this.tileSize, i * this.tileSize]);
    }
  }
}

Map.prototype.draw = function () {
  ctx.strokeStyle = "#ffffff";
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      if (this.grid[i][j] != 0)
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

function mapping(x, y) {
  return [parseInt(x / TILE) * TILE, parseInt(y / TILE) * TILE];
}
function rayCasting(px, py, pangle) {
  [xm, ym] = mapping(px, py);
  let current_angle = pangle - HALF_FOV;
  for (let ray = 0; ray < NUM_RAYS; ray++) {
    let sin_a = Math.sin(current_angle);
    let cos_a = Math.cos(current_angle);
    sin_a = sin_a == 0 ? 0.000001 : sin_a;
    cos_a = cos_a == 0 ? 0.000001 : cos_a;

    // verticals
    let x, y, dx, dy, depth, depth_v, depth_h;
    [x, dx] = dx = cos_a >= 0 ? [xm + TILE, 1] : [xm, -1];
    for (let i = 0; i <= canvas.width; i += TILE) {
      depth_v = (x - px) / cos_a;
      y = py + depth_v * sin_a;
      let t = mapping(x + dx, y);
      if (m.worldMap.some((c) => c[0] == t[0] && c[1] == t[1])) {
        break;
      }
      x += dx * TILE;
    }

    // horizantals
    [y, dy] = sin_a >= 0 ? [ym + TILE, 1] : [ym, -1];

    for (let i = 0; i <= canvas.width; i += TILE) {
      depth_h = (y - py) / sin_a;
      x = px + depth_h * cos_a;
      t = mapping(x, dy + y);
      if (m.worldMap.some((c) => c[0] == t[0] && c[1] == t[1])) {
        break;
      }
      y += dy * TILE;
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ff0000";
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();

    // projection 3D
    depth = depth_v < depth_h ? depth_v : depth_h;
    depth *= Math.cos(pangle - current_angle);
    let projHeight = PROJ_COEFF / depth;
    let color = parseInt(255 / (1 + depth * depth * 0.0002));
    ctx3d.fillStyle = `rgba(${color / 1},${color},${color / 2},1)`;
    ctx3d.fillRect(
      ray * SCALE,
      parseInt(HALF_HEIGHT - projHeight / 2),
      SCALE,
      projHeight
    );
    ctx3d.fill();
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

  setTimeout(loop, 1000 / 12);
};

loop();
