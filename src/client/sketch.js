import {
  drawWorld,
  setupWorld,
  keyPressedWorld,
  keyReleasedWorld,
} from './main.js';

const sketch = (p) => {
  p.setup = () => {
    p.frameRate(60);
    setupWorld(p);
  };

  p.draw = () => {
    drawWorld(p);
  };

  p.keyPressed = (event) => {
    keyPressedWorld(p, event.keyCode);
  };

  p.keyReleased = (event) => {
    keyReleasedWorld(event.keyCode);
  };
};

new p5(sketch);
