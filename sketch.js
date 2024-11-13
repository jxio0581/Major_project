let img;
let music;
let numSegments = 300;
let segments = [];
let button;
let sliderVolume;
let sliderRate;

function preload() {
  img = loadImage('assets/Claude_Monet.jpg');
  music = loadSound('assets/LaTale_Music.mp3');
}

function setup() {
  // creat canvas to contain both img and button
  createCanvas(windowWidth, windowHeight - 50);

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
  
  // Iterate over the array and draw the rectangle
  for (const segment of segments) {
    segment.draw();
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

// create a class to store information of segments
class ImageSegment {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }
// draw segments
  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}
// Update image to fit window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 50);
  segments = [];  // clear the array
  calculateSegments(img, numSegments);
  redraw();
}