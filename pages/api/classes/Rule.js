export class Rule {
  constructor(line) {
    this._line = line;
  }

  get rules() {
    let all_Lines = this._line.split("\r\n");
    const x = all_Lines.splice(1, all_Lines.length - 1);
    return x;
  }
}
