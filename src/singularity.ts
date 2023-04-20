import { w } from './main.js';
import { Talkable } from './talkable.js';

import { interactionDistance } from './constants.js';
import { dist, random, polygon } from './util.js';

import P5 from 'p5';

export class Singularity extends Talkable {
  private x: number;
  private y: number;

  private height: number;
  private deltaHeight: number;
  private boundHeight: number;
  private bounceVelocity: number;

  private distanceFromPlayer: number = 0;
  private inPlayerRange: boolean = false;

  private t: number = 0;
  constructor(x: number, y: number, dialog: string[], passiveDialog: string[]) {
    super(
      'you are a super AI that controls the singularity. Your goal is to tell the player to find the lost wanderer.',
      dialog,
      passiveDialog
    );
    this.x = x;
    this.y = y;

    this.height = 0;
    this.bounceVelocity = 0.1;
    this.deltaHeight = this.bounceVelocity;
    this.boundHeight = 8;
  }

  draw(p5: P5, x = this.x, y = this.y) {
    this.t = (this.t + 0.25) % 360;

    p5.push();
    p5.blendMode(p5.DIFFERENCE);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.fill('cyan');
    p5.circle(x, y + this.height, 70);
    p5.fill('magenta');
    p5.square(x + 20, y + this.height - 20, 70);
    p5.blendMode(p5.BLEND);

    // circle(160,160,40)

    p5.push();
    p5.translate(x - 40, y + this.height - 40);
    p5.noFill();
    p5.stroke(0);
    p5.circle(0, 0, 5);

    p5.noStroke();

    let xPos = 10 * p5.cos(this.t);
    let yPos = 10 * p5.sin(this.t);
    p5.fill('red');
    p5.circle(xPos, yPos, 5);
    p5.pop();

    p5.fill('yellow');
    p5.triangle(
      x - 20,
      y + this.height + 20,
      x + 20,
      y + this.height,
      x - 15,
      y + this.height - 10
    );

    p5.push();
    p5.translate(x + 20, y + this.height - 40);
    p5.rotate(-this.t / 3);
    p5.fill('magenta');
    polygon(p5, 0, 0, 10, 6);
    p5.pop();

    p5.push();
    p5.translate(x + 20, y + this.height - 40);
    p5.rotate(-this.t / 10);
    p5.fill('cyan');
    polygon(p5, 0, 0, 4, 6);
    p5.pop();

    for (var i = 0; i < 40; i++) {
      p5.stroke(p5.color(0, 0, 0, 60));
      let x_ = random(x - 50, x + this.height + 60);
      let y_ = random(y - 60, y + this.height);
      p5.line(x_, y_, x_, y_ + 40);
    }

    p5.pop();

    // If the player in near the NPC that isn't
    // in the chat box
    if (x === this.x && y === this.y) {
      this.displayInteraction(p5);
    }
  }

  displayInteraction(p5: P5) {
    // If the player is in a conversation
    // display the escape key
    if (w.getPlayer().getInConversation()) {
      p5.push();
      p5.noStroke();
      p5.fill(0);
      p5.textSize(12);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('[esc]', this.x, this.y + this.height + 40);
      p5.pop();
      return;
    }

    // If the player is not in a conversation and
    // the player is in range of the NPC display

    if (this.distanceFromPlayer < interactionDistance) {
      p5.push();
      p5.noStroke();
      p5.fill(0);
      p5.textSize(12);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('[space]', this.x, this.y + this.height + 40);
      p5.pop();
    }
  }

  getDistanceFromPlayer(): number {
    return this.distanceFromPlayer;
  }

  update() {
    this.bounce();
    this.calculateDistanceFromPlayer();

    if (this.distanceFromPlayer < interactionDistance) {
      this.inPlayerRange = true;
    } else {
      if (this.inPlayerRange) {
        w.getChatWindow().clear();
        w.getPlayer().setInConversation(false);
      }
      this.inPlayerRange = false;
    }
  }

  calculateDistanceFromPlayer() {
    const playerLocation = w.getPlayer().getPosition();

    let distance = dist(this.x, this.y, playerLocation.x, playerLocation.y);

    this.distanceFromPlayer = distance;
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
