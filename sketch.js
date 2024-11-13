
let img;
let numSegments = 300;

function preload() {
  img = loadImage('assets/Claude_Monet.jpg'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // noLoop();
}

function draw() {
  background(255);
  let scaleFactor = min(width / img.width, height / img.height);
  let displayWidth = img.width * scaleFactor;
  let displayHeight = img.height * scaleFactor;

  let offsetX = (width - displayWidth) / 2;
  let offsetY = (height - displayHeight) / 2;

  let segmentWidth = displayWidth / numSegments;
  let segmentHeight = displayHeight / numSegments;

  for (let segYPos = 0; segYPos < displayHeight; segYPos += segmentHeight) {
    for (let segXPos = 0; segXPos < displayWidth; segXPos += segmentWidth) {
      let originalX = segXPos / scaleFactor;
      let originalY = segYPos / scaleFactor;
      let segmentColour = img.get(originalX + (segmentWidth / scaleFactor) / 2, originalY + (segmentHeight / scaleFactor) / 2);
      fill(segmentColour);
      noStroke();
      rect(offsetX + segXPos, offsetY + segYPos, segmentWidth, segmentHeight);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
