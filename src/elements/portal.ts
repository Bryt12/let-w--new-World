import { Scenery } from '../scenery.js';

import { random } from '../util.js';

import P5 from 'p5';

export class Portal extends Scenery {
  private active: boolean = true;

  private x: number;
  private y: number;

  private wid: number;
  private hei: number;

  private height: number;
  private deltaHeight: number;
  private boundHeight: number;
  private bounceVelocity: number;

  constructor(x: number, y: number, wid: number, hei: number) {
    super();
    this.x = x;
    this.y = y;

    this.wid = wid;
    this.hei = hei;

    this.boundHeight = 0;

    this.height = 0;
    this.bounceVelocity = 0.2;
    this.deltaHeight = this.bounceVelocity;
    this.boundHeight = 5;
  }

  draw(p5: P5): void {
    if (!this.active) {
      return;
    }
    p5.push();
    p5.translate(this.x, this.y);

    for (i = 0; i < 10; i++) {
      p5.fill(p5.color(70, 10, 100, 50));
      let mult = p5.map(i, 0, 10, 0, 0.8);
      p5.noStroke();
      p5.ellipse(0, 0, this.wid * mult, this.hei * 2 * mult);
    }

    p5.stroke(0);
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        let startAngle = random(2 * p5.PI);
        let endAngle = startAngle + p5.PI / 8;
        let rX = random(this.wid / 4, this.wid / 2);
        let rY = random(this.hei / 2, this.hei);
        p5.beginShape();
        for (var k = 0; k < 10; k++) {
          let a = p5.map(k, 0, 10, startAngle, endAngle);
          let x = rX * p5.cos(a);
          let y = rY * p5.sin(a);
          p5.vertex(x, y);
        }
        p5.endShape();
      }
    }
    p5.pop();
  }
  update(): void {
    this.bounce();
  }

  bounce() {
    this.height += this.deltaHeight;
    const isOutOfBoundsTop = +(this.height > this.boundHeight);
    const isOutOfBoundsBottom = +(this.height < -this.boundHeight);
    this.deltaHeight =
      this.deltaHeight * (1 - isOutOfBoundsTop - isOutOfBoundsBottom) +
      this.bounceVelocity * (isOutOfBoundsBottom - isOutOfBoundsTop);
  }
}
