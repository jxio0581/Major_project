let img;
let music;
let numSegments = 55;
let segments = [];
let button;
let sliderVolume;
let sliderRate;
let fft;

function preload() {
  img = loadImage('assets/Claude_Monet.jpg');
  music = loadSound('assets/LaTale_Music.mp3');
}

function setup() {
  // creat canvas to contain both img and button
  createCanvas(windowWidth, windowHeight - 50);
  // lower speed
  frameRate(30);
  // analyse music
  fft = new p5.FFT(0.9, 256); 
  // The technique about the buttons was learned from https://www.youtube.com/watch?v=Pn1g1wjxl_0&list=PLRqwX-V7Uu6aFcVjlDAkkGIixw70s7jpW&index=1
  // Create the play button and set the mouse click event
  button = createButton("Play");
  button.mousePressed(TogglePlaying);
  // Create sliders to set volume and speed
  sliderVolume = createSlider(0, 1, 0.5, 0.1);
  sliderRate = createSlider(0.5, 2, 1, 0.1);
  // calculate segments at first
  calculateSegments(img, numSegments);
}

function draw() {
  background(255);
  // use buttons to control music
  music.setVolume(sliderVolume.value());
  music.rate(sliderRate.value());
  placeButton()  
  // loop array to draw rect
  for (const segment of segments) {
    let frequency = fft.analyze();  //hold data
    let MusicValue = frequency[int(random(frequency.length))];  // hold a int value from music data
    segment.draw(MusicValue);
  }
}

function placeButton() {
  // Calculate the y-coordinate of the bottom of the image
  let imgBottomY = (height / 2) + (img.Height / 2);  
  // set position
  button.position((width / 2) - (button.width / 2) - 150, imgBottomY); 
  sliderVolume.position((width / 2) - (button.width / 2) - 100, imgBottomY);
  sliderRate.position((width / 2) - (button.width / 2) + 40, imgBottomY);
}

// creat a function to set button click events, click to play or pause music while changing text
function TogglePlaying() {
  if(!music.isPlaying()){
    music.play();
    music.setVolume(1);
    button.html("Pause");
  } else {
    music.pause();
    button.html("Play");
  }
}

// create a function to calculate segments and store to array
function calculateSegments(image, numSegments) {
  // Calculate the relationship between the window size and the image to get the scaling factor
  let scaleFactor = min(width / image.width, height / image.height);
  let displayWidth = image.width * scaleFactor;
  let displayHeight = image.height * scaleFactor;

  let offsetX = (width - displayWidth) / 2;
  let offsetY = (height - displayHeight) / 2;
  // Calculate the size of each segment
  let segmentWidth = displayWidth / numSegments;
  let segmentHeight = displayHeight / numSegments;
  // Loop to get segments information
  for (let y = 0; y < displayHeight; y += segmentHeight) {
    for (let x = 0; x < displayWidth; x += segmentWidth) {
      // Get the positions from the center of the segment
      let originalX = x / scaleFactor;
      let originalY = y / scaleFactor;
      // Get the color of the pixel from the image, from the center of the segment
      let segmentColor = image.get(originalX + (segmentWidth / scaleFactor) / 2, originalY + (segmentHeight / scaleFactor) / 2);
      let segment = new ImageSegment(offsetX + x, offsetY + y, segmentWidth, segmentHeight, segmentColor);
      segments.push(segment);
    }
  }
}

// create a class to store information of segments and draw rect
class ImageSegment {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = this.createColor(color);  // Make sure the color is p5.js recognizable. This code was added after an error was reported and debugged via chatGPT.
    // set two status for smoothing
    this.currentWidth = width;
    this.currentHeight = height;
    this.targetWidth = width;
    this.targetHeight = height;
    this.currentColor = this.color; 
    this.targetColor = this.color;
  }
// Make sure the color is p5.js recognizable. This code was added after an error was reported and debugged via chatGPT.
  createColor(c) {
    if (c instanceof p5.Color) {
      return c;
    } else {
      return color(c[0], c[1], c[2]);
    }
  }
  // draw dynamic rect by music data
  draw(energy) {
    // use lerp() to smooth size
    // The technique about the lerp was learned from https://p5js.org/search/?term=lerp
    this.targetWidth = map(energy, 0, 255, this.width * 0.9, this.width * 2.4);
    this.targetHeight = map(energy, 0, 255, this.height * 0.9, this.height * 2.4);
    this.currentWidth = lerp(this.currentWidth, this.targetWidth, 0.15);
    this.currentHeight = lerp(this.currentHeight, this.targetHeight, 0.15);
    // update color
    let brightFactor = 1 + energy / 255;
    let r = red(this.color) * brightFactor;
    let g = green(this.color) * brightFactor;
    let b = blue(this.color) * brightFactor;
    // make sure color is valid. This code was added after an error was reported and debugged via chatGPT.
    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);
    this.targetColor = color(r, g, b);
    // use lerpColor() to smooth color
    this.currentColor = lerpColor(this.currentColor, this.targetColor, 0.15);
    fill(this.currentColor);
    noStroke();
    // The technique about Easiest Glow Effect was learned from https://www.youtube.com/watch?v=iIWH3IUYHzM
    // creat glow effect of rect
    drawingContext.shadowBlur = 16;
    drawingContext.shadowColor = color(247,233,177);
    rect(this.x + (this.width - this.currentWidth) / 2, this.y + (this.height - this.currentWidth) / 2, this.currentWidth, this.currentHeight);
  }
}
// Update image to fit window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 50);
  segments = [];  // clear the array
  calculateSegments(img, numSegments);
  redraw();
}