const baseCanvas = document.getElementById("baseCanvas");
const frameCanvas = document.getElementById("frameCanvas");
const upperLeftTextCanvas = document.getElementById("upperLeftTextCanvas");
const upperCenterTextCanvas = document.getElementById("upperCenterTextCanvas");
const upperCenterTextYomiCanvas = document.getElementById(
  "upperCenterTextYomiCanvas"
);
const upperRightTextCanvas = document.getElementById("upperRightTextCanvas");
const cardEffectTextCanvas = document.getElementById("cardEffectTextCanvas");
const uploadImageMoveAreaCanvas = document.getElementById(
  "uploadImageMoveAreaCanvas"
);

const baseCtx = baseCanvas.getContext("2d");
const frameCtx = frameCanvas.getContext("2d");
const upperLeftTextCtx = upperLeftTextCanvas.getContext("2d");
const upperCenterTextCtx = upperCenterTextCanvas.getContext("2d");
const upperCenterTextYomiCtx = upperCenterTextYomiCanvas.getContext("2d");
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

const drawTextCtx = (ctx, canvas, text, options = {}) => {
  let {
    fontSize = 48,
    fontFamily = "Georgia",
    bold = false,
    position = "center", // "center" | "top-left" など
    margin = {}, // 例: { top: 0.1, left: 0.2 }
  } = options;

  const width = canvas.width;
  const height = canvas.height;

  const marginTop = (margin.top || 0) * height;
  const marginBottom = (margin.bottom || 0) * height;
  const marginLeft = (margin.left || 0) * width;
  const marginRight = (margin.right || 0) * width;

  ctx.clearRect(0, 0, width, height);
  if (!text) return;

  const lines = text.split("\n");
  const maxWidth = width - marginLeft - marginRight;
  const maxHeight = height - marginTop - marginBottom;

  const fontWeight = bold ? "bold" : "normal";
  const lineHeightRatio = 1.2;

  const measureFontSize = () => {
    let testFontSize = fontSize;

    while (testFontSize > 5) {
      ctx.font = `${fontWeight} ${testFontSize}px ${fontFamily}`;
      const lineHeights = testFontSize * lineHeightRatio;
      const totalTextHeight = lineHeights * lines.length;

      const widestLine = lines.reduce((max, line) => {
        const width = ctx.measureText(line).width;
        return Math.max(max, width);
      }, 0);

      if (widestLine <= maxWidth && totalTextHeight <= maxHeight) {
        return testFontSize;
      }

      testFontSize -= 1;
    }

    return testFontSize;
  };

  fontSize = measureFontSize();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;

  const lineHeight = fontSize * lineHeightRatio;
  const totalHeight = lineHeight * lines.length;

  let startX, startY;

  switch (position) {
    case "top-left":
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      startX = marginLeft;
      startY = marginTop;
      break;

    case "center":
    default:
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const availableWidth = width - marginLeft - marginRight;
      const availableHeight = height - marginTop - marginBottom;

      startX = marginLeft + availableWidth / 2;
      startY = marginTop + (availableHeight - totalHeight) / 2;
      break;
  }

  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;
    ctx.strokeText(line, startX, y);
    ctx.fillText(line, startX, y);
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

  const inputTextList = inputText.split("\nーーーーーーーーーー\n");

  drawTextCtx(upperLeftTextCtx, upperLeftTextCanvas, inputTextList[0], {
    margin: { top: 0.1 },
  });
  drawTextCtx(
    upperCenterTextYomiCtx,
    upperCenterTextYomiCanvas,
    inputTextList[1],
    {
      fontFamily: "serif",
      fontSize: 25,
    }
  );
  drawTextCtx(upperCenterTextCtx, upperCenterTextCanvas, inputTextList[2], {
    fontFamily: "serif",
  });
  drawTextCtx(upperRightTextCtx, upperRightTextCanvas, inputTextList[3], {
    margin: { top: 0.1 },
  });
  drawTextCtx(cardEffectTextCtx, cardEffectTextCanvas, inputTextList[4], {
    fontFamily: "serif",
    position: "top-left",
    margin: { top: 0.06, left: 0.03, right: 0.03, bottom: 0.06 },
  });
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

    upperCenterTextYomiCanvas.width = img.width * 0.4;
    upperCenterTextYomiCanvas.height = img.height * 0.04;
    upperCenterTextYomiCanvas.style.left = img.width * 0.31 + "px";
    upperCenterTextYomiCanvas.style.top = img.height * 0.053 + "px";

    upperCenterTextCanvas.width = img.width * 0.4;
    upperCenterTextCanvas.height = img.height * 0.07;
    upperCenterTextCanvas.style.left = img.width * 0.31 + "px";
    upperCenterTextCanvas.style.top = img.height * 0.075 + "px";

    upperRightTextCanvas.width = img.width * 0.27;
    upperRightTextCanvas.height = img.height * 0.09;
    upperRightTextCanvas.style.left = img.width * 0.71 + "px";
    upperRightTextCanvas.style.top = img.height * 0.05 + "px";

    cardEffectTextCanvas.width = img.width * 0.87;
    cardEffectTextCanvas.height = img.height * 0.333;
    cardEffectTextCanvas.style.left = img.width * 0.068 + "px";
    cardEffectTextCanvas.style.top = img.height * 0.605 + "px";

    uploadImageMoveAreaCanvas.width = img.width;
    uploadImageMoveAreaCanvas.height = img.height;

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
