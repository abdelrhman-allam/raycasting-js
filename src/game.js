function game() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  window.document.body.appendChild(canvas);

  return {
    canvas,
    ctx,
  };
}

let g = game();

export default g;
