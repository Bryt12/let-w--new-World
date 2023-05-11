import { Task } from './classes/task';
import { w, screenWidth, screenHeight } from './main.js';

import P5 from 'p5';

export class TaskList {
  private tasks: Task[];

  private visible: boolean;

  constructor() {
    this.tasks = [];

    this.visible = false;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  setup(p5: P5) {}

  draw(p5: P5) {
    if (!this.visible) return;

    p5.push();
    let top = 10;
    let chatHeight = screenHeight - 10 - top;
    let middle = top + chatHeight / 4;

    p5.fill(255);
    p5.stroke(0);
    p5.rect(10, top, screenWidth - 20, chatHeight);

    // Draw tasks

    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.fill(0);
    p5.noStroke();

    let y = top + 10;
    for (let i = 0; i < this.tasks.length; i++) {
      let task = this.tasks[i];
      console.log(task);
      p5.text(task.message, 20, y);
      for (let j = 0; j < task.items.length; j++) {
        let item = task.items[j];
        y += 20;
        p5.text(item.name, 40, y);
        y += 20;

        let code = `return ${item.script}`;

        const backgroundRegex = /p\.background\(\d+\);/g;
        code = code.replace(backgroundRegex, '');

        try {
          const getObject = new Function(code);
          const myObject = getObject();

          p5.push();

          p5.translate(40, y);

          const scale = 0.25;

          p5.fill(100);
          p5.rectMode(p5.CORNER);
          p5.rect(0, 0, 400 * scale, 400 * scale); // Draw at 0,0 because it's translated

          p5.fill(255);

          p5.scale(0.25);
          myObject.draw(p5);
          p5.pop();

          y += screenHeight * scale;
        } catch (e) {
          console.log(e);
        }
      }

      y += 20;
    }

    p5.pop();
  }

  update() {
    if (w.getKeyState('T') !== -1) {
      this.visible = !this.visible;
      w.updateKeyState('T', -1);
    }
  }
}
