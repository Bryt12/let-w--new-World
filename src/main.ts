import { World } from './world.js';

import { Player } from './player.js';
import { Sword } from './weapons/sword.js';

import { loadWorld0 } from './worlds/world0.js';

import P5 from 'p5';

export const screenWidth = 500;
export const screenHeight = 500;

export let w: World;

export function setupWorld(p5: P5) {
  p5.createCanvas(screenWidth, screenHeight);

  const fire_sword = new Sword('Fire Sword', '#FF0000', 2, 60, 0.3);
  const p = new Player('', '#FFFF00', p5.width / 2, p5.height / 2, [
    fire_sword,
  ]);

  w = loadWorld0(p5, p);

  w.getChatWindow().setup(p5);
}

export function drawWorld(p5: P5) {
  if (w.getIsOpenSource()) {
    p5.background(0);
  } else {
    p5.background(255);
  }
  drawBorder(p5);

  w.update();
  w.draw();

  drawFPS(p5);
}

function drawFPS(p5: P5) {
  p5.push();
  const fr = p5.frameRate();
  if (fr < 55) {
    p5.fill('red');
  } else {
    p5.fill(0);
  }
  p5.textSize(60);
  p5.text(fr.toFixed(0), 10, 40);
  p5.pop();
}

function drawBorder(p5: P5) {
  p5.noFill();
  p5.stroke(0);
  p5.square(1, 1, screenWidth - 1);
}

export function keyPressedWorld(keyCode: number) {
  let maxVal = w.getMaxValKeyState();

  if (keyCode === 27) {
    w.getPlayer().setInConversation(false);
    w.getChatWindow().clear();
  }

  if (w.getPlayer().getInConversation()) {
    if (
      w.getChatWindow().getCurrentEntityAdditionalDialog().length > 0 &&
      keyCode === 32
    ) {
      w.updateKeyState('SPACE', maxVal + 1);
    }
    return;
  }

  if (keyCode === 87) {
    w.updateKeyState('UP', maxVal + 1);
  } else if (keyCode === 83) {
    w.updateKeyState('DOWN', maxVal + 1);
  } else if (keyCode === 65) {
    w.updateKeyState('LEFT', maxVal + 1);
  } else if (keyCode === 68) {
    w.updateKeyState('RIGHT', maxVal + 1);
  } else if (keyCode === 32) {
    w.updateKeyState('SPACE', maxVal + 1);
  } else if (keyCode === 70) {
    w.flip();
  }
}

export function keyReleasedWorld(keyCode: number) {
  if (keyCode === 87) {
    w.updateKeyState('UP', -1);
  } else if (keyCode === 83) {
    w.updateKeyState('DOWN', -1);
  } else if (keyCode === 65) {
    w.updateKeyState('LEFT', -1);
  } else if (keyCode === 68) {
    w.updateKeyState('RIGHT', -1);
  } else if (keyCode === 32) {
    w.updateKeyState('SPACE', -1);
  }
}
