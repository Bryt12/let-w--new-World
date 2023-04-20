import P5 from 'p5';
import { w } from './main.js';

export abstract class Talkable {
  private personality: string;

  private history: any[] = [];
  private additionalDialog: string = '';

  private dialog: string[];
  private passiveDialog: string[];
  private currentLine: number = 0;

  constructor(personality: string, dialog: string[], passiveDialog: string[]) {
    this.personality = personality;
    this.dialog = dialog;
    this.passiveDialog = passiveDialog;
  }

  clearDialog() {
    this.currentLine = 0;
  }

  getDialog() {
    return this.dialog;
  }

  getCurrentLine() {
    return this.currentLine;
  }

  setCurrentLine(line: number) {
    this.currentLine = line;
  }

  getPassiveDialog() {
    return this.passiveDialog;
  }

  setPassiveDialog(passiveDialog: string[]) {
    this.passiveDialog = passiveDialog;
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

  nextLine(callback: (text: string) => void, done: () => void) {
    let dialog = this.getDialog();
    let currentLine = this.getCurrentLine();
    if (currentLine >= dialog.length) {
      callback(dialog[currentLine]);

      this.setCurrentLine(0);
      done();
    } else {
      callback(dialog[currentLine]);

      this.setCurrentLine(currentLine + 1);
    }
  }

  interact() {
    // this.color = rc();
    const cw = w.getChatWindow();
    console.log('----interact----');

    cw.clear();

    cw.addTalkable(this);
    cw.addTalkable(w.getPlayer());

    let text = '';
    if (this.getHistory().length === 0) {
      text = this.getDialog()[0];
      console.log(text);
    } else {
      text = this.getPassiveDialog()[0];
      this.addHistory({
        role: 'system',
        content: 'The users ended the conversation.',
      });
    }
    this.addHistory({
      role: 'assistant',
      content: text,
    });

    cw.setText(text);
  }

  abstract draw(p5: P5): void;
  abstract draw(p5: P5, x: number, y: number): void;

  abstract update(): void;

  abstract getDistanceFromPlayer(): number;
}
