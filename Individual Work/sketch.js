//To make sure the effect is clear, I will first test the effect of a periodic change in one of the figures
let radiantCircle;
let radiantCircleWithRays;
let radiantRaysWithConcentricCircles;
let outerDots;
let radiantRaysWithTargetCircles;
let crossLines;
let outerDots2;

//Add more figures
let gradientWithRays;
let ring;
let circlePattern1;
let circlePattern2;
//Add a gif to enrich the background
let gif;

//Preload gif
function preload() {
  gif = loadImage('assets/giphy.gif');
}

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
  gradientWithRays = new CircularGradientWithRays(width/ 1.5, height/ 2.2, 80);
  ring = new GradientRingWithLinesAndHoles(width/ 3.2, height/ 2.2, 80, 20); 
  circlePattern1 = new CirclePattern(width / 1.2, height / 4, 60, 20, 1);  //Rotate clockwise
  circlePattern2 = new CirclePattern(width / 1.2, height / 1.5, 80, 30, -1); //Rotate counterclockwise
}

function draw() {
  background(128, 139, 140);
  image(gif, 0, 0, width, height);

  //Displays and adds smoothing effects
  radiantCircle.displayWithEasing();
  radiantCircleWithRays.displayWithEasing();
  radiantRaysWithConcentricCircles.display();
  outerDots.displayWithSizeEasing();
  radiantRaysWithTargetCircles.display();
  crossLines.display();
  outerDots2.displayWithRotation();
  gradientWithRays.display();
  ring.update();
  ring.display();

  //Update and display the first circle (clockwise rotation)
  circlePattern1.update();
  circlePattern1.displayFirstCircle();
  circlePattern1.displayFirstCircle();
  //Update and display the second circle (counterclockwise rotation)
  circlePattern2.update();
  circlePattern2.displaySecondCircle();
  circlePattern2.displaySecondCircle();
}

//Added timing scaling effect for RadiantCircle
class RadiantCircle {
  constructor(cx, cy) {
    this.cx = cx;
    this.cy = cy;
    this.numRays = 30;
    this.maxRadius = 80;
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
        fill(220);
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
    fill(55, 103, 149, 200);
    ellipse(this.cx - 30, this.cy - 30, 50, 50);
    fill(255, 208, 111);
    ellipse(this.cx + 30, this.cy + 10, 40, 40);
    fill(114, 188, 213);
    ellipse(this.cx - 30, this.cy + 30, 20, 20);

    //Draws radiations, with lengths scaled by currentLengthFactor
    strokeWeight(1.5);
    stroke(220);
    for (let i = 0; i < this.numRays; i++) {
      let angle = map(i, 0, this.numRays, 0, TWO_PI);
      let endX = this.cx + cos(angle) * this.baseMaxRadius * this.currentLengthFactor;
      let endY = this.cy + sin(angle) * this.baseMaxRadius * this.currentLengthFactor;
      line(this.cx, this.cy, endX, endY);
    }

    //Draw the center circle
    fill(220);
    noStroke();
    ellipse(this.cx, this.cy, 50, 50);
    fill(0);
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
      stroke(220);
      strokeWeight(1);
      line(this.cx, this.cy, endX, endY);
    }
  }

  getGradientColor(index, totalSegments) {
    let colors = [
      color(55, 103, 149),
      color(114, 188, 213),
      color(255, 208, 111),
      color(231, 98, 84)
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

      fill(220);
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
    stroke(220);
    strokeWeight(1);
    for (let i = 40; i <= 120; i += 20) {
      ellipse(this.cx, this.cy, i, i);
    }
  }

  getGradientColor(index, totalSegments) {
    let colors = [
      color(55, 103, 149),
      color(114, 188, 213),
      color(255, 208, 111),
      color(231, 98, 84)
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
    stroke(220);
    strokeWeight(1);
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
    this.rotationSpeed = 0.02; //The initial rotation Speed
  }

  displayWithRotation() {
    this.rotationAngle += this.rotationSpeed; //Update rotation Angle

    for (let i = 0; i < this.numDots; i++) {
      let angle = map(i, 0, this.numDots, 0, TWO_PI) + this.rotationAngle;
      let dotX = this.cx + cos(angle) * this.radius;
      let dotY = this.cy + sin(angle) * this.radius;
      let dotX2 = this.cx + sin(angle) * this.radius / 1.5;
      let dotY2 = this.cy + cos(angle) * this.radius / 1.5;
      let dotX3 = this.cx + sin(angle) * this.radius * 1.2;
      let dotY3 = this.cy + cos(angle) * this.radius * 1.2;

      fill(220);
      noStroke();
      ellipse(dotX, dotY, 8, 8);
      ellipse(dotX2, dotY2, 5, 5);
      ellipse(dotX3, dotY3, 12, 12);
    }
  }
}

//Add rotation effect for CircularGradientWithRays
class CircularGradientWithRays {
  constructor(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.colors = [
      color(55, 103, 149),
      color(114, 188, 213),
      color(255, 208, 111),
      color(231, 98, 84)
    ]; //Gradient color array

    this.rotationAngle = 0; //The initial rotation Angle
    this.rotationSpeed = 0.01; //The initial rotation Speed
  }

  display() {
    this.rotationAngle += this.rotationSpeed; //Update rotation Angle

    let numSegments = 200;
    let angleStep = TWO_PI / numSegments;

    //Draw a gradient circle
    for (let i = 0; i < numSegments; i++) {
      let inter = map(i, 0, numSegments, 0, 1);
      let colorIndex = floor(inter * (this.colors.length - 1));

      //Handle color transitions to avoid going out of range
      let nextIndex = min(colorIndex + 1, this.colors.length - 1);
      let c = lerpColor(this.colors[colorIndex], this.colors[nextIndex], (inter * (this.colors.length - 1)) % 1);

      fill(c);
      noStroke();

      let startAngle = i * angleStep + this.rotationAngle;
      let endAngle = (i + 1) * angleStep + this.rotationAngle;

      arc(this.cx, this.cy, this.r * 2, this.r * 2, startAngle, endAngle, PIE);
    }

    //Draw rays
    stroke(220);
    strokeWeight(1);
    for (let i = 0; i < 60; i++) {
      let angle = i * (TWO_PI / 60) + this.rotationAngle;
      let xEnd = this.cx + cos(angle) * this.r;
      let yEnd = this.cy + sin(angle) * this.r;
      line(this.cx, this.cy, xEnd, yEnd);
    }
  }
}

//Added timing scaling effect for GradientRingWithLinesAndHoles
class GradientRingWithLinesAndHoles {
  constructor(cx, cy, outerR, thickness) {
    this.cx = cx;
    this.cy = cy;
    this.outerR = outerR;
    this.baseOuterR = outerR; //The initial radius, used for zooming in and out
    this.thickness = thickness;
    this.animationSpeed = 0.05; //Control the speed of magnification and reduction
    this.time = 0; //The time variable used to control for zooming in and out
    this.colors = [
      color(30, 70, 110), color(55, 103, 149), color(82, 143, 173), color(170, 220, 224)
    ];
  }

  update() {
    //The outerR is adjusted smoothly by the sine function to zoom in and out
    this.time += this.animationSpeed;
    this.outerR = this.baseOuterR + sin(this.time) * 20; //The amplitude is 20, resulting in an amplification and reduction effect
  }

  display() {
    let numSegments = 100;
    let angleStep = TWO_PI / numSegments;
    
    //Draw the gradient ring
    for (let i = 0; i < numSegments; i++) {
      let inter = map(i, 0, numSegments, 0, 1);
      let colorIndex = floor(inter * (this.colors.length - 1));
      let c = lerpColor(this.colors[colorIndex], this.colors[colorIndex + 1], (inter * (this.colors.length - 1)) % 1);
      fill(c);
      noStroke();
      arc(this.cx, this.cy, this.outerR * 2, this.outerR * 2, i * angleStep, (i + 1) * angleStep, PIE);
    }

    //Draw inner circles and lines
    let innerRadius = (this.outerR - this.thickness) * 1.3 / 2;
    fill(0);
    noStroke();
    ellipse(this.cx, this.cy, (this.outerR - this.thickness) * 1.3);

    //Draw rays
    stroke(220);
    for (let i = 0; i < numSegments; i++) {
      let angle = i * angleStep;
      let xStart = this.cx + cos(angle) * innerRadius;
      let yStart = this.cy + sin(angle) * innerRadius;
      let xEnd = this.cx + cos(angle) * this.outerR;
      let yEnd = this.cy + sin(angle) * this.outerR;
      line(xStart, yStart, xEnd, yEnd);
    }

    //Draw random holes
    for (let i = 0; i < 15; i++) {
      let angle = random(TWO_PI);
      let distance = random(innerRadius, this.outerR);
      let holeX = this.cx + cos(angle) * distance;
      let holeY = this.cy + sin(angle) * distance;
      fill(128, 139, 140);
      noStroke();
      ellipse(holeX, holeY, random(3, 10));
    }
  }
}

//Add rotation effect for two circles
class CirclePattern {
  constructor(x, y, radius, points, rotationDirection) {
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.points = points;
    this.angleOffset = 0;
    this.rotationDirection = rotationDirection; //Control the rotation direction, 1 is clockwise, -1 is counterclockwise
    this.colors = [
      color(255, 230, 183), color(255, 208, 111), color(247, 170, 88), color(231, 98, 84)
    ];
  }

  //Update rotation and scaling effects
  update() {
    this.angleOffset += 0.01 * this.rotationDirection; //Control rotation direction
    this.radius = this.baseRadius * (1 + 0.3 * sin(frameCount * 0.02)); //Smooth scaling is achieved using the sin function
  }

  displayFirstCircle() {
    let angleStep = TWO_PI / this.points;
    fill(114, 188, 213);
    noStroke();
    ellipse(this.x - 20, this.y - 20, this.radius * 0.5, this.radius * 0.5);

    fill(255, 208, 111);
    noStroke();
    ellipse(this.x + 10, this.y - 10, this.radius * 0.7, this.radius * 0.7);

    fill(231, 98, 84);
    noStroke();
    ellipse(this.x - 20, this.y + 20, this.radius * 1.1, this.radius * 1.1);

    for (let i = 0; i < this.points; i++) {
      let angle = i * angleStep + this.angleOffset;
      let x1 = this.x + cos(angle) * this.radius;
      let y1 = this.y + sin(angle) * this.radius;
      stroke(220);
      strokeWeight(1);
      fill(220);
      line(this.x, this.y, x1, y1);
      ellipse(x1, y1, 4);
    }
  }

  displaySecondCircle() {
    let angleStep = TWO_PI / this.points;
    
    //Fill the sector with the gradient color
    for (let i = 0; i < this.points; i++) {
      let inter = map(i, 0, this.points, 0, 1); //Calculate the gradient position
      let colorIndex = floor(inter * (this.colors.length - 1)); //Choose the color according to the scale

      let gradientColor = lerpColor(this.colors[colorIndex], this.colors[colorIndex + 1], inter);
      fill(gradientColor);
      noStroke();
      
      //Draw each sector
      let angleStart = i * angleStep + this.angleOffset;
      let angleEnd = (i + 1) * angleStep + this.angleOffset;
      arc(this.x, this.y, this.radius * 1.5, this.radius * 1.5, angleStart, angleEnd, PIE);
    }

    //Draw the connecting lines and dots
    for (let i = 0; i < this.points; i++) {
      let angle = i * angleStep + this.angleOffset; //Application of rotation Angle
      let x1 = this.x + cos(angle) * this.radius;
      let y1 = this.y + sin(angle) * this.radius;
      stroke(220);
      strokeWeight(1);
      line(this.x, this.y, x1, y1);
      fill(20);
      ellipse(x1, y1, 4);
    }
  }
}