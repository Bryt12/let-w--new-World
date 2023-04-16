class Singularity {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.t = 0;
  }

  draw() {
    this.t = (this.t + 0.25) % 360;
    push();
    translate(this.x, this.y);
    background(255);

    push();
    blendMode(DIFFERENCE);
    noStroke();
    rectMode(CENTER);
    fill('cyan');
    circle(200, 200, 70);
    fill('magenta');
    square(220, 180, 70);
    blendMode(BLEND);

    // circle(160,160,40)

    push();
    translate(160, 160);
    noFill();
    stroke(0);
    circle(0, 0, 5);

    noStroke();

    let xPos = 10 * cos(this.t);
    let yPos = 10 * sin(this.t);
    fill('red');
    circle(xPos, yPos, 5);
    pop();

    fill('yellow');
    triangle(180, 220, 220, 200, 175, 190);

    push();
    translate(220, 160);
    rotate(-this.t / 3);
    fill('magenta');
    polygon(0, 0, 10, 6);
    pop();

    push();
    translate(220, 160);
    rotate(-this.t / 10);
    fill('cyan');
    polygon(0, 0, 4, 6);
    pop();

    for (var i = 0; i < 40; i++) {
      stroke(color(0, 0, 0, 60));
      let x = random(150, 260);
      let y = random(140, 200);
      line(x, y, x, y + 40);
    }

    pop();
    pop();
  }

  update() {}
}
