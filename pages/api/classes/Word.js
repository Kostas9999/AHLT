export class Words {
  constructor(line) {
    this._line = line;
  }

  get words() {
    return this._line.split(" ");
  }
}
