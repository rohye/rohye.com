import React, { useEffect } from "react";
import "./App.scss";

// any 先解决一切

const request =
  window.requestAnimationFrame || window.webkitRequestAnimationFrame;
const cancel = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

let canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D, // canvas上下文
  pr = window.devicePixelRatio || 1,
  w = window.innerWidth,
  h = window.innerHeight,
  f = 90, //距离差值
  point: any,
  r = 0,
  pi = Math.PI * 2,
  cos = Math.cos,
  random = Math.random,
  allPoint: any[] = [],
  primaryPoint: any[] = [],
  colors: any[] = [],
  animateId = 0;

// 清空之前所有保存的点坐标和颜色,给一个初始坐标值开始画
function init() {
  // 执行文字切换动画
  // switchText();
  cancel(animateId);
  allPoint = [];
  colors = [];
  primaryPoint = [];
  context.clearRect(0, 0, w, h);
  point = [
    { x: 0, y: h * 0.7 + f },
    { x: 0, y: h * 0.7 - f },
  ];
  while (point[1].x < w + f) draw(point[0], point[1]);
  arrayPushPoint(point[0], point[1]);
  // console.log(allPoint)
  // animateId = request(loop)
  loop();
}

function draw(i: any, j: any) {
  arrayPushPoint(i, j);
  context.beginPath();
  context.moveTo(i.x, i.y);
  context.lineTo(j.x, j.y);
  var nextX = j.x + (random() * 2 - 0.25) * f,
    nextY = calNextY(j.y);
  context.lineTo(nextX, nextY);
  context.closePath();
  r -= pi / -50;
  context.fillStyle =
    "#" +
    (
      ((cos(r) * 127 + 128) << 16) |
      ((cos(r + pi / 3) * 127 + 128) << 8) |
      (cos(r + (pi / 3) * 2) * 127 + 128)
    ).toString(16);
  context.fill();
  colors.push(context.fillStyle);
  point[0] = point[1];
  point[1] = { x: nextX, y: nextY };
}

function generateSpeed() {
  return Math.random() * 0.2;
}
// 保存当前画三角形的所有点，并给一个随机速度值
function arrayPushPoint(i: any, j: any) {
  let xp = {
    x: i.x,
    y: i.y,
    speedX: generateSpeed(),
    speedY: generateSpeed(),
  };
  let yp = {
    x: j.x,
    y: j.y,
    speedX: generateSpeed(),
    speedY: generateSpeed(),
  };
  let xp2 = {
    x: i.x,
    y: i.y,
    speedX: generateSpeed(),
    speedY: generateSpeed(),
  };
  let yp2 = {
    x: j.x,
    y: j.y,
    speedX: generateSpeed(),
    speedY: generateSpeed(),
  };
  allPoint.push(xp, yp);
  primaryPoint.push(xp2, yp2);
}
// 保证Y坐标会在原来的基础上90*0.9距离以内
function calNextY(p: number): any {
  var t = p + (random() * 2 - 1.1) * f;
  return t > h || t < 0 ? calNextY(p) : t;
}

function loop() {
  for (let i = 3; i < allPoint.length - 1; i += 2) {
    let nowPoint = allPoint[i];
    let primary = primaryPoint[i];
    nowPoint.x += nowPoint.speedX;
    nowPoint.y += nowPoint.speedY;
    let dissX = nowPoint.x - primary.x;
    let dissY = nowPoint.y - primary.y;
    if (Math.abs(dissX) > 40) {
      nowPoint.x = dissX > 0 ? primary.x + 40 : primary.x - 40;
      nowPoint.speedX = -nowPoint.speedX;
    }
    if (Math.abs(dissY) > 40) {
      nowPoint.y = dissY > 0 ? primary.y + 40 : primary.y - 40;
      nowPoint.speedY = -nowPoint.speedY;
    }
    allPoint[i + 1].x = nowPoint.x;
    allPoint[i + 1].y = nowPoint.y;
  }
  loopDraw();
  animateId = request(loop);
}

function loopDraw() {
  context.clearRect(0, 0, w, h);
  for (let i = 0; i < allPoint.length - 3; i += 2) {
    context.beginPath();
    context.moveTo(allPoint[i].x, allPoint[i].y);
    context.lineTo(allPoint[i + 1].x, allPoint[i + 1].y);
    context.lineTo(allPoint[i + 3].x, allPoint[i + 3].y);
    context.closePath();
    context.fillStyle = colors[i / 2];
    context.fill();
  }
}

function App() {
  useEffect(() => {
    mount();
  }, []);

  function mount() {
    canvas = document.getElementsByTagName("canvas")[0];
    context = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = w * pr;
    canvas.height = h * pr;
    context.scale(pr, pr);
    context.globalAlpha = 0.6;

    document.onclick = init;
    init();
  }

  return (
    <div className="App">
      <div id="wrapper">
        <div className="title-wrapper">
          {/* <h1 className="main-title">Rohye</h1> */}
          <h1 className="main-title">指尖上的艺术家</h1>
        </div>
        <div className="signature-wrapper">
          <h2 className="signature">若教眼前无离恨 不辞长作一码农</h2>
          {/* <h2 className="signature-switch switch">
            Talk is cheap , Show me your code
          </h2> */}
        </div>
        <p>
          <a href="https://github.com/rohye" rel="noreferrer" target="_blank">
            Github
          </a>
        </p>
        <p>
          <a href="https://blog.rohye.com">Blog</a>
        </p>
        <p>
          <a href="https://docs.rohye.com">笔记</a>
        </p>
      </div>
      <canvas></canvas>
    </div>
  );
}

export default App;
