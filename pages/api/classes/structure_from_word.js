export class structure_from_word {
  constructor(word, lexicon) {
    this._lexicon = lexicon;
    this._word = word;
  }

  getStruc(word, lexicon) {
    word.trim();

    console.log(word);
    let parts = e.split(" ");
    this.element.push({
      word: parts[0],
      name: parts[1],
      number: parts[2],
      root: parts[3],
    });
  }
}
