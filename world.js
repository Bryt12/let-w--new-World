let p;
let cw = new ChatWindow();

let keyState = {
  UP: -1,
  DOWN: -1,
  LEFT: -1,
  RIGHT: -1,
  SPACE: -1,
};

class World {
  constructor(sizeX, sizeY) {
    this.roomIndexX = 0;
    this.roomIndexY = 0;

    // Create empty rooms in 2d array of sizeX by sizeY
    this.rooms = [];
    for (let i = 0; i < sizeX; i++) {
      this.rooms.push([]);
      for (let j = 0; j < sizeY; j++) {
        this.rooms[i].push(new Room([], []));
      }
    }

    this.openSource = false;
  }

  getIsOpenSource() {
    return this.openSource;
  }

  flip() {
    this.openSource = !this.openSource;
  }

  setRoom(room, x, y) {
    this.rooms[x][y] = room;
  }

  setPlayerRoom(x, y) {
    this.roomIndexX = x;
    this.roomIndexY = y;
  }

  moveRoom(direction) {
    let movedRoom = false;
    if (direction === 'UP') {
      if (this.roomIndexY > 0) {
        this.roomIndexY--;
        movedRoom = true;
      }
    } else if (direction === 'DOWN') {
      if (this.roomIndexY < this.rooms[0].length - 1) {
        this.roomIndexY++;
        movedRoom = true;
      }
    } else if (direction === 'LEFT') {
      if (this.roomIndexX > 0) {
        this.roomIndexX--;
        movedRoom = true;
      }
    } else if (direction === 'RIGHT') {
      if (this.roomIndexX < this.rooms.length - 1) {
        this.roomIndexX++;
        movedRoom = true;
      }
    }

    this.rooms[this.roomIndexX][this.roomIndexY].hasPlayer = true;

    return movedRoom; // This is so the player class can know if it moved rooms
  }

  getInteractions() {
    const room = this.rooms[this.roomIndexX][this.roomIndexY];

    const interactions = [];
    for (let npc of room.getNPCs()) {
      if (npc.distanceFromPlayer < interactionDistance) {
        interactions.push(npc);
      }
    }
    return interactions;
  }

  update() {
    const room = this.rooms[this.roomIndexX][this.roomIndexY];

    p.update();
    cw.update();
    for (let enemy of room.getEnemies()) {
      enemy.update();
    }

    for (let npc of room.getNPCs()) {
      npc.update();
    }
  }

  draw() {
    const room = this.rooms[this.roomIndexX][this.roomIndexY];

    p.draw();
    cw.draw();

    for (let enemy of room.getEnemies()) {
      enemy.draw();
    }

    for (let npc of room.getNPCs()) {
      npc.draw();
    }
  }
}
