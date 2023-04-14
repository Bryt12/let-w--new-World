class Player {
  constructor(name, color, x, y, inventory) {
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

  draw() {
    push();
    if (w.getIsOpenSource()) {
      strokeWeight(2);
      stroke(255);
    } else {
      strokeWeight(1);
      stroke(0);
    }
    fill(this.color);
    circle(this.x, this.y + this.height, 50);
    pop();

    this.displayName();
    this.drawAttack();
  }

  drawAttack() {
    if (this.attacking) {
      this.inventory[this.equipped].draw(this.x, this.y, 25);
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
    if (this.x < 0) {
      const moved = w.moveRoom('LEFT');
      if (moved) {
        this.x = wid;
      }
    } else if (this.x > wid) {
      const moved = w.moveRoom('RIGHT');
      if (moved) {
        this.x = 0;
      }
    }

    if (this.y < 0) {
      const moved = w.moveRoom('UP');
      if (moved) {
        this.y = hig;
      }
    } else if (this.y > hig) {
      const moved = w.moveRoom('DOWN');
      if (moved) {
        this.y = 0;
      }
    }
  }

  displayName() {
    push();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y + this.height - 40);
    pop();
  }

  updatePosition() {
    this.x = Math.max(-1, Math.min(this.x + this.xVel, wid + 1));
    this.y = Math.max(-1, Math.min(this.y + this.yVel, hig + 1));
  }

  handleAttack() {
    if (this.attacking) {
      let attackOut = this.inventory[this.equipped].update();
      this.attacking = attackOut.attacking;
    }
  }

  bounce() {
    this.height += this.deltaHeight;
    if (this.height > this.boundHeight) {
      this.deltaHeight = -this.bounceVelocity;
    } else if (this.height < -this.boundHeight) {
      this.deltaHeight = this.bounceVelocity;
    }
  }

  handleKeys() {
    if (keyState.UP > keyState.DOWN) {
      p.move('UP');
    } else if (this.yVel < 0) {
      p.slow('UP');
    }

    if (keyState.DOWN > keyState.UP) {
      p.move('DOWN');
    } else if (this.yVel > 0) {
      p.slow('DOWN');
    }

    if (keyState.LEFT > keyState.RIGHT) {
      p.move('LEFT');
    } else if (this.xVel < 0) {
      p.slow('LEFT');
    }

    if (keyState.RIGHT > keyState.LEFT) {
      p.move('RIGHT');
    } else if (this.xVel > 0) {
      p.slow('RIGHT');
    }

    if (keyState.SPACE >= 0) {
      this.takeAction();
      keyState.SPACE = -1;
    }
  }

  takeAction() {
    if (!this.inConversation) {
      let interactions = w.getInteractions();

      if (interactions.length > 0) {
        interactions[0].interact();
      }
    } else {
      cw.advance();
    }
  }

  move(direction) {
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

  slow(direction) {
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
