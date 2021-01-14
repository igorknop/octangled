window.onload = () => {
  let canvas = document.querySelector("canvas");
  let txtMax = document.querySelector("#max");
  let txtCircles = document.querySelector("#circles");
  let txtPlugs = document.querySelector("#plugs");
  let txtTimer = document.querySelector("#timer");
  let btnDraw = document.querySelector("button");
  let chkSolution = document.querySelector("#solution");
  canvas.width = 400;
  canvas.height = canvas.width;
  const ctx = canvas.getContext("2d");
  let MAX = Number(txtMax.value);
  let PLUGS = Number(txtPlugs.value);
  let CIRCLES = Number(txtCircles.value);
  let PPM = canvas.width / 90;
  let timer = Number(txtTimer.value);
  requestAnimationFrame(step);

  let plugs = [
    //  { x: 200, y: 200, t: "O" }
  ];
  let lines = [];
  btnDraw.addEventListener("click", (e) => {
    e.preventDefault();
    lines = [];
    plugs = [];
    MAX = Number(txtMax.value);
    PLUGS = Number(txtPlugs.value);
    CIRCLES = Number(txtCircles.value);
    PPM = canvas.width / 90;
    timer = Number(txtTimer.value);
  
    genPlugs(plugs, PLUGS, CIRCLES);
    genLines(plugs, lines, 10 * PPM * (MAX - 4));
  });
  btnDraw.click();

  canvas.addEventListener("click", ()=>{
    timer = Number(txtTimer.value);

  });

  let t0;
  let dt;

  function step(t) {
    t0 = t0 ?? t;
    dt = (t - t0) / 1000;
    timer = Math.max(0, timer-dt);

    drawBackground(ctx, canvas);
    plugs.forEach((p) => {
      drawPlug(ctx, p);
    });
    lines.filter(l=>l.top===false).forEach((l) => drawLine(ctx, l));
    lines.filter(l=>l.top===true).forEach((l) => drawLine(ctx, l));
    const total = lines.reduce((t, c) => t + c.size, 0);

    plugs.forEach((p) => {
      drawPlugTexts(ctx, p);
    });

    ctx.font = "25px Impact";
    ctx.fillText(
      `${Math.floor((total * PLUGS) / 400)}cm ${lines.length} steps`,
      10,
      canvas.height - 20
    );

    ctx.font = "50px Impact";

    ctx.fillStyle = `hsl(${timer/Number(txtTimer.value)*120}, 100%, 30%)`;
    ctx.fillText(`${Math.round(timer)}`, 340, canvas.height - 40);
    t0 = t;
    requestAnimationFrame(step);
  }

  function drawLine(ctx, l) {
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    if (l.top) {
      ctx.strokeStyle = "white";
    } else {
      ctx.strokeStyle = "gray";
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

  function genPlugs(plugs, n, circles) {
    let t = 1;
    const RADIUS_MAX = (canvas.width * 0.7) / 2;
    const RADIUS_SEG = RADIUS_MAX / circles;
    for (let c = 0; c < circles; c++) {
      const k = (2 * Math.PI) / n;
      const radius = RADIUS_SEG * (circles - c);
      for (let i = 0; i < n; i++) {
        const plug = {
          t: String.fromCharCode(65 + i + PLUGS * c),
          x: canvas.width / 2 + radius * Math.cos(i * k + k / 2),
          y: canvas.height / 2 - 20 + radius * Math.sin(i * k + k / 2),
          steps: [],
        };
        plugs.push(plug);
      }
    }
  }

  function drawBackground(ctx, canvas) {
    ctx.fillStyle = "hsl(212, 100%, 75%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawPlug(ctx, plug) {
    const PLUG_RADIUS = 15 - CIRCLES * 2;
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(plug.x, plug.y, PLUG_RADIUS, PLUG_RADIUS, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.closePath();
  }
  function drawPlugTexts(ctx, plug) {
    const PLUG_RADIUS = 15 - CIRCLES * 2;
    ctx.fillStyle = "black";
    ctx.font = "20px Impact";
    ctx.fillText(plug.t, plug.x + 7, plug.y + 34);
    ctx.globalAlpha = 1.0;
    ctx.font = "10px Impact";
    ctx.fillStyle = "black";
    if(chkSolution.checked){
      plug.steps.forEach((s, k) => {
        ctx.fillText(`${s}`, plug.x + 10 + 12 * (1 + k), plug.y + 34);
      });
    }
  }
};
