export class Obj_parsel {
  constructor(lexicon, pos, rules) {
    this._lexicon = lexicon;
    this._pos = pos;
    this._rules = rules;
  }
  word_to_struc(input) {
    let output = {};
    let lex = this._lexicon;

    for (let i = 0; i < lex.length; i++) {
      if (lex[i].word.toLowerCase() == input.toLowerCase()) {
        output = lex[i];
      }
    }

    return output;
  }

  words_to_obj_arr(input) {
    let output = [];
    let out_obj = {};
    let input_str_arr = input.split(" ");

    input_str_arr.forEach((e) => {
      let temp = this.word_to_struc(e);
      output.push(temp);
    });

    return output;
  }

  obj_arr_to_S_arr(input) {
    let output = [];
    let words = [];
    let count = 0;

    input.forEach((e) => {
      if (e.POS == "CC") {
        words.push(e);
        output.push({ type: "S", tag: count++, data: words });
        words = [];
      } else {
        words.push(e);
      }
    });

    output.push({ type: "S", tag: count, data: words });

    return output;
  }

  s_to_p(input) {
    let inital_possible = [{ opt1: "DT" }, { opt1: "VB" }];
    let next_possible = inital_possible;
    let p = [];
    let words = [];

    // loop over sentence

    for (let j = 0; j < input.length; j++) {
      let word_pos = input[j].POS;
      let curr_word_obj = input[j];

      for (let i = 0; i < next_possible.length; i++) {
        let r = next_possible[i];
        console.log(word_pos, r);
        if (r.length == 1 && r.opt1 == "#") {
          p.push({ type: "P", tag: "", data: words });
          next_possible = inital_possible;
          words = [];
        } else if (word_pos == r.opt1) {
          words.push(curr_word_obj);
          next_possible = this.getNext_FromRule(word_pos);
        }
      }
    }

    p.push({ type: "P", tag: "tag", data: words });
    console.log(p);
    return p;
  }

  all_s(input) {
    let output = [];

    for (let i = 0; i < input.length; i++) {
      if (input[i].data.length > 0) {
        let x = this.s_to_p(input[i].data);

        output.push(x);
      }
    }

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

  tag_pharse(input) {
    return "input";
  }
}
