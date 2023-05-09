// import { ChatWindow } from './chatWindow';
import { Room } from './room.js';
import { Player } from './player.js';
import { ChatWindow } from './chatWindow.js';

import { interactionDistance } from './constants.js';

import P5 from 'p5';
// export let cw = new ChatWindow();

export class World {
  private p5: P5;

  private roomIndexX: number;
  private roomIndexY: number;

  private rooms: Room[][];

  private openSource: boolean;
  private keyState: any;

  private p: Player;
  private cw: ChatWindow;

  private t: number = 0;

  private taskList: any = [];

  constructor(p5: P5, sizeX: number, sizeY: number, p: Player) {
    this.p5 = p5;

    this.roomIndexX = 0;
    this.roomIndexY = 0;

    // Create empty rooms in 2d array of sizeX by sizeY
    this.rooms = [];
    for (let i = 0; i < sizeX; i++) {
      this.rooms.push([]);
      for (let j = 0; j < sizeY; j++) {
        this.rooms[i].push(new Room([], [], []));
      }
    }

    this.openSource = false;

    this.keyState = {
      UP: -1,
      DOWN: -1,
      LEFT: -1,
      RIGHT: -1,
      SPACE: -1,
    };

    this.p = p;
    this.cw = new ChatWindow();
  }

  getPlayer() {
    return this.p;
  }

  updateKeyState(key: string, val: number) {
    this.keyState[key] = val;
  }

  getMaxValKeyState() {
    // Loop through keyState object
    // Return the key with the highest value
    let maxKey = '';
    let maxVal = -1;
    for (let key in this.keyState) {
      if (this.keyState[key] > maxVal) {
        maxKey = key;
        maxVal = this.keyState[key];
      }
    }

    return maxVal;
  }

  getKeyState(key: string) {
    return this.keyState[key];
  }

  getIsOpenSource() {
    return this.openSource;
  }

  getChatWindow() {
    return this.cw;
  }

  flip() {
    this.openSource = !this.openSource;
  }

  getRoom(x: number, y: number) {
    return this.rooms[x][y];
  }

  getRooms() {
    return this.rooms;
  }

  setRoom(room: Room, x: number, y: number) {
    this.rooms[x][y] = room;
  }

  setPlayerRoom(x: number, y: number) {
    this.roomIndexX = x;
    this.roomIndexY = y;
  }

  moveRoom(direction: string): boolean {
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
      if (npc.getDistanceFromPlayer() < interactionDistance) {
        interactions.push(npc);
      }
    }

    for (let scenery of room.getScenery()) {
      if (scenery.getInPlayerRange()) {
        interactions.push(scenery);
      }
    }

    return interactions;
  }

  update() {
    const room = this.rooms[this.roomIndexX][this.roomIndexY];
    for (let enemy of room.getEnemies()) {
      enemy.update();
    }

    for (let npc of room.getNPCs()) {
      npc.update();
    }

    this.p.update();

    this.t = (this.t + 1) % 10;
    if (this.t === 0) {
      for (let scenery of room.getScenery()) {
        scenery.update();
      }
    }

    this.cw.update();
  }

  addTask(task: any) {
    this.taskList.push(task);
  }

  getTaskList() {
    return this.taskList;
  }

  clearKeyState() {
    this.keyState = {
      UP: -1,
      DOWN: -1,
      LEFT: -1,
      RIGHT: -1,
      SPACE: -1,
    };
  }

  draw() {
    const room = this.rooms[this.roomIndexX][this.roomIndexY];

    for (let scenery of room.getScenery()) {
      scenery.draw(this.p5);
    }

    for (let enemy of room.getEnemies()) {
      enemy.draw(this.p5);
    }

    this.p.draw(this.p5);

    for (let npc of room.getNPCs()) {
      npc.draw(this.p5);
    }

    this.cw.draw(this.p5);

    console.log(this.taskList);
  }
}
