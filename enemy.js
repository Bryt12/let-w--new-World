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

    this.rand = [this.generateRandomList(4), this.generateRandomList(4)];

    this.i = 0;
  }

  bounce() {
    this.height += this.deltaHeight;
    if (this.height > this.boundHeight) {
      this.deltaHeight = -this.bounceVelocity;
    } else if (this.height < -this.boundHeight) {
      this.deltaHeight = this.bounceVelocity;
    }
  }

  generateRandomList(n) {
    let list = [];
    for (var i = 0; i < n; i++) {
      list.push(random());
    }
    return list;
  }

  draw() {
    push();
    rectMode(CENTER);
    translate(this.x, this.y);
    const d = 5;
    for (var i = 0; i < 4; i++) {
      const r1 = this.rand[0][i];
      const r2 = this.rand[1][i];

      const x = map(r1, 0, 1, -d, d);
      const y = map(r2, 0, 1, -d, d);

      if (r1 > 0.5) {
        stroke(255);
        fill(0);
      } else {
        stroke(0);
        fill(255);
      }

      if (r2 > 0.5) {
        circle(x, y, this.r);
      } else {
        square(x, y, this.r);
      }
    }
    pop();

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

    this.i++;
    if (this.i > 3) {
      this.rand[0] = this.generateRandomList(4);
      this.rand[1] = this.generateRandomList(4);
      this.i = 0;
    }
  }
}
