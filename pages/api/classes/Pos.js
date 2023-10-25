export class Pos {
  constructor(line) {
    this._line = line;
  }

  get pos() {
    let first_Line = this._line.split("\r\n")[0];
    let arr = first_Line.split(" ");
    return arr;
  }
}
