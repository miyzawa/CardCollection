const baseCanvas = document.getElementById("baseCanvas");
const frameCanvas = document.getElementById("frameCanvas");
const upperLeftTextCanvas = document.getElementById("upperLeftTextCanvas");
const upperCenterTextCanvas = document.getElementById("upperCenterTextCanvas");
const upperRightTextCanvas = document.getElementById("upperRightTextCanvas");
const cardEffectTextCanvas = document.getElementById("cardEffectTextCanvas");
const uploadImageMoveAreaCanvas = document.getElementById(
  "uploadImageMoveAreaCanvas"
);

const baseCtx = baseCanvas.getContext("2d");
const frameCtx = frameCanvas.getContext("2d");
const upperLeftTextCtx = upperLeftTextCanvas.getContext("2d");
const upperCenterTexCtx = upperCenterTextCanvas.getContext("2d");
const upperRightTextCtx = upperRightTextCanvas.getContext("2d");
const cardEffectTextCtx = cardEffectTextCanvas.getContext("2d");
const uploadImageMoveAreaCtx = uploadImageMoveAreaCanvas.getContext("2d");

const container = document.getElementById("canvasContainer");

let uploadImg = null;
let offsetX = 0,
  offsetY = 0;
let dragging = false;
let dragStartX = 0,
  dragStartY = 0;
let inputText = "";

const drawTextCtx = (ctx, text, posX, posY, width, height) => {
  ctx.clearRect(0, 0, width, height);
  if (!text) return;

  ctx.font = "bold 48px Georgia";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  const lines = text.split("\n");
  const lineHeight = 42;

  lines.forEach((line, i) => {
    const y = posY + i * lineHeight;
    ctx.strokeText(line, posX, y);
    ctx.fillText(line, posX, y);
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
  const img = new Image();
  img.onload = () => {
    // 各キャンバスのエリア
    baseCanvas.width = img.width;
    baseCanvas.height = img.height;
    frameCanvas.width = img.width;
    frameCanvas.height = img.height;

    upperLeftTextCanvas.width = img.width * 0.28;
    upperLeftTextCanvas.height = img.height * 0.09;
    upperLeftTextCanvas.style.left = img.width * 0.03 + "px";
    upperLeftTextCanvas.style.top = img.height * 0.05 + "px";

    upperCenterTextCanvas.width = img.width * 0.4;
    upperCenterTextCanvas.height = img.height * 0.09;
    upperCenterTextCanvas.style.left = img.width * 0.31 + "px";
    upperCenterTextCanvas.style.top = img.height * 0.05 + "px";

    upperRightTextCanvas.width = img.width * 0.27;
    upperRightTextCanvas.height = img.height * 0.09;
    upperRightTextCanvas.style.left = img.width * 0.71 + "px";
    upperRightTextCanvas.style.top = img.height * 0.05 + "px";

    cardEffectTextCanvas.width = img.width;
    cardEffectTextCanvas.height = img.height;
    uploadImageMoveAreaCanvas.width = img.width;
    uploadImageMoveAreaCanvas.height = img.height;
    frameCanvas.width = img.width;
    frameCanvas.height = img.height;

    container.style.width = img.width + "px";
    container.style.height = img.height + "px";

    frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    frameCtx.drawImage(img, 0, 0, frameCanvas.width, frameCanvas.height);

    draw();
  };
  img.src = e.target.value;
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

uploadImageMoveAreaCanvas.addEventListener("mousedown", (e) => {
  dragStartX = e.offsetX - offsetX;
  dragStartY = e.offsetY - offsetY;
  dragging = true;
});

uploadImageMoveAreaCanvas.addEventListener("mousemove", (e) => {
  if (dragging) {
    offsetX = e.offsetX - dragStartX;
    offsetY = e.offsetY - dragStartY;
    draw();
  }
});

uploadImageMoveAreaCanvas.addEventListener("mouseup", () => (dragging = false));
uploadImageMoveAreaCanvas.addEventListener(
  "mouseleave",
  () => (dragging = false)
);

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
