class Sword {
  constructor(name, color, damage, al, speed) {
    this.name = name;
    this.damage = damage;

    this.attackLength = al;
    this.attackTimer = 0;
    this.coolDown = 0;

    this.speed = speed;
    this.angle = 0;

    this.color = color;
  }

  update() {
    if (this.coolDown > this.attackLength) {
      this.coolDown = 0;
      return {
        damage: 0,
        attacking: false,
      };
    }

    this.angle += this.speed;
    this.attackTimer += 1;

    let doneAttack = this.attackTimer > this.attackLength;

    if (doneAttack) {
      this.angle = 0;
      this.attackTimer = 0;
      this.coolDown = 0;
    }

    return {
      damage: this.damage,
      attacking: doneAttack,
    };
  }

  draw(x, y, r) {
    push();
    fill(this.color);
    translate(x, y);
    rotate(this.angle);
    rect(0, 0, r * 2, r * 2);
    pop();
  }
}
