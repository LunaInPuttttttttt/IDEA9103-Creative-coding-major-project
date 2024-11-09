//To make sure the effect is clear, I will first test the effect of a periodic change in one of the figures
let radiantCircle;
let radiantCircleWithRays; //Add a second figure effect test

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(128, 139, 140);

  radiantCircle = new RadiantCircle(width / 8, height / 4);
  radiantCircleWithRays = new RadiantCircleWithRays(width / 2, height / 4);
}

function draw() {
  background(128, 139, 140);

  //Displays and adds smoothing effects
  radiantCircle.displayWithEasing();
  radiantCircleWithRays.displayWithEasing();
}

//Added timing scaling effect for RadiantCircle
class RadiantCircle {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.numRays = 30;
    this.maxRadius = 65;
    this.innerRadius = 20;
    this.scaleFactor = 1; //The current scaling factor
    this.targetScaleFactor = 1.2; //The expected scaling factor
    this.easingSpeed = 0.05; //The speed of the smoothing effect
  }

  displayWithEasing() {
    //Use lerp to let scaleFactor approach targetScaleFactor slowly
    this.scaleFactor = lerp(this.scaleFactor, this.targetScaleFactor, this.easingSpeed);
    
    //Check that scaleFactor is close to targetScaleFactor
    //Change the target value when it is close
    if (abs(this.scaleFactor - this.targetScaleFactor) < 0.01) {
      this.targetScaleFactor = this.targetScaleFactor === 1.2 ? 0.8 : 1.2; //Change the target scale value
    }

    for (let i = 0; i < this.numRays; i++) {
      let angle = map(i, 0, this.numRays, 0, TWO_PI);
      for (let r = this.innerRadius; r < this.maxRadius * this.scaleFactor; r += random(8, 12)) {
        let x = this.cx + cos(angle) * r;
        let y = this.cy + sin(angle) * r;
        let dotSize = map(r, this.innerRadius, this.maxRadius, 3, 8);
        fill(0);
        noStroke();
        ellipse(x, y, dotSize, dotSize);
      }
    }
    
    fill(0);
    noStroke();
    ellipse(this.cx, this.cy, 3, 3);
  }
}

//Added timing scaling effect for RadiantCircleWithRays
class RadiantCircleWithRays {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.numRays = 50;
    this.baseMaxRadius = 65;
    this.currentLengthFactor = 1.0; //The current length factor
    this.targetLengthFactor = 1.5; //The expected length factor
    this.easingSpeed = 0.05; //The speed of the smoothing effect
    this.lastSwitchTime = 0;
    this.switchInterval = 1500;
  }

  displayWithEasing() {
    //Get the current time
    let currentTime = millis();

    //Check if the switching time is reached
    if (currentTime - this.lastSwitchTime > this.switchInterval) {
      //Switch the target length factor
      this.targetLengthFactor = this.targetLengthFactor === 1.2 ? 0.8 : 1.2;
      this.lastSwitchTime = currentTime;
    }

    //Use lerp to make currentLengthFactor slowly approach targetLengthFactor
    this.currentLengthFactor = lerp(this.currentLengthFactor, this.targetLengthFactor, this.easingSpeed);

    //Draw the background circle
    fill(150, 170, 180, 200);
    ellipse(this.cx - 30, this.cy - 30, 50, 50);
    fill(173, 135, 134);
    ellipse(this.cx + 30, this.cy + 10, 40, 40);
    fill(213, 177, 146);
    ellipse(this.cx - 30, this.cy + 30, 20, 20);

    //Draws radiations, with lengths scaled by currentLengthFactor
    strokeWeight(1);
    stroke(0);
    for (let i = 0; i < this.numRays; i++) {
      let angle = map(i, 0, this.numRays, 0, TWO_PI);
      let endX = this.cx + cos(angle) * this.baseMaxRadius * this.currentLengthFactor;
      let endY = this.cy + sin(angle) * this.baseMaxRadius * this.currentLengthFactor;
      line(this.cx, this.cy, endX, endY);
    }

    //Draw the center circle
    fill(0);
    noStroke();
    ellipse(this.cx, this.cy, 50, 50);
    fill(128, 139, 140);
    ellipse(this.cx, this.cy, 40, 40);
  }
}