/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const canvas = document.createElement(\"canvas\");\nconst canvas3d = document.createElement(\"canvas\");\ncanvas.width = 600;\ncanvas.height = 400;\ncanvas3d.width = 600;\ncanvas3d.height = 400;\ncanvas3d.style = \"background-color:black\";\ncanvas.style = \"background-color:black\";\nconst ctx = canvas.getContext(\"2d\");\nconst ctx3d = canvas3d.getContext(\"2d\");\ndocument.body.appendChild(canvas);\ndocument.body.appendChild(canvas3d);\n\nlet input = {\n  w: false,\n  s: false,\n  a: false,\n  d: false,\n  ArrowLeft: false,\n  ArrowRight: false,\n};\n\ndocument.addEventListener(\"keydown\", function (e) {\n  input[e.key] = true;\n});\n\ndocument.addEventListener(\"keyup\", function (e) {\n  input[e.key] = false;\n});\n\nconst FOV = Math.PI / 3;\nconst HALF_FOV = FOV / 2;\nconst NUM_RAYS = 300;\nconst MAX_DEPTH = 600;\nconst TILE = 50;\nconst DELTA_ANGLE = FOV / NUM_RAYS;\nconst DIST = NUM_RAYS / (2 * Math.tan(HALF_FOV));\nconst PROJ_COEFF = DIST * TILE;\nconst SCALE = canvas.width / NUM_RAYS;\nconst HALF_HEIGHT = canvas.height / 2;\nconst HALF_WIDTH = canvas.width / 2;\nfunction Player() {\n  this.x = 100; //canvas.width / 2;\n  this.y = 100; //canvas.height / 2;\n  this.dx = 0.1;\n  this.dy = 0.1;\n  this.a = 0;\n  this.speed = 2;\n  this.radius = 5;\n}\nPlayer.prototype.getPos = function () {\n  return { x: this.x, y: this.y };\n};\nPlayer.prototype.draw = function () {\n  ctx.beginPath();\n  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);\n  ctx.fillStyle = \"green\";\n  ctx.lineWidth = 1;\n  ctx.fill();\n\n  // dir ray\n  ctx.beginPath();\n  ctx.strokeStyle = \"#ff0000\";\n  ctx.lineWidth = 1;\n  ctx.moveTo(this.x, this.y);\n  ctx.lineTo(\n    this.x * canvas.width * Math.cos(this.a),\n    this.y * canvas.height * Math.sin(this.a)\n  );\n  ctx.stroke();\n};\n\nPlayer.prototype.update = function () {\n  let sin_a = Math.sin(this.a);\n  let cos_a = Math.cos(this.a);\n  if (input.w == true) {\n    this.y += this.speed * sin_a;\n    this.x += this.speed * cos_a;\n  }\n  if (input.s == true) {\n    this.y += -this.speed * sin_a;\n    this.x += -this.speed * cos_a;\n  }\n\n  if (input.a == true) {\n    this.y += -this.speed * cos_a;\n    this.x += this.speed * cos_a;\n  }\n  if (input.d == true) {\n    this.y += this.speed * cos_a;\n    this.x += -this.speed * sin_a;\n  }\n\n  if (input.ArrowLeft == true) {\n    this.a -= 0.1;\n  }\n  if (input.ArrowRight == true) {\n    this.a += 0.1;\n  }\n};\n\nfunction Map() {\n  this.tileSize = TILE;\n  this.grid = [\n    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],\n    [1, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 1],\n    [1, 0, 0, 2, 4, 0, 0, 0, 0, 0, 0, 1],\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\n    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],\n    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],\n  ];\n\n  this.worldMap = [];\n\n  for (let i = 0; i < this.grid.length; i++) {\n    for (let j = 0; j < this.grid[i].length; j++) {\n      if (this.grid[i][j] != 0)\n        this.worldMap.push([j * this.tileSize, i * this.tileSize]);\n    }\n  }\n}\n\nMap.prototype.draw = function () {\n  ctx.strokeStyle = \"#ffffff\";\n  for (let i = 0; i < this.grid.length; i++) {\n    for (let j = 0; j < this.grid[i].length; j++) {\n      if (this.grid[i][j] != 0)\n        ctx.strokeRect(\n          j * this.tileSize,\n          i * this.tileSize,\n          this.tileSize,\n          this.tileSize\n        );\n    }\n  }\n};\n\nlet p = new Player();\nlet m = new Map();\n\nfunction mapping(x, y) {\n  return [parseInt(x / TILE) * TILE, parseInt(y / TILE) * TILE];\n}\nfunction rayCasting(px, py, pangle) {\n  [xm, ym] = mapping(px, py);\n  let current_angle = pangle - HALF_FOV;\n  for (let ray = 0; ray < NUM_RAYS; ray++) {\n    let sin_a = Math.sin(current_angle);\n    let cos_a = Math.cos(current_angle);\n    sin_a = sin_a == 0 ? 0.000001 : sin_a;\n    cos_a = cos_a == 0 ? 0.000001 : cos_a;\n\n    // verticals\n    let x, y, dx, dy, depth, depth_v, depth_h;\n    [x, dx] = dx = cos_a >= 0 ? [xm + TILE, 1] : [xm, -1];\n    for (let i = 0; i <= canvas.width; i += TILE) {\n      depth_v = (x - px) / cos_a;\n      y = py + depth_v * sin_a;\n      let t = mapping(x + dx, y);\n      if (m.worldMap.some((c) => c[0] == t[0] && c[1] == t[1])) {\n        break;\n      }\n      x += dx * TILE;\n    }\n\n    ctx.beginPath();\n    ctx.lineWidth = 1;\n    ctx.strokeStyle = \"#ff0000\";\n    ctx.moveTo(px, py);\n    ctx.lineTo(x + dx, y + dy);\n    ctx.stroke();\n\n    // horizantals\n    [y, dy] = sin_a >= 0 ? [ym + TILE, 1] : [ym, -1];\n\n    for (let i = 0; i <= canvas.width; i += TILE) {\n      depth_h = (y - py) / sin_a;\n      x = px + depth_h * cos_a;\n      t = mapping(x, dy + y);\n      if (m.worldMap.some((c) => c[0] == t[0] && c[1] == t[1])) {\n        break;\n      }\n      y += dy * TILE;\n    }\n\n    // ctx.beginPath();\n    // ctx.lineWidth = 1;\n    // ctx.strokeStyle = \"#ff0000\";\n    // ctx.moveTo(px, py);\n    // ctx.lineTo(x + dx, y + dy);\n    // ctx.stroke();\n\n    // projection 3D\n    depth = depth_v < depth_h ? depth_v : depth_h;\n    depth *= Math.cos(pangle - current_angle);\n    let projHeight = PROJ_COEFF / depth;\n    let color = parseInt(255 / (1 + depth * depth * 0.0002));\n    ctx3d.fillStyle = `rgba(${color / 1},${color},${color / 2},1)`;\n    ctx3d.fillRect(\n      ray * SCALE,\n      parseInt(HALF_HEIGHT - projHeight / 2),\n      SCALE,\n      projHeight\n    );\n    ctx3d.fill();\n    current_angle += DELTA_ANGLE;\n  }\n}\n\nlet update = () => {\n  // main update objects\n  p.update();\n};\n\nlet draw = () => {\n  // sky\n  ctx3d.fillStyle = `#0000ff`;\n  ctx3d.fillRect(0, 0, canvas3d.width, HALF_HEIGHT);\n  // ground\n  ctx3d.fillStyle = `#cccccc`;\n  ctx3d.fillRect(0, HALF_HEIGHT, canvas3d.width, HALF_HEIGHT);\n  ctx3d.fillStyle = \"#000000\";\n  // main draw objects\n  m.draw();\n  p.draw();\n  rayCasting(p.x, p.y, p.a);\n};\nlet loop = () => {\n  update();\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  // ctx.fillStyle = \"#000000\";\n  // ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n  ctx3d.clearRect(0, 0, canvas3d.width, canvas3d.height);\n  draw();\n  requestAnimationFrame(loop);\n  // setTimeout(loop, 1000 / 60);\n};\n\nloop();\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });