import { Entity } from './entity.js';
import { screenWidth, screenHeight } from './main.js';
import { LLM } from './llm.js';

import P5 from 'p5';

export class ChatWindow {
  private entities: Entity[];

  private boundHeight: number;
  private bounceVelocity: number;
  private deltaHeight: number;
  private height: number;

  private input: any;
  private button: any;

  private text: string;

  private currentEntity: number;

  private llm: LLM = new LLM();
  private llmLoading: boolean = false;

  constructor() {
    this.entities = [];

    this.boundHeight = 1;
    this.bounceVelocity = 0.1;
    this.deltaHeight = this.bounceVelocity;
    this.height = 0;

    this.text = '';

    this.currentEntity = 0;
  }

  setup(p5: P5) {
    this.input = p5.createInput();
    this.input.position(0, 0);
    this.input.hide();

    this.button = p5.createButton('Respond');
    this.button.position(150, 0);
    this.button.mousePressed(this.getResponse.bind(this));
    this.button.hide();
  }

  bounce() {
    this.height += this.deltaHeight;
    const isOutOfBoundsTop = +(this.height > this.boundHeight);
    const isOutOfBoundsBottom = +(this.height < -this.boundHeight);
    this.deltaHeight =
      this.deltaHeight * (1 - isOutOfBoundsTop - isOutOfBoundsBottom) +
      this.bounceVelocity * (isOutOfBoundsBottom - isOutOfBoundsTop);
  }

  draw(p5: P5) {
    if (this.entities.length === 0) {
      this.input.hide();
      this.button.hide();
      return;
    }

    this.input.show();
    this.button.show();
    p5.push();
    let top = screenHeight * (4 / 5); //+ p.height;
    let chatHeight = screenHeight - 10 - top; //+ p.height;
    let middle = top + chatHeight / 4;

    p5.fill(255);
    p5.stroke(0);
    p5.rect(10, top, screenWidth - 20, chatHeight);

    // Draw a square at the start of the box, 10 pixels from each border
    let squareSize = chatHeight - 20;
    let squareX = 10 + 10;
    let squareY = top + 10;

    p5.fill(255);
    p5.stroke(0);
    p5.rect(squareX, squareY, squareSize, squareSize);

    if (this.entities.length > 1) {
      let entity = this.entities[0];
      entity.draw(p5, squareX + squareSize / 2, squareY + squareSize / 2);
    }

    p5.textAlign(p5.LEFT, p5.CENTER);
    p5.fill(0);
    p5.noStroke();
    if (this.llmLoading) {
      p5.text('...', squareX + squareSize + 10, middle);
    } else {
      this.drawText(p5, this.text, squareX + squareSize + 10, middle);
    }

    // Draw arrow pointing down on the bottom right
    let arrowSize = 10;
    let arrowX = screenWidth - 10 - arrowSize - 5;
    let arrowY = screenHeight - 10 - arrowSize;

    p5.fill(0);
    p5.triangle(
      arrowX,
      this.height + arrowY,
      arrowX + arrowSize,
      this.height + arrowY,
      arrowX + arrowSize / 2,
      this.height + arrowY + arrowSize / 2
    );

    p5.pop();
  }

  setText(text: string) {
    this.text = text;
  }

  drawText(p5: P5, text: string, x: number, y: number) {
    let words = text.split(' ');

    let currentLine = '';
    let currentY = y;
    let lineHeight = 20;
    let maxWidth = screenWidth - x - 10;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let nextLine = currentLine + word + ' ';

      if (p5.textWidth(nextLine) > maxWidth) {
        p5.text(currentLine, x, currentY);
        currentLine = word + ' ';
        currentY += lineHeight;
      } else {
        currentLine = nextLine;
      }

      // If there are already 3 lines, we want to get the
      // rest of the text and store it in additionalDialog
      if (currentY >= y + lineHeight * 3) {
        this.entities[this.currentEntity].setAdditionalDialog(
          words.slice(i).join(' ')
        );
        return;
      }
    }
    p5.text(currentLine, x, currentY);
  }

  getCurrentEntityAdditionalDialog() {
    return this.entities[this.currentEntity].getAdditionalDialog();
  }

  update() {
    this.bounce();

    if (this.text === '' && this.entities.length > 0) {
      this.advance();
    }
  }

  advance() {
    // this.entities[this.currentEntity].nextLine(
    //   (text) => {
    //     this.text = text;
    //   },
    //   () => {
    //     this.clear();
    //     w.getPlayer().setInConversation(false);
    //   }
    // );

    this.text = this.getCurrentEntityAdditionalDialog();
  }

  async getResponse() {
    if (this.llmLoading) {
      return;
    }

    const history = this.getCurrentEntityHistory();

    // Get value that is in the input box
    let response = this.input.value();

    this.llmLoading = true;
    const httpRes = await this.llm.getChatGPTResponse(response);
    this.llmLoading = false;

    history.push({
      role: 'user',
      content: response,
    });
    history.push(httpRes);

    this.text = httpRes.content;
  }

  getCurrentEntityHistory() {
    return this.entities[this.currentEntity].getHistory();
  }

  getCurrentPersonality() {
    return this.entities[this.currentEntity].getPersonality();
  }

  clear() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].clearDialog();
    }

    this.entities = [];
    this.text = '';
    this.currentEntity = 0;
    this.height = 0;

    // this.additionalDialog = '';
    // this.history = [];
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
}
