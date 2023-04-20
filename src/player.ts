import { Talkable } from './talkable.js';
import { w, screenWidth, screenHeight } from './main.js';

import P5 from 'p5';

export class Player extends Talkable {
  private name: string;
  private color: string;
  private inventory: any[];
  private equipped: number;

  private x: number;
  private y: number;

  private height: number;

  private yVel: number;
  private xVel: number;

  private maxVel: number;
  private acc: number;

  private boundHeight: number;
  private bounceVelocity: number;
  private deltaHeight: number;

  private attacking: boolean;
  private inConversation: boolean;

  constructor(
    name: string,
    color: string,
    x: number,
    y: number,
    inventory: any[]
  ) {
    super('');
    this.name = name;
    this.color = color;
    this.inventory = inventory;
    this.equipped = 0;

    this.x = x;
    this.y = y;

    this.height = 0;

    this.yVel = 0;
    this.xVel = 0;

    this.maxVel = 3;
    this.acc = 0.2;

    this.boundHeight = this.maxVel * 2;
    this.bounceVelocity = this.acc * (0.1 / 0.07);
    this.deltaHeight = this.bounceVelocity;

    this.attacking = false;
    this.inConversation = false;
  }

  draw(p5: P5) {
    p5.push();
    if (w.getIsOpenSource()) {
      p5.strokeWeight(2);
      p5.stroke(255);
    } else {
      p5.strokeWeight(1);
      p5.stroke(0);
    }
    p5.fill(this.color);
    p5.circle(this.x, this.y + this.height, 50);
    p5.pop();

    this.displayName(p5);
    this.drawAttack(p5);
  }

  interact() {}

  getDistanceFromPlayer() {
    return 0;
  }

  getInConversation() {
    return this.inConversation;
  }

  nextLine(callback: (text: string) => void, done: () => void) {
    // Call callback with response
    callback('Hello world');
  }

  drawAttack(p5: P5) {
    if (this.attacking) {
      this.inventory[this.equipped].draw(p5, this.x, this.y, 25);
    }
  }

  update() {
    this.handleKeys();
    this.checkRoomBounds();
    this.updatePosition();
    this.handleAttack();
    this.bounce();
  }

  checkRoomBounds() {
    this.handleBoundary('x', screenWidth, 'LEFT', 'RIGHT');
    this.handleBoundary('y', screenHeight, 'UP', 'DOWN');
  }

  handleBoundary(
    axis: 'x' | 'y',
    screenSize: number,
    direction1: string,
    direction2: string
  ) {
    const isOutOfBounds1 = this[axis] < 0;
    const isOutOfBounds2 = this[axis] > screenSize;

    const direction = isOutOfBounds1
      ? direction1
      : isOutOfBounds2
      ? direction2
      : null;

    if (direction) {
      const moved = w.moveRoom(direction);
      if (moved) {
        this[axis] = screenSize * (isOutOfBounds1 ? 1 : 0);
      }
    }
  }

  displayName(p5: P5) {
    p5.push();
    p5.fill(0);
    p5.textSize(20);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(this.name, this.x, this.y + this.height - 40);
    p5.pop();
  }

  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  setInConversation(inConversation: boolean) {
    this.inConversation = inConversation;
  }

  clearDialog() {}

  updatePosition() {
    this.x = Math.max(-1, Math.min(this.x + this.xVel, screenWidth + 1));
    this.y = Math.max(-1, Math.min(this.y + this.yVel, screenHeight + 1));
  }

  handleAttack() {
    if (this.attacking) {
      let attackOut = this.inventory[this.equipped].update();
      this.attacking = attackOut.attacking;
    }
  }

  bounce() {
    this.height += this.deltaHeight;
    const isOutOfBoundsTop = +(this.height > this.boundHeight);
    const isOutOfBoundsBottom = +(this.height < -this.boundHeight);
    this.deltaHeight =
      this.deltaHeight * (1 - isOutOfBoundsTop - isOutOfBoundsBottom) +
      this.bounceVelocity * (isOutOfBoundsBottom - isOutOfBoundsTop);
  }

  handleKeys() {
    if (w.getKeyState('UP') > w.getKeyState('DOWN')) {
      this.move('UP');
    } else if (this.yVel < 0) {
      this.slow('UP');
    }

    if (w.getKeyState('DOWN') > w.getKeyState('UP')) {
      this.move('DOWN');
    } else if (this.yVel > 0) {
      this.slow('DOWN');
    }

    if (w.getKeyState('LEFT') > w.getKeyState('RIGHT')) {
      this.move('LEFT');
    } else if (this.xVel < 0) {
      this.slow('LEFT');
    }

    if (w.getKeyState('RIGHT') > w.getKeyState('LEFT')) {
      this.move('RIGHT');
    } else if (this.xVel > 0) {
      this.slow('RIGHT');
    }

    if (w.getKeyState('SPACE') >= 0) {
      this.takeAction();
      w.updateKeyState('SPACE', -1);
    }
  }

  takeAction() {
    if (!this.inConversation) {
      let interactions = w.getInteractions(); // Get npcs in range

      if (interactions.length > 0) {
        this.inConversation = true;
        w.clearKeyState();
        interactions[0].interact();
      } else {
        this.useItem();
      }
    } else {
      w.getChatWindow().advance();
    }
  }

  useItem() {
    this.attacking = true;
  }

  move(direction: string) {
    const acc = this.acc;

    if (direction === 'UP') {
      if (this.yVel > -this.maxVel) {
        this.yVel -= acc;
      }
    } else if (direction === 'DOWN') {
      if (this.yVel < this.maxVel) {
        this.yVel += acc;
      }
    } else if (direction === 'LEFT') {
      if (this.xVel > -this.maxVel) {
        this.xVel -= acc;
      }
    } else if (direction === 'RIGHT') {
      if (this.xVel < this.maxVel) {
        this.xVel += acc;
      }
    }
  }

  slow(direction: string) {
    const dec = this.acc;

    if (direction === 'UP') {
      this.yVel += dec;
      if (this.yVel > 0) {
        this.yVel = 0;
      }
    } else if (direction === 'DOWN') {
      this.yVel -= dec;
      if (this.yVel < 0) {
        this.yVel = 0;
      }
    } else if (direction === 'LEFT') {
      this.xVel += dec;
      if (this.xVel > 0) {
        this.xVel = 0;
      }
    } else if (direction === 'RIGHT') {
      this.xVel -= dec;
      if (this.xVel < 0) {
        this.xVel = 0;
      }
    }
  }
}
