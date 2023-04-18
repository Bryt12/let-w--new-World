import { Enemy } from './enemy.js';
import { Entity } from './entity.js';
import { Scenery } from './scenery.js';

export class Room {
  private enemies: Enemy[];
  private npcs: Entity[];
  private scenery: any[];

  public hasPlayer: boolean;

  constructor(enemies: Enemy[], npcs: Entity[], scenery: Scenery[]) {
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
