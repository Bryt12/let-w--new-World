import P5 from 'p5';

export abstract class Entity {
  private personality: string;

  private history: any[] = [];
  private additionalDialog: string = '';

  constructor(personality: string) {
    this.personality = personality;
  }

  getPersonality() {
    return this.personality;
  }

  getHistory() {
    return this.history;
  }

  addHistory(obj: any) {
    this.history.push(obj);
  }

  getAdditionalDialog() {
    return this.additionalDialog;
  }

  setAdditionalDialog(additionalDialog: string) {
    this.additionalDialog = additionalDialog;
  }

  abstract draw(p5: P5): void;
  abstract draw(p5: P5, x: number, y: number): void;

  abstract update(): void;
  abstract clearDialog(): void;

  abstract nextLine(callback: (text: string) => void, done: () => void): void;

  abstract interact(): void;
  abstract getDistanceFromPlayer(): number;
}
