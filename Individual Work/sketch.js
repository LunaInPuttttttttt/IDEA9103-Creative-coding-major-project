//To make sure the effect is clear, I will first test the effect of a periodic change in one of the figures
let radiantCircle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(128, 139, 140);

  radiantCircle = new RadiantCircle(width / 8, height / 4);
}

function draw() {
  background(128, 139, 140);

  //Displays and adds smoothing effects
  radiantCircle.displayWithEasing();
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