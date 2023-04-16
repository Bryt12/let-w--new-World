class Room {
  constructor(enemies, npcs, scenery) {
    this.enemies = enemies;
    this.npcs = npcs;
    this.scenery = scenery;

    this.hasPlayer = false;
  }

  getEnemies() {
    if (this.enemies === undefined) {
      return [];
    }
    return this.enemies;
  }

  getNPCs() {
    if (this.npcs === undefined) {
      return [];
    }
    return this.npcs;
  }

  getScenery() {
    if (this.scenery === undefined) {
      return [];
    }
    return this.scenery;
  }
}
