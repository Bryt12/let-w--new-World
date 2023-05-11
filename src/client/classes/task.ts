class Item {
  public name: string;
  public script: string;

  constructor(name: string, script: string) {
    this.name = name;
    this.script = script;
  }
}

export class Task {
  public message: string;
  public isComplete: boolean;

  public items: Item[];
  public location: string;
  public reward: string;

  constructor(
    message: string,
    location: string,
    reward: string,
    items: Item[] = []
  ) {
    this.message = message;
    this.isComplete = false;
    this.items = items;
    this.location = location;
    this.reward = reward;
  }

  public addTaskItem(name: string, script: string) {
    this.items.push({ name, script });
  }
}
