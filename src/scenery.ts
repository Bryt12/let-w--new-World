import P5 from 'p5';

export abstract class Scenery {
  abstract draw(p5: P5): void;
  abstract update(): void;
}
