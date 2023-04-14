class ChatWindow {
  constructor() {
    this.entities = [];

    this.boundHeight = 1;
    this.bounceVelocity = 0.1;
    this.deltaHeight = this.bounceVelocity;
    this.height = 0;

    this.text = 'Hello, World!';

    this.currentEntity = 0;
  }

  bounce() {
    this.height += this.deltaHeight;
    if (this.height > this.boundHeight) {
      this.deltaHeight = -this.bounceVelocity;
    } else if (this.height < -this.boundHeight) {
      this.deltaHeight = this.bounceVelocity;
    }
  }

  draw() {
    if (this.entities.length === 0) {
      return;
    }
    push();
    let top = hig * (4 / 5); //+ p.height;
    let chatHeight = hig - 10 - top; //+ p.height;
    let middle = top + chatHeight / 4;

    fill(255);
    stroke(0);
    rect(10, top, wid - 20, chatHeight);

    // Draw a square at the start of the box, 10 pixels from each border
    let squareSize = chatHeight - 20;
    let squareX = 10 + 10;
    let squareY = top + 10;

    fill(255);
    stroke(0);
    rect(squareX, squareY, squareSize, squareSize);

    if (this.entities.length > 1) {
      let entity = this.entities[0];
      entity.draw(squareX + squareSize / 2, squareY + squareSize / 2);
    }

    textAlign(LEFT, CENTER);
    fill(0);
    text(this.text, squareX + squareSize + 10, middle);

    // Draw arrow pointing down on the bottom right
    let arrowSize = 10;
    let arrowX = wid - 10 - arrowSize - 5;
    let arrowY = hig - 10 - arrowSize;

    fill(0);
    triangle(
      arrowX,
      this.height + arrowY,
      arrowX + arrowSize,
      this.height + arrowY,
      arrowX + arrowSize / 2,
      this.height + arrowY + arrowSize / 2
    );

    pop();
  }

  update() {
    this.bounce();
  }

  advance() {
    // const reponse = this.entities[this.currentEntity].nextLine();
  }

  clear() {
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }
}
