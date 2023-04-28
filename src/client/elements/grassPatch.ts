import { Scenery } from '../scenery.js';
import { w } from '../main.js';

import { dist, random } from '../util.js';

import P5 from 'p5';

export class GrassPatch extends Scenery {
  private x: number;
  private y: number;

  private wid: number;
  private h: number;

  private points: number[][];

  constructor(x: number, y: number, wid: number, hei: number) {
    super();
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.h = hei;
    this.points = [];

    this.generatePoints();
  }

  generatePoints() {
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

  draw(p5: P5) {
    // if (w.getIsOpenSource()) {
    //   p5.strokeWeight(2);
    //   p5.stroke(255);
    // } else {
    //   p5.stroke(40);
    //   p5.strokeWeight(2);
    // }
    p5.push();
    p5.noFill();

    p5.strokeWeight(2); // Thicker lines for the grass

    let bladeHeight = 0.7;

    let startX = this.x;
    let startY = this.y;
    let endX = this.x + this.wid;
    let endY = this.y - this.h * bladeHeight;
    let control1X = startX + this.wid * this.points[0][0];
    let control1Y = startY - this.h * this.points[0][1];
    let control2X = startX + this.wid * this.points[0][2];
    let control2Y = endY + this.h * this.points[0][3];

    p5.stroke(0, 200, 0); // Green color for the grass
    // Draw the Bézier curve
    p5.bezier(
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

    p5.stroke(0, 180, 0); // Green color for the grass
    p5.bezier(
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

    p5.stroke(0, 128, 0); // Green color for the grass
    p5.bezier(
      startX,
      startY,
      control1X,
      control1Y,
      control2X,
      control2Y,
      endX,
      endY
    );

    p5.pop();
  }

  getInPlayerRange() {
    return false;
  }

  interact() {}

  update() {
    // this.t = (this.t + 1) % 50;
    // if (this.t === 0) {
    //   this.t = 0;
    this.generatePoints();
    // }
    // this.t += 1;
    // if (this.t > 100) {
    //   this.t = 0;
    //   this.generatePoints();
    // }
  }
}
