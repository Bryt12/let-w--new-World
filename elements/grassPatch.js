class GrassPatch {
  constructor(x, y, wid, hei) {
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.h = hei;

    this.generatePoints(x, y, wid, hei);
  }

  generatePoints(x, y, wid, hei) {
    let d1 = 0.2;
    let d2 = 0.2;
    let d3 = 0.2;

    this.points = [
      [
        random(0.1 - d1, 0.1 + d1),
        random(0.6 - d1, 0.6 + d1),
        random(0.2 - d1, 0.2 + d1),
        random(0.2 - d1, 0.2 + d1),
      ],
      [
        random(0.1 - d2, 0.1 + d2),
        random(0.6 - d2, 0.6 + d2),
        random(0.2 - d2, 0.2 + d2),
        random(0.2 - d2, 0.2 + d2),
      ],
      [
        random(0.1 - d1, 0.1 + d1),
        random(0.6 - d1, 0.1 + d1),
        random(-d3, d3),
        random(-d3, d3),
      ],
    ];
  }

  draw() {
    if (w.getIsOpenSource()) {
      strokeWeight(2);
      stroke(255);
    } else {
      stroke(40);
      strokeWeight(2);
    }
    push();
    noFill();

    strokeWeight(2); // Thicker lines for the grass

    let bladeHeight = 0.7;

    let startX = this.x;
    let startY = this.y;
    let endX = this.x + this.wid;
    let endY = this.y - this.h * bladeHeight;
    let control1X = startX + this.wid * this.points[0][0];
    let control1Y = startY - this.h * this.points[0][1];
    let control2X = startX + this.wid * this.points[0][2];
    let control2Y = endY + this.h * this.points[0][3];

    stroke(0, 200, 0); // Green color for the grass
    // Draw the Bézier curve
    bezier(
      startX,
      startY,
      control1X,
      control1Y,
      control2X,
      control2Y,
      endX,
      endY
    );

    startX = this.x;
    startY = this.y;
    endX = this.x;
    endY = this.y - this.h;
    control1X = startX + this.wid * this.points[2][0];
    control1Y = startY - this.h * this.points[2][1];
    control2X = startX - this.wid * this.points[2][2];
    control2Y = endY + this.h * this.points[2][3];

    stroke(0, 180, 0); // Green color for the grass
    bezier(
      startX,
      startY,
      control1X,
      control1Y,
      control2X,
      control2Y,
      endX,
      endY
    );

    startX = this.x;
    startY = this.y;
    endX = this.x - this.wid;
    endY = this.y - this.h * bladeHeight;
    control1X = startX - this.wid * this.points[1][0];
    control1Y = startY - this.h * this.points[1][1];
    control2X = startX - this.wid * this.points[1][2];
    control2Y = endY + this.h * this.points[1][3];

    stroke(0, 128, 0); // Green color for the grass
    bezier(
      startX,
      startY,
      control1X,
      control1Y,
      control2X,
      control2Y,
      endX,
      endY
    );

    pop();
  }

  update() {
    this.t += 1;

    if (this.t > 100) {
      this.t = 0;
      this.generatePoints();
    }
  }
}
