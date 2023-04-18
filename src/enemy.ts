import { w } from './main.js';

import { random } from './util.js';

import P5 from 'p5';

export class Enemy {
  private name: string;
  private color: string;

  private r: number;
  private x: number;
  private y: number;

  private height: number;

  private speed: number;

  private boundHeight: number;
  private bounceVelocity: number;
  private deltaHeight: number;

  private rand: number[][];

  private i: number;

  constructor(
    name: string,
    color: string,
    r: number,
    x: number,
    y: number,
    speed: number
  ) {
    this.name = name;
    this.color = color;

    this.r = r;
    this.x = x;
    this.y = y;

    this.height = 0;

    this.speed = speed;

    this.boundHeight = this.speed * 2;
    this.bounceVelocity = this.speed * (0.1 / 0.07);
    this.deltaHeight = this.bounceVelocity;

    this.rand = [this.generateRandomList(4), this.generateRandomList(4)];

    this.i = 0;
  }

  bounce() {
    this.height += this.deltaHeight;
    const isOutOfBoundsTop = +(this.height > this.boundHeight);
    const isOutOfBoundsBottom = +(this.height < -this.boundHeight);
    this.deltaHeight =
      this.deltaHeight * (1 - isOutOfBoundsTop - isOutOfBoundsBottom) +
      this.bounceVelocity * (isOutOfBoundsBottom - isOutOfBoundsTop);
  }

  generateRandomList(n: number) {
    let list = [];
    for (var i = 0; i < n; i++) {
      list.push(random());
    }
    return list;
  }

  draw(p5: P5) {
    p5.push();
    p5.rectMode(p5.CENTER);
    p5.translate(this.x, this.y);
    const d = 5;
    for (var i = 0; i < 4; i++) {
      const r1 = this.rand[0][i];
      const r2 = this.rand[1][i];

      const x = p5.map(r1, 0, 1, -d, d);
      const y = p5.map(r2, 0, 1, -d, d);

      if (r1 > 0.5) {
        p5.stroke(255);
        p5.fill(0);
      } else {
        p5.stroke(0);
        p5.fill(255);
      }

      if (r2 > 0.5) {
        p5.circle(x, y, this.r);
      } else {
        p5.square(x, y, this.r);
      }
    }
    p5.pop();
  }

  update() {
    const playerLocation = w.getPlayer().getPosition();

    let x = playerLocation.x;
    let y = playerLocation.y;

    let dx = x - this.x;
    let dy = y - this.y;

    let angle = Math.atan2(dy, dx);

    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;

    this.i++;
    if (this.i > 3) {
      this.rand[0] = this.generateRandomList(4);
      this.rand[1] = this.generateRandomList(4);
      this.i = 0;
    }

    this.bounce();
  }
}
