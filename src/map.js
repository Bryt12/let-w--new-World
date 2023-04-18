class Map {
  constructor() {
    this.map = [];

    this.tileSize = 50;
  }

  loadMap(map) {
    this.map = map;
  }

  draw() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        let tile = this.map[i][j];
        let x = j * this.tileSize;
        let y = i * this.tileSize;

        fill(tile.color);
        rect(x, y, this.tileSize, this.tileSize);
      }
    }
  }
}
