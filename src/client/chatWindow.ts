import { Talkable } from './talkable.js';
import { screenWidth, screenHeight } from './main.js';
import { LLM } from './llm.js';

import P5 from 'p5';

export class ChatWindow {
  private talkables: Talkable[];

  private boundHeight: number;
  private bounceVelocity: number;
  private deltaHeight: number;
  private height: number;

  private input: any;
  private button: any;

  private text: string;

  private currentTalkable: number;

  private llm: LLM = new LLM();
  private llmLoading: boolean = false;

  private task: any = {};

  constructor() {
    this.talkables = [];

    this.boundHeight = 1;
    this.bounceVelocity = 0.1;
    this.deltaHeight = this.bounceVelocity;
    this.height = 0;

    this.text = '';

    this.currentTalkable = 0;
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
    if (this.talkables.length === 0) {
      this.input.hide();
      this.button.hide();
      return;
    }

    if (this.task.script) {
      // const sketch = JSON.parse(this.task.script);
      //const objectString = `(${this.task.script}})`;

      const getObject = new Function(this.task.script);
      console.log('Draw');
      // Assuming you have a p variable already defined
      const myObject = getObject();

      // Now you can use myObject.setup and myObject.draw with p

      p5.push();
      myObject.draw(p5);
      p5.pop();
    }
    // sketch.draw(p5);
    // }

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

    if (this.talkables.length > 1) {
      let talkable = this.talkables[0];
      talkable.draw(p5, squareX + squareSize / 2, squareY + squareSize / 2);
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
    p5.textAlign(p5.LEFT, p5.CENTER);

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
        this.talkables[this.currentTalkable].setAdditionalDialog(
          words.slice(i).join(' ')
        );
        return;
      }
    }
    p5.text(currentLine, x, currentY);
  }

  getCurrentTalkableAdditionalDialog() {
    return this.talkables[this.currentTalkable].getAdditionalDialog();
  }

  update() {
    this.bounce();

    if (this.text === '' && this.talkables.length > 0) {
      this.advance();
    }
  }

  advance() {
    // this.talkables[this.currentTalkable].nextLine(
    //   (text) => {
    //     this.text = text;
    //   },
    //   () => {
    //     this.clear();
    //     w.getPlayer().setInConversation(false);
    //   }
    // );

    console.log('advancing');

    this.text = this.getCurrentTalkableAdditionalDialog();
  }

  async getResponse() {
    if (this.llmLoading) {
      return;
    }

    const history = this.getCurrentTalkableHistory();

    // Get value that is in the input box
    let response = this.input.value();

    this.llmLoading = true;
    const httpRes = await this.llm.getChatGPTResponse(response, (task: any) => {
      this.task = task;
    });
    this.llmLoading = false;

    history.push({
      role: 'user',
      content: response,
    });
    history.push(httpRes);
    console.log(httpRes);
    this.text = httpRes.content;
  }

  getCurrentTalkableHistory() {
    return this.talkables[this.currentTalkable].getHistory();
  }

  getCurrentPersonality() {
    return this.talkables[this.currentTalkable].getPersonality();
  }

  clear() {
    for (let i = 0; i < this.talkables.length; i++) {
      this.talkables[i].clearDialog();
    }

    this.talkables = [];
    this.text = '';
    this.currentTalkable = 0;
    this.height = 0;

    // this.additionalDialog = '';
    // this.history = [];
  }

  addTalkable(talkable: Talkable) {
    this.talkables.push(talkable);
  }
}
