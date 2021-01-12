window.onload = () => {
  let canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  drawBackground(ctx, canvas);
  const plugs = [
    //  { x: 200, y: 200, t: "O" }
  ];
  genPlugs(plugs, 8);
  const lines = [];
  genLines(plugs, lines, 400 * 3);
  plugs.forEach((p) => {
    drawPlug(ctx, p);
  });
  lines.forEach((l) => drawLine(ctx, l));
  const total = lines.reduce((t, c) => t + c.size, 0);
  ctx.font = "25px Impact";
  ctx.fillText(
    `${Math.floor((total * 8) / 400)}cm ${lines.length} steps`,
    10,
    380
  );
};

function drawLine(ctx, l) {
  ctx.lineWidth = 5;
  if (l.top) {
    ctx.strokeStyle = "blue";
  } else {
    ctx.strokeStyle = "red";
    ctx.globalAlpha = 0.5;
  }
  ctx.beginPath();
  ctx.moveTo(l.s.x, l.s.y);
  ctx.lineTo(l.t.x, l.t.y);
  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1.0;
}

function genLines(plugs, lines, max) {
  let total = 0;
  let source = Math.floor(Math.random() * plugs.length);
  let psource = source;
  let target;
  let top = true;
  let step = 1;
  plugs[source].steps.push(step++);
  while (total < max && step < 20) {
    target = Math.floor(Math.random() * plugs.length);
    while (source === target || psource === target) {
      target = Math.floor(Math.random() * plugs.length);
    }
    const dist = Math.sqrt(
      Math.pow(plugs[source].x - plugs[target].x, 2) +
        Math.pow(plugs[source].y - plugs[target].y, 2)
    );
    lines.push({
      s: plugs[source],
      t: plugs[target],
      top,
      step: step,
      size: dist,
    });
    plugs[target].steps.push(step);
    total += dist;
    step++;
    top = !top;
    psource = source;
    source = target;
  }
}

function genPlugs(plugs, n) {
  let t = 1;
  const radius = 140;
  const k = (2 * Math.PI) / n;
  for (let i = 0; i < n; i++) {
    const plug = {
      t: String.fromCharCode(65 + i),
      x: 200 + radius * Math.cos(i * k + k / 2),
      y: 200 + radius * Math.sin(i * k + k / 2),
      steps: [],
    };
    plugs.push(plug);
  }
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
  ctx.globalAlpha = 1.0;
  ctx.font = "10px Impact";
  ctx.fillStyle = "white";
  plug.steps.forEach((s, k) => {
    ctx.fillText(`${s},`, plug.x + 10 + 12 * (1 + k), plug.y + 34);
  });
}
