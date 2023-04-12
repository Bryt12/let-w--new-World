class Enemy {
  constructor(name, color, r, x, y, speed) {
    this.name = name;
    this.color = color;

    this.x = x;
    this.y = y;
    this.r = r;

    this.height = 0;

    this.speed = speed;

    this.boundHeight = this.speed * 2;
    this.bounceVelocity = this.speed * (0.1 / 0.07);
    this.deltaHeight = this.bounceVelocity;
  }

  bounce() {
    this.height += this.deltaHeight;
    if (this.height > this.boundHeight) {
      this.deltaHeight = -this.bounceVelocity;
    } else if (this.height < -this.boundHeight) {
      this.deltaHeight = this.bounceVelocity;
    }
  }

  draw() {
    circle(this.x, this.y, this.r);

    this.bounce();
  }

  update() {
    let x = p.x;
    let y = p.y;

    let dx = x - this.x;
    let dy = y - this.y;

    let angle = Math.atan2(dy, dx);

    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }
}
