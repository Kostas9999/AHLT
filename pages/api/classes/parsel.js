export class Parsel {
  constructor(lexicon, pos, rules) {
    this._lexicon = lexicon;
    this._pos = pos;
    this._rules = rules;
  }

  parse(input_str) {
    let lex = this._lexicon;
    let pos = this._pos;
    let rules = this._rules;

    let input_arr = input_str.split(" ");
    let txt_to_pos = this.translate_to_pos(input_arr, lex);

    return txt_to_pos;
  }

  translate_to_pos(input, lexicon) {

    if (input == null) {
      return input;
    }
    let temp = [...input];
    input.forEach((word, i) => {
      temp[i] = "_";
      lexicon.forEach((lex_word) => {
        if (word.toLowerCase() == lex_word.word.toLowerCase()) {
          temp[i] = lex_word.POS;
        }
      });
    });

    return temp;
  }

  validate_dict(input) {
    if (input.length == 0) {
      return true;
    }
    let out = true;
    let pos = this._pos;
    input.forEach((e) => {
      if (!pos.includes(e)) {
        out = false;
      }
    });

    return out;
  }

  rules(input){
    let lex = this._lexicon;
    let rules = this._rules;

    let output = input
    
    console.log(output)
    output.push("]")
return output
  }
}
