export default function rayCasting(px, py, pangle) {
  //tx.lineWidth = 1;

  let current_angle = pangle - HALF_FOV;
  for (let ray = 0; ray < NUM_RAYS; ray++) {
    let sin_a = Math.sin(current_angle);
    let cos_a = Math.cos(current_angle);
    for (let depth = 0; depth < MAX_DEPTH; depth++) {
      let x = px + depth * cos_a;
      let y = py + depth * sin_a;
      // if (ray % 4 == 0) {
      //   ctx.beginPath();
      //   ctx.lineWidth = 1;
      //   ctx.strokeStyle = "#ff0000";
      //   ctx.moveTo(px, py);
      //   ctx.lineTo(x, y);
      //   ctx.stroke();
      // }
      let dy = parseInt(parseInt(y / m.tileSize) * m.tileSize);
      let dx = parseInt(parseInt(x / m.tileSize) * m.tileSize);
      //console.log(dy, dx);
      if (m.worldMap.some((c) => c[0] == dy && c[1] == dx)) {
        let color = parseInt(255 / (1 + depth * depth * 0.0001));
        depth = depth * Math.cos(pangle - current_angle);
        let projHeight = PROJ_COEFF / depth;

        ctx3d.fillStyle = `rgba(${color / 3},${color},${color / 2},1)`;

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
