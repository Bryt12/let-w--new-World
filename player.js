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
    this.acc = 0.1;

    this.boundHeight = this.maxVel * 2;
    this.bounceVelocity = this.acc * (0.1 / 0.07);
    this.deltaHeight = this.bounceVelocity;

    this.attacking = false;
  }

  draw() {
    fill(this.color);
    circle(this.x, this.y + this.height, 50);

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
    this.updatePosition();
    this.handleAttack();
    this.bounce();
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
    this.x += this.xVel;
    this.y += this.yVel;
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
    let interactions = w.getInteractions();

    if (interactions.length > 0) {
      interactions[0].interact();
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
