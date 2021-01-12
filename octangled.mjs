window.onload = () => {
  let canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  drawBackground(ctx, canvas);
  const plugs = [{ x: 200, y: 200, t: "O" }];
  genPlugs(plugs, 8);
  plugs.forEach((p) => {
    drawPlug(ctx, p);
  });
};

function genPlugs(plugs, n) {
  let t = 1;
  const radius = 140;
  for (let i = 0; i < n; i++) {
    const plug = {
      t: t++,
      x: 200+radius * Math.cos((i * 2 * Math.PI) / n),
      y: 200+radius * Math.sin((i * 2 * Math.PI) / n),
    };
    plugs.push(plug);
  }
  console.log(plugs);
}

function drawBackground(ctx, canvas) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlug(ctx, plug) {
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(plug.x, plug.y, 14, 14, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.font = "20px Impact";
  ctx.fillText(plug.t, plug.x + 7, plug.y + 34);
}
