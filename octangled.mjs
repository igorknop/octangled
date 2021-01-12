window.onload = () => {
  let canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(200,200, 14, 14, 0, 0, 2*Math.PI);
  ctx.stroke();
  ctx.closePath();
  ctx.fillStyle = "white";
  ctx.font = "20px Impact";
  ctx.fillText( "O", 200+7, 200+34);

};
