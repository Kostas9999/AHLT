export class VP {
  constructor(verb, number, object) {
    this._verb = verb;
    this._number = number;
    this._object = object;
    this._POS = "VP";
    this._valid = false;
  }
  _POS = "";
  get verb() {
    return this._verb;
  }
  set verb(verb) {
    this._verb = verb;
  }

  get number() {
    return this._number;
  }
  set number(number) {
    this._number = number;
  }
  get object() {
    return this._object;
  }
  set object(object) {
    this._object = object;
  }

  get POS() {
    return this._POS;
  }
  get valid() {
    return this._valid;
  }
  isValid() {
    return this._valid;
    numberValid();
  }
}
