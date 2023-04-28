import P5 from 'p5';

function rc() {
  return color(random(255), random(255), random(255));
}

export function polygon(
  p5: P5,
  x: number,
  y: number,
  radius: number,
  npoints: number
) {
  let angle = p5.TWO_PI / npoints;
  p5.beginShape();
  for (let a = 0; a < p5.TWO_PI; a += angle) {
    let sx = x + p5.cos(a) * radius;
    let sy = y + p5.sin(a) * radius;
    p5.vertex(sx, sy);
  }
  p5.endShape(p5.CLOSE);
}

export function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function random(min: number = 0, max: number = 1) {
  return Math.random() * (max - min) + min;
}
