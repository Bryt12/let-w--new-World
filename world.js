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
  constructor() {
    this.enemies = [];
    this.npcs = [];
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  addNPC(npc) {
    this.npcs.push(npc);
  }

  getInteractions() {
    const interactions = [];
    for (let npc of this.npcs) {
      if (npc.distanceFromPlayer < interactionDistance) {
        interactions.push(npc);
      }
    }
    return interactions;
  }

  update() {
    p.update();
    cw.update();
    for (let enemy of this.enemies) {
      enemy.update();
    }

    for (let npc of this.npcs) {
      npc.update();
    }
  }

  draw() {
    p.draw();
    cw.draw();

    for (let enemy of this.enemies) {
      enemy.draw();
    }

    for (let npc of this.npcs) {
      npc.draw();
    }
  }
}
