function getMaxVal() {
  // Loop through keyState object
  // Return the key with the highest value
  let maxKey = '';
  let maxVal = -1;
  for (let key in keyState) {
    if (keyState[key] > maxVal) {
      maxKey = key;
      maxVal = keyState[key];
    }
  }

  return maxVal;
}

function rc() {
  return color(random(255), random(255), random(255));
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
