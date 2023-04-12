wid = 500;
hig = 500;

let w = new World();

function setup() {
  createCanvas(wid, hig);

  // e = new Enemy('Enemy 1', 'green', 20, 0, 0, 0.4);
  // w.addEnemy(e);

  npm = new NPC('NPC 1', 'blue', 50, 100, 100, []);
  w.addNPC(npm);

  fire_sword = new Sword('Fire Sword', '#FF0000', 2, 60, 0.3);
  p = new Player('Bryson', '#FFFF00', width / 2, height / 2, [fire_sword]);
}

function draw() {
  background(255);
  drawBorder();

  w.update();
  w.draw();
}

function drawBorder() {
  noFill();
  stroke(0);
  square(1, 1, wid - 1);
}

function keyPressed() {
  let maxVal = getMaxVal();
  console.log(keyCode);

  if (keyCode === UP_ARROW || keyCode === 87) {
    keyState.UP = maxVal + 1;
  } else if (keyCode === DOWN_ARROW || keyCode === 83) {
    keyState.DOWN = maxVal + 1;
  } else if (keyCode === LEFT_ARROW || keyCode === 65) {
    keyState.LEFT = maxVal + 1;
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    keyState.RIGHT = maxVal + 1;
  } else if (keyCode === 32) {
    keyState.SPACE = maxVal + 1;
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === 87) {
    keyState.UP = -1;
  } else if (keyCode === DOWN_ARROW || keyCode === 83) {
    keyState.DOWN = -1;
  } else if (keyCode === LEFT_ARROW || keyCode === 65) {
    keyState.LEFT = -1;
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    keyState.RIGHT = -1;
  } else if (keyCode === 32) {
    keyState.SPACE = -1;
  }
}
