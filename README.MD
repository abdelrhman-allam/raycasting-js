# RayCasting Example with JS :flashlight:

> A humbel implementation for simple raycasting projection (90`s, The world in the famous video game Wolfenstein 3D), and because it is part of my childhood, and empower my skills with JS, Math, Math, and Math...

![Simple Demo](public/images/simple_demo.gif)

> It uses 2 canvas

- Left canvas for display the updown view for the player and maze
- Right canvas for project the 3d from the `raycast()` function

### Clone

- Clone this repo to your local machine using `https://github.com/abdelrhman-allam/raycasting-js.git`

> Open terminal

```shell
$ git clone https://github.com/abdelrhman-allam/raycasting-js.git
```

### Setup

- If you want more syntax highlighting, format your code like this:

> Install npm packages

```shell
$ npm install
```

> Start the development server

```shell
$ npm run start
```

### Modify for fun

`src/main.js`

```javascript
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
}
```

## Resourcs

## Alot of Resourcs

- YouTube https://www.youtube.com/results?search_query=ray+casting
- The Coding Train
- 3DSage
