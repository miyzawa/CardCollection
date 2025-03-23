const baseCanvas = document.getElementById("baseCanvas");
const frameCanvas = document.getElementById("frameCanvas");
const upperLeftTextCanvas = document.getElementById("upperLeftTextCanvas");
const baseCtx = baseCanvas.getContext("2d");
const frameCtx = frameCanvas.getContext("2d");
const upperLeftTextCtx = upperLeftTextCanvas.getContext("2d");
const container = document.getElementById("canvasContainer");

let uploadImg = null;
let offsetX = 0,
  offsetY = 0;
let dragging = false;
let dragStartX = 0,
  dragStartY = 0;
let inputText = "";

const drawTextCtx = (ctx, canvas, text, posX, posY) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!text) return;

  ctx.font = "bold 48px Georgia";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  const lines = text.split("\n");
  const lineHeight = 42;

  const centerX = canvas.width * posX;
  const centerY = canvas.height * posY;

  lines.forEach((line, i) => {
    const y = centerY + i * lineHeight;
    ctx.strokeText(line, centerX, y);
    ctx.fillText(line, centerX, y);
  });
};

const draw = () => {
  baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
  if (uploadImg) {
    const imgAspect = uploadImg.width / uploadImg.height;
    const drawWidth = baseCanvas.width;
    const drawHeight = drawWidth / imgAspect;

    baseCtx.drawImage(uploadImg, offsetX, offsetY, drawWidth, drawHeight);
  }
};

document.getElementById("frameSelector").addEventListener("change", (e) => {
  const frame = new Image();
  frame.onload = () => {
    baseCanvas.width = frame.width;
    baseCanvas.height = frame.height;
    frameCanvas.width = frame.width;
    frameCanvas.height = frame.height;
    container.style.width = frame.width + "px";
    container.style.height = frame.height + "px";

    frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    frameCtx.drawImage(frame, 0, 0, frameCanvas.width, frameCanvas.height);

    draw();
  };
  frame.src = e.target.value;
});

document.getElementById("uploadImage").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      uploadImg = img;
      offsetX = 0;
      offsetY = frameCanvas.height * (1 / 6);
      draw();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("inputText").addEventListener("input", (e) => {
  inputText = e.target.value;
  draw();
});

frameCanvas.addEventListener("mousedown", (e) => {
  dragStartX = e.offsetX - offsetX;
  dragStartY = e.offsetY - offsetY;
  dragging = true;
});

frameCanvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    offsetX = e.offsetX - dragStartX;
    offsetY = e.offsetY - dragStartY;
    draw();
  }
});

frameCanvas.addEventListener("mouseup", () => (dragging = false));
frameCanvas.addEventListener("mouseleave", () => (dragging = false));

document.getElementById("downloadBtn").addEventListener("click", () => {
  const combinedCanvas = document.createElement("canvas");
  combinedCanvas.width = baseCanvas.width;
  combinedCanvas.height = baseCanvas.height;
  const ctx = combinedCanvas.getContext("2d");
  ctx.drawImage(baseCanvas, 0, 0);
  ctx.drawImage(frameCanvas, 0, 0);
  const link = document.createElement("a");
  link.download = "framed_image.png";
  link.href = combinedCanvas.toDataURL();
  link.click();
});

window.onload = () => {
  document.getElementById("frameSelector").dispatchEvent(new Event("change"));
};
