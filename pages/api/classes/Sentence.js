export class Sentence {
  constructor(noun_Phrase, verb_Phrase) {
    this._noun_Phrase = noun_Phrase;
    this._verb_Phrase = verb_Phrase;
  }

  get noun_Phrase() {
    return this._noun_Phrase;
  }
  set noun_Phrase(noun_Phrase) {
    this._noun_Phrase = noun_Phrase;
  }

  get verb_Phrase() {
    return this._verb_Phrase;
  }
  set verb_Phrase(verb_Phrase) {
    this._verb_Phrase = verb_Phrase;
  }
  numberValid() {
    let n_number = this._noun_Phrase.number;
    let v_number = this._verb_Phrase.number;
    //console.log(this._noun_Phrase.number);
    return true;
  }
}
