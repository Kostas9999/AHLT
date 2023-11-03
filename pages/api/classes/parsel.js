export class Parsel {
  constructor(lexicon, pos, rules) {
    this._lexicon = lexicon;
    this._pos = pos;
    this._rules = rules;
  }

  words_To_POS(input_str) {
    let lex = this._lexicon;

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
      temp[i] = "?";
      lexicon.forEach((lex_word) => {
        if (word.toLowerCase() == lex_word.word.toLowerCase()) {
          temp[i] = lex_word.POS;
        }
      });
    });

    return temp;
  }

  validate_POS(input) {
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

  output_arr(input) {
    let curr = [];

    let output = input;

    for (let i = 0; i < input.length; i++) {
      // if ? then stop looping for output
      if (input[i] == "?") {
        output = curr;
        curr.push("?");
        return output;
      } else {
        curr.push(input[i]);
        output = input;
      }
    }

    //    console.log(output.length);
    return output;
  }

  getNext_FromRule(input) {
    let rules = this._rules;
    let out = [];

    rules.forEach((e) => {
      if (input == e.start) {
        out.push(e);
      }
    });

    return out;
  }

  validate_rules_words(input) {
    let inital_possible = [{ opt1: "DT" }, { opt1: "VB" }];
    let output;
    let part = [];
    let phrase = [];
    let next_possible = inital_possible;
    output = [];

    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < next_possible.length; j++) {
        if (input[i] == next_possible[j].opt1) {
          let rule = this.getNext_FromRule(input[i]);

          if (rule.length == 1 && rule[0].opt1 == "#") {
            output.push(input[i]);
            part.push(input[i]);
            phrase.push(part);
            part = [];
            next_possible = inital_possible;
          } else {
            next_possible = rule;
            part.push(input[i]);
            output.push(input[i]);
          }
        }
      }
    }

    return [output, phrase];
  }

  validate_rules_phrase(i) {
    let input = i[0];
    let phrases = i[1];
    let phrases_tag = [];
    let output;

    phrases.forEach((e) => {
      let temp = this.tag_pharse(e);
      phrases_tag.push(temp);
    });
    output = phrases_tag;
    return output;
  }

  tag_pharse(input) {
    for (let i = 0; i < input.length; i++) {
      if (input[i] == "DT") {
        let data = { tag: "NP", phrase: input };
        return data;
      } else if ((input[i] = "VB")) {
        let data = { tag: "VP", phrase: input };
        return data;
      }
    }
  }

  obj_toString(input) {
    let output;
    let str_out = "";

    input.forEach((e) => {
      let temp = `[${e.tag} [ ${e.phrase.join("  ")} ] ] `;
      str_out = str_out + temp;
    });

    output = [str_out];
    return output;
  }

  build_Tree(input) {
    let possible_P_start = [{ opt1: "DT" }, { opt1: "VB" }];
    let s = [];
    let phrase = [];
    let words = [];
    let next = possible_P_start;
    let prev = [];

    for (let i = 0; i < input.length; i++) {
      let rule = this.getNext_FromRule(input[i]);

      prev = next;
      next = [];
      rule.forEach((e) => {
        next.push(e);
      });

      for (let j = 0; j < prev.length; j++) {
        if (input[i] == prev[j].opt1) {
          words.push(input[i]);
        }
      }
      if (next.length == 1 && next[0].opt1 == "#") {
        phrase.push(words);
        next = possible_P_start;
        words = [];
        //  rule = [];
      }
    }
    if (phrase.length > 0 && next.length == 0) {
      return;
    }
  }
}
