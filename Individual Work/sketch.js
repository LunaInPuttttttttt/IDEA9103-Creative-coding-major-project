//To make sure the effect is clear, I will first test the effect of a periodic change in one of the figures
let radiantCircle;
let radiantCircleWithRays;
let radiantRaysWithConcentricCircles;
let outerDots;
let radiantRaysWithTargetCircles;
let crossLines;
let outerDots2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(128, 139, 140);

  radiantCircle = new RadiantCircle(width / 8, height / 4);
  radiantCircleWithRays = new RadiantCircleWithRays(width / 2, height / 4);
  radiantRaysWithConcentricCircles = new RadiantRaysWithConcentricCircles(width / 8, height / 1.5, 2);
  outerDots = new OuterDots(width / 8, height / 1.5, 65, 30);
  radiantRaysWithTargetCircles = new RadiantRaysWithTargetCircles(width / 2, height / 1.5);
  crossLines = new CrossLines(width / 2, height / 1.5, 60);
  outerDots2 = new OuterDots2(width / 2, height / 1.5, 65, 12);
}

function draw() {
  background(128, 139, 140);

  //Displays and adds smoothing effects
  radiantCircle.displayWithEasing();
  radiantCircleWithRays.displayWithEasing();
  radiantRaysWithConcentricCircles.display();
  outerDots.displayWithSizeEasing();
  radiantRaysWithTargetCircles.display();
  crossLines.display();
  outerDots2.displayWithRotation();
}

//Added timing scaling effect for RadiantCircle
class RadiantCircle {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.numRays = 30;
    this.maxRadius = 65;
    this.innerRadius = 20;
    this.scaleFactor = 0.8; //The current scaling factor
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
      this.targetLengthFactor = this.targetLengthFactor === 1.5 ? 1.0 : 1.5;
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

//Keep original effect
class RadiantRaysWithConcentricCircles {
  constructor(cx, cy, radiusCount) {
    this.cx = cx;
    this.cy = cy;
    this.radiusCount = radiusCount;
    this.numRays = 30;
    this.radiusStep = 25;
    this.maxRadius = 65;
  }

  display() {
    //Draw the center circle
    fill(0);
    stroke(0);
    ellipse(this.cx, this.cy, this.radiusStep * 4, this.radiusStep * 4);

    //Gradient ring
    let numSegments = 360;
    for (let i = 0; i < numSegments; i++) {
      let angleStart = map(i, 0, numSegments, 0, TWO_PI);
      let angleEnd = map(i + 1, 0, numSegments, 0, TWO_PI);
      let gradientColor = this.getGradientColor(i, numSegments);
      fill(gradientColor);
      noStroke();
      arc(this.cx, this.cy, this.radiusStep * 5, this.radiusStep * 5, angleStart, angleEnd, PIE);
    }

    //The radiation effect of the line
    for (let i = 0; i < this.numRays; i++) {
      let angle = map(i, 0, this.numRays, 0, TWO_PI);
      let endX = this.cx + cos(angle) * this.maxRadius;
      let endY = this.cy + sin(angle) * this.maxRadius;
      stroke(0);
      strokeWeight(1);
      line(this.cx, this.cy, endX, endY);
    }
  }

  getGradientColor(index, totalSegments) {
    let colors = [
      color(231,209,170), color(195,151,125), color(173,135,134),
      color(135,134,138), color(181,114,127), color(117,141,160),
      color(142,166,171), color(165,186,187), color(224,236,217),
      color(230,229,204)
    ];
    
    let segment = index / (totalSegments / (colors.length - 1));
    let colorIndex = floor(segment);
    let t = segment - colorIndex;
    return lerpColor(colors[colorIndex], colors[colorIndex + 1], t);
  }
}
//Added timing scaling effect for OuterDots
class OuterDots {
  constructor(cx, cy, radius, numDots) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.numDots = numDots;
    this.currentSizes = Array(this.numDots).fill(3); //The initial size
    this.targetSizes = Array(this.numDots).fill(15); //The targeted size
    this.easingSpeed = 0.05;
    this.timerDuration = 1000;
    this.lastSwitchTime = millis();
  }

  displayWithSizeEasing() {
    //Switch target size regularly
    if (millis() - this.lastSwitchTime > this.timerDuration) {
      this.lastSwitchTime = millis();
      this.targetSizes = this.targetSizes.map(size => (size === 15 ? 3 : 15)); //Switch the size
    }

    for (let i = 0; i < this.numDots; i++) {
      let angle = map(i, 0, this.numDots, 0, TWO_PI);
      let dotX = this.cx + cos(angle) * this.radius;
      let dotY = this.cy + sin(angle) * this.radius;

      //Use lerp to make the size of each point gradually approach the target size
      this.currentSizes[i] = lerp(this.currentSizes[i], this.targetSizes[i], this.easingSpeed);

      fill(0);
      noStroke();
      ellipse(dotX, dotY, this.currentSizes[i], this.currentSizes[i]);
    }
  }
}

//Keep original effect
class RadiantRaysWithTargetCircles {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.radiusStep = 20;
  }

  display() {
    //Draw the center circle
    fill(0);
    stroke(0);
    ellipse(this.cx, this.cy, this.radiusStep, this.radiusStep);
    
    //Gradient ring
    let numSegments = 360;
    for (let i = 0; i < numSegments; i++) {
      let angleStart = map(i, 0, numSegments, 0, TWO_PI);
      let angleEnd = map(i + 1, 0, numSegments, 0, TWO_PI);
      let gradientColor = this.getGradientColor(i, numSegments);
      
      fill(gradientColor);
      noStroke();
      arc(this.cx, this.cy, this.radiusStep * 5, this.radiusStep * 5, angleStart, angleEnd, PIE);
    }
   
    //Draw the concentric circle
    noFill();
    stroke(0);
    strokeWeight(0.3);
    for (let i = 40; i <= 120; i += 20) {
      ellipse(this.cx, this.cy, i, i);
    }
  }

  getGradientColor(index, totalSegments) {
    let colors = [
      color(231,209,170), color(195,151,125), color(173,135,134),
      color(135,134,138), color(181,114,127), color(117,141,160),
      color(142,166,171), color(165,186,187), color(224,236,217),
      color(230,229,204)
    ];
    
    let segment = index / (totalSegments / (colors.length - 1));
    let colorIndex = floor(segment);
    let t = segment - colorIndex;
    return lerpColor(colors[colorIndex], colors[colorIndex + 1], t);
  }
}
//Keep original effect
class CrossLines {
  constructor(cx, cy, lineLength) {
    this.cx = cx;
    this.cy = cy;
    this.lineLength = lineLength;
  }

  display() {
    stroke(0);
    strokeWeight(0.5);
    line(this.cx - this.lineLength, this.cy, this.cx + this.lineLength, this.cy);
    line(this.cx, this.cy - this.lineLength, this.cx, this.cy + this.lineLength);
  }
}
//Add rotation effect for OuterDots2
class OuterDots2 {
  constructor(cx, cy, radius, numDots) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.numDots = numDots;
    this.rotationAngle = 0; //The initial rotation Angle
    this.rotationSpeed = 0.02;
  }

  displayWithRotation() {
    this.rotationAngle += this.rotationSpeed; //Update rotation Angle

    for (let i = 0; i < this.numDots; i++) {
      let angle = map(i, 0, this.numDots, 0, TWO_PI) + this.rotationAngle;
      let dotX = this.cx + cos(angle) * this.radius;
      let dotY = this.cy + sin(angle) * this.radius;
      let dotX2 = this.cx + sin(angle) * this.radius / 1.5;
      let dotY2 = this.cy + cos(angle) * this.radius / 1.5;

      fill(0);
      noStroke();
      ellipse(dotX, dotY, 8, 8);
      ellipse(dotX2, dotY2, 5, 5);
    }
  }
}