export class NP {
  constructor(dt, jj, noun, number) {
    this._dt = dt;
    this._jj = jj;
    this._noun = noun;
    this._POS = "NP";
    this._valid = false;
    this._number = number;
  }
  _POS = "";

  get subject() {
    return this._subjecte;
  }
  set subject(subject) {
    this._subject = subject;
  }

  get jj() {
    return this._jj;
  }
  set jj(jj) {
    this._jj = jj;
  }
  get noun() {
    return this._noun;
  }
  set noun(noun) {
    this._noun = noun;
  }

  get number() {
    return this._number;
  }
  set number(number) {
    this._number = number;
  }

  get POS() {
    return this._POS;
  }
  get valid() {
    return this._valid;
  }
  isValid() {
    return this._valid;
  }
}
