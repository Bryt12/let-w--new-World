import { w } from './main.js';
import { interactionDistance } from './constants.js';
import { Talkable } from './talkable.js';

import { dist } from './util.js';

import P5 from 'p5';

export class NPC extends Talkable {
  private name: string;
  private color: string;
  private inventory: any[];
  private equipped: number;

  private r: number;
  private x: number;
  private y: number;

  private height: number;

  private speed: number;

  private boundHeight: number;
  private bounceVelocity: number;
  private deltaHeight: number;

  private distanceFromPlayer: number;
  private inPlayerRange: boolean;

  constructor(
    name: string,
    color: string,
    r: number,
    x: number,
    y: number,
    inventory: any,
    personality: string,
    dialog: string[],
    passiveDialog: string[]
  ) {
    super(personality, dialog, passiveDialog);
    this.name = name;
    this.color = color;
    this.inventory = inventory;
    this.equipped = 0;

    this.r = r;
    this.x = x;
    this.y = y;

    this.height = 0;

    this.speed = 2;

    this.boundHeight = 2;
    this.bounceVelocity = 0.1;
    this.deltaHeight = this.bounceVelocity;

    this.distanceFromPlayer = 0;
    this.inPlayerRange = false;
  }

  getDistanceFromPlayer(): number {
    return this.distanceFromPlayer;
  }

  calculateDistanceFromPlayer() {
    const playerLocation = w.getPlayer().getPosition();

    let distance = dist(this.x, this.y, playerLocation.x, playerLocation.y);

    this.distanceFromPlayer = distance;
  }

  displayName(p5: P5) {
    // p5.push();
    // p5.fill(0);
    // p5.noStroke();
    // p5.textSize(20);
    // p5.textAlign(p5.CENTER, p5.CENTER);
    // p5.text(this.name, this.x, this.y + this.height - 40);
    // p5.pop();
  }

  bounce() {
    this.height += this.deltaHeight;
    const isOutOfBoundsTop = +(this.height > this.boundHeight);
    const isOutOfBoundsBottom = +(this.height < -this.boundHeight);
    this.deltaHeight =
      this.deltaHeight * (1 - isOutOfBoundsTop - isOutOfBoundsBottom) +
      this.bounceVelocity * (isOutOfBoundsBottom - isOutOfBoundsTop);
  }

  // interact() {
  //   // this.color = rc();
  //   w.getChatWindow().clear();

  //   w.getChatWindow().addTalkable(this);
  //   w.getChatWindow().addTalkable(w.getPlayer());
  // }

  displayInteraction(p5: P5) {
    if (this.distanceFromPlayer < interactionDistance) {
      p5.push();
      p5.noStroke();
      p5.fill(0);
      p5.textSize(12);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('[space]', this.x, this.y + this.height + 36);
      p5.pop();
    }
  }

  clearDialog() {}

  draw(p5: P5, x = this.x, y = this.y) {
    p5.fill(this.color);
    p5.circle(x, y + this.height, this.r);

    // If the player in near the NPC that isn't
    // in the chat box
    if (x === this.x && y === this.y) {
      this.displayInteraction(p5);
      this.displayName(p5);
    }
  }

  update() {
    this.bounce();
    this.calculateDistanceFromPlayer();

    if (this.distanceFromPlayer < interactionDistance) {
      this.inPlayerRange = true;
    } else {
      if (this.inPlayerRange) {
        w.getChatWindow().clear();
      }
      this.inPlayerRange = false;
    }
  }
}
