export class Rule {
  element = [];
  constructor(line) {
  
    this._line = line.trim();
    let lines = this._line.split("\n");

    lines.forEach((e) => {
      let parts = e.split(" ");
      this.element.push({
        start: parts[0],
        opt1: parts[1],
        opt2: parts[2],
      });
    });
  }

  get rules() {

    return this.element
  }
}
