class Room {
  constructor(enemies, npcs) {
    this.enemies = enemies;
    this.npcs = npcs;

    this.hasPlayer = false;
  }

  getEnemies() {
    return this.enemies;
  }

  getNPCs() {
    return this.npcs;
  }
}
