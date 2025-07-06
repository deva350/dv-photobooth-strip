const video = document.getElementById("video");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const downloadBtn = document.getElementById("downloadBtn");
const photoCanvases = [
  document.getElementById("photo1"),
  document.getElementById("photo2"),
  document.getElementById("photo3"),
];

let stream;

// Start the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
  .then(mediaStream => {
    stream = mediaStream;
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied!");
    console.error(err);
  });

// Countdown & capture
startBtn.addEventListener("click", async () => {
  for (let i = 0; i < photoCanvases.length; i++) {
    await runCountdown();
    capturePhoto(photoCanvases[i]);
  }
});

// Countdown function
function runCountdown() {
  return new Promise(resolve => {
    let count = 3;
    countdown.textContent = count;
    const timer = setInterval(() => {
      count--;
      countdown.textContent = count;
      if (count === 0) {
        clearInterval(timer);
        countdown.textContent = "";
        resolve();
      }
    }, 1000);
  });
}

// Apply filter/frame and draw
function capturePhoto(canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.filter = "contrast(1.2) brightness(1.1) saturate(1.5) hue-rotate(10deg)";
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw frame overlay
  ctx.lineWidth = 20;
  ctx.strokeStyle = "white";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Download the full strip
downloadBtn.addEventListener("click", () => {
  const finalCanvas = document.createElement("canvas");
  const singleWidth = photoCanvases[0].width;
  const singleHeight = photoCanvases[0].height;
  finalCanvas.width = singleWidth;
  finalCanvas.height = singleHeight * 3;
  const ctx = finalCanvas.getContext("2d");

  photoCanvases.forEach((canvas, i) => {
    ctx.drawImage(canvas, 0, i * singleHeight, singleWidth, singleHeight);
  });

  const link = document.createElement("a");
  link.download = "photostrip.png";
  link.href = finalCanvas.toDataURL("image/png");
  link.click();
});
