wid = 500;
hig = 500;

roomsX = 4;
roomsY = 4;

let w = new World(roomsX, roomsY);

function setup() {
  createCanvas(wid, hig);

  // e = new Enemy('Enemy 1', 'green', 20, 0, 0, 0.4);
  // w.addEnemy(e);

  // let xSpot = int(random(roomsX));
  // let ySpot = int(random(roomsY));
  let xSpot = 1;
  let ySpot = 1;

  for (var i = 0; i < roomsX; i++) {
    for (var j = 0; j < roomsY; j++) {
      let npcs = [];
      let patches = dist(i, j, xSpot, ySpot) < 2 ? 10 : 5;
      if (i === xSpot && j === ySpot) {
        patches = 200;

        // let sing = new Singularity(width / 2, height / 2);
        // npcs.push(sing);
      }

      const grassPatches = [];
      for (var k = 0; k < patches; k++) {
        grassPatches.push(
          new GrassPatch(random(0, wid), random(0, hig), 7, 14)
        );
      }

      let room = new Room([], [...npcs], [...grassPatches]);
      w.setRoom(room, i, j);
    }
  }

  w.getRoom(xSpot, ySpot);

  // npc = new NPC('NPC 1', 'blue', 50, 100, 100, []);
  // r = new Room([], [], [...grassPatches]);

  w.setPlayerRoom(1, 1);
  // w.setRoom(r, 1, 1);

  fire_sword = new Sword('Fire Sword', '#FF0000', 2, 60, 0.3);
  p = new Player('', '#FFFF00', width / 2, height / 2, [fire_sword]);
}

function draw() {
  if (w.getIsOpenSource()) {
    background(0);
  } else {
    background(255);
  }
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
  } else if (keyCode === 70) {
    w.flip();
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
