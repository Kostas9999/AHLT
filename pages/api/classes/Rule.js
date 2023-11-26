export class Rule {
  element = [];
  constructor(line) {
    this._line = line.trim();
    let lines = this._line.split("\n");
    lines.shift();
    lines.forEach((e) => {
      let parts = e.split(" ");
      this.element.push({
        start: parts[0]?.trim(),
        opt1: parts[1]?.trim(),
        opt2: parts[2]?.trim(),
      });
    });
  }

  get rules() {
    return this.element;
  }
}
