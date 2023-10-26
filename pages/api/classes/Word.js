export class Words {
  element = [];
  constructor(line) {
    this._line = line.trim();
    let lines = this._line.split("\n");

    lines.forEach((e) => {
      let parts = e.split(" ");
      this.element.push({
        word: parts[0],
        POS: parts[1],
        number: parts[2],
        root: parts[3],
      });
    });
  }

  get lexicon() {
    return this.element;
  }
}
