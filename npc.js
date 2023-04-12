class NPC {
  constructor(name, color, r, x, y, inventory) {
    this.name = name;
    this.color = color;
    this.inventory = inventory;
    this.equipped = 0;

    this.x = x;
    this.y = y;
    this.r = r;

    this.height = 0;

    this.speed = 2;

    this.boundHeight = 2;
    this.bounceVelocity = 0.1;
    this.deltaHeight = this.bounceVelocity;

    this.distanceFromPlayer = 0;
    this.inPlayerRange = false;
  }

  calculateDistanceFromPlayer() {
    let distance = dist(this.x, this.y, p.x, p.y);

    this.distanceFromPlayer = distance;
  }

  displayName() {
    push();
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y + this.height - 40);
    pop();
  }

  drawAttack() {
    if (this.attacking) {
      this.inventory[this.equipped].draw(this.x, this.y, 25);
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

  interact() {
    // this.color = rc();
    cw.clear();

    cw.addEntity(this);
    cw.addEntity(p);
  }

  displayInteraction() {
    if (this.distanceFromPlayer < interactionDistance) {
      push();
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      text('[space]', this.x, this.y + this.height + 36);
      pop();
    }
  }

  draw(x = this.x, y = this.y) {
    fill(this.color);
    circle(x, y + this.height, this.r);

    if (x === this.x && y === this.y) {
      this.displayInteraction();
      this.displayName();
      this.drawAttack();
    }
  }

  update() {
    this.bounce();
    this.calculateDistanceFromPlayer();

    if (this.distanceFromPlayer < interactionDistance) {
      this.inPlayerRange = true;
    } else {
      if (this.inPlayerRange) {
        cw.clear();
      }
      this.inPlayerRange = false;
    }
  }
}
