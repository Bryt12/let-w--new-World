import P5 from 'p5';

export class Sword {
  private name: string;
  private color: string;
  private damage: number;

  private attackLength: number;
  private attackTimer: number;
  private coolDown: number;

  private speed: number;
  private angle: number;

  constructor(
    name: string,
    color: string,
    damage: number,
    al: number,
    speed: number
  ) {
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

  draw(p5: P5, x: number, y: number, r: number) {
    p5.push();
    p5.fill(this.color);
    p5.translate(x, y);
    p5.rotate(this.angle);
    p5.rect(0, 0, r * 2, r * 2);
    p5.pop();
  }
}
