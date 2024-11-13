let font;
let tSize = 250;
let tposX = 55;
let tposY = 550;
let pointCount = 0.08;
let speed = 20.5;
let comebackSpeed = 80;
let dia = 50;
let randomPos = false;
let pointsDirection = "up";
let interactionDirection = 5;

let textPoints = [];
let spreadMultiplier = 1; // Controls how far particles spread when mouse is held
let particleColor; // Variable to hold the current color
let words = ["Redbull", "Speed", "Energy", "Power"]; // Array of words
let currentWordIndex = 0; // Index to track the current word

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(1000, 1000);
  textFont(font);
  particleColor = color(255); // Initialize with white
  generateTextPoints(words[currentWordIndex]); // Start with the first word
}

function generateTextPoints(text) {
  textPoints = []; // Clear previous points
  let points = font.textToPoints(text, tposX, tposY, tSize, {
    sampleFactor: pointCount,
  });

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let textPoint = new Interact(pt.x, pt.y, speed, dia, randomPos, comebackSpeed, pointsDirection, interactionDirection);
    textPoints.push(textPoint);
  }
}

function draw() {
  background(0);

  // Gradually increase spreadMultiplier if mouse is pressed
  if (mouseIsPressed) {
    spreadMultiplier += 0.1; // Increase this to spread faster
  } else {
    spreadMultiplier = 1; // Reset when mouse is released
  }

  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors(spreadMultiplier);

    // Change color on hover
    let d = dist(mouseX, mouseY, v.pos.x, v.pos.y);
    if (d < dia) { // If mouse is close to the point
      v.setColor(color(255, 0, 0)); // Change the color to red when hovered
    } else {
      v.setColor(particleColor); // Otherwise, use the current particle color
    }
  }
}

// Change color on mouse press
function mousePressed() {
  particleColor = color(random(255), random(255), random(255)); // New random color
}

// Change the word when space is pressed
function keyPressed() {
  if (key === ' ') {
    currentWordIndex++; // Move to the next word
    if (currentWordIndex >= words.length) {
      currentWordIndex = 0; // Loop back to the first word if at the end
    }
    generateTextPoints(words[currentWordIndex]); // Regenerate text points with the new word
  }
}

function Interact(x, y, m, d, t, s, di, p) {
  if (t) {
    this.home = createVector(random(width), random(height));
  } else {
    this.home = createVector(x, y);
  }
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  if (di == "general") {
    this.vel = createVector();
  } else if (di == "up") {
    this.vel = createVector(0, -y);
  } else if (di == "down") {
    this.vel = createVector(0, y);
  } else if (di == "left") {
    this.vel = createVector(-x, 0);
  } else if (di == "right") {
    this.vel = createVector(x, 0);
  }

  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
  this.defaultDia = d; // Store the default dia value
  this.color = particleColor; // Default color
}

Interact.prototype.setColor = function(newColor) {
  this.color = newColor;
};

Interact.prototype.behaviors = function (spreadMultiplier) {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse, spreadMultiplier);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Interact.prototype.flee = function (target, spreadMultiplier) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  // Increase the flee distance based on spreadMultiplier
  if (d < this.dia * spreadMultiplier) {
    desired.setMag(this.maxSpeed * spreadMultiplier);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Interact.prototype.show = function () {
  stroke(this.color); // Use the current particle color
  strokeWeight(4);
  point(this.pos.x, this.pos.y);
};
 
    if (d < dia) { // If mouse is close to the point 