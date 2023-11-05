import { Children } from "react";

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
      if (lex[i].name.toLowerCase() == input.toLowerCase()) {
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
    let count = 1;

    input.forEach((e) => {
      if (e.POS == "CC") {
        words.push(e);
        output.push({ name: `S${count++}`, count: count++, children: words });
        words = [];
      } else {
        words.push(e);
      }
    });

    output.push({ name: `S${count++}`, count: count, children: words });

    return output;
  }
  parse_childs(input) {
    console.log(input);
  }

  parsePhrases(input, find) {
    let leftNode = { wordsConsumed: 0 };
    let rightNode = { wordsConsumed: 0 };
    let offset = 0;
    let S = { leftNode, rightNode };
    let rules = this.getNext_FromRule(find);
    for (let i = 0; i < rules.length; i++) {
      //  if (rules[i].opt1 == "NP") {
      leftNode = this.getNP(input, rules[i].opt1, offset);

      offset = leftNode?.wordsConsumed;
      if (leftNode.valid) {
        input.splice(0, leftNode.wordsConsumed);

        rightNode = this.getNP(input, rules[i].opt2, offset);
      }

      let S = { leftNode, rightNode };

      return S;
      // }
    }
  }

  getNP(input_obj, find, offset) {
    // get settings for particular POS
    // settings specific to POS for expected structure
    // e.g. NP expect to have   DT (JJ) [NN, NNS]
    // where round brackets indicate optionals
    // also settings include indication in which possiton optional expected
    // settig include MUST have elements e.g NP extected to cantain NN or NNS
    let settigs = this.getSettigsForPOS(find);

    let valid = true;
    let number_arr = [];
    let number;
    let output;
    let words = [];

    let err = "none";
    if (input_obj.length == 1 && Object.keys(input_obj[0]).length == 0) {
      let output = {};
      output.valid = false;
      output.wordsConsumed = 0;
      return output;
    }

    // for processing take only word array
    let input = input_obj;

    for (let i = 0; i < input.length; i++) {
      /// break if text longer then expected length of output
      if (i == settigs.expected.length) {
        break;
      }
      let curr_word = input[i];

      if (find == "VP") {
        // console.log(settigs.optional_Pos);
      }
      // check if word POS matches expected POS
      if (settigs.expected[i].includes(curr_word.POS)) {
        words.push(curr_word);
        number_arr.push(curr_word.number);
        continue;
      } else if (i == settigs.optional_Pos) {
        // special case for optinal words
        if (find == "VP") {
          let tempIN = input;
          tempIN.shift();

          let x = this.getNP(tempIN, settigs.optional[0]);
          words.push(x);

          valid = x.valid;
        } else {
          if (settigs?.expected[i + 1].includes(curr_word.POS)) {
            words.push(curr_word);
            number_arr.push(curr_word.number);
            break; /// BREAKE as it MUST be the last (if optional skipped )
          } else {
            valid = false;
          }
        }
      } else {
        valid = false;
      }
    }

    // posses to ensure that MUST contain POSes exists in output
    let posses = [];
    words.forEach((w) => {
      posses.push(w.POS);
    });

    if (!posses.some((e) => settigs.mustContain.includes(e))) {
      valid = false;
    }

    // filter out number "ANY", must left with a single
    // number elemtent(singular or pural), if there two
    // that mean that pular goes with singular therefore invalid
    number_arr = number_arr.filter((x) => x !== "ANY");
    if (number_arr.length > 1) {
      valid = false;
    } else {
      number = number_arr[0];
    }
    if (valid) {
      output = {
        words,
        valid,
        number,
      };
      input_obj = {};
      input_obj.children = words;
      input_obj.number = number;
      input_obj.valid = valid;
      input_obj.name = find;
      input_obj.wordsConsumed = words.length;
      output = input_obj;

      return output;
    } else {
      //console.log("invalid output from getNP");
      return { valid, err: err, wordsConsumed: 0 };
    }
  }

  getSettigsForPOS(pos) {
    switch (pos) {
      case "NP": // NP -> DT (JJ) [NN, NNS]
        return {
          expected: [["DT"], ["JJ"], ["NN", "NNS"]],
          optional_Pos: 1,
          optional: ["JJ"],
          mustContain: ["NN", "NNS"],
        };
      case "DT": // DT
        return {
          expected: [["DT"]],
          optional_Pos: 999, // if no special cases
          mustContain: ["DT"],
        };
      case "VP":
        return {
          expected: [["VB"], ["NP"]],
          optional_Pos: 1,
          optional: ["NP"],
          mustContain: ["VB"],
        };
      case "NNS":
        return {
          expected: [["NNS"]],
          optional_Pos: 999, // if no special cases
          mustContain: ["NNS"],
        };
      case "NN":
        return {
          expected: [["NN"]],
          optional_Pos: 999, // if no special cases
          mustContain: ["NN"],
        };
      case "VB":
        return {
          expected: [["VB"]],
          optional_Pos: 999, // if no special cases
          mustContain: ["VB"],
        };
    }

    return;
  }

  //=========================
  s_to_p(input) {
    // input is array of word objects
    // {word data}, {word data}...
    let inital_possible = [{ opt1: "DT" }, { opt1: "VB" }];
    let next_possible = inital_possible;
    let p = [];
    let words = [];

    // loop word array

    // individual word data

    for (let j = 0; j < input.length; j++) {
      // {word data}
      let word_pos = input[j].POS;
      let curr_word_obj = input[j];

      // get array of rules
      // start is current pos...
      for (let i = 0; i < next_possible.length; i++) {
        //{ start: 'DT', opt1: 'NN', opt2: '#' }
        //{ start: 'DT', opt1: 'JJ', opt2: '#' }
        let r = next_possible[i];

        // go over rules untill there last node (no more rules)
        if (next_possible.length == 1 && r.opt1 == "#") {
          /// if there no more
          let tag = this.tag_pharse(words);
          // array of words that belongs to single pharse
          //
          //[{word data}, {word data}..]

          let attr = {
            count: "singular DEMO",
          };

          p.push({ type: "P", name: tag, children: words, attributes: attr });
          next_possible = inital_possible;

          // put pharse obj in to array where children: contains array of word objets
          //[{type: 'P',name: 'NP',children: [ [Word data], [word data]... ],attributes: { count: 'singular DEMO' } }]
          words = [];
        } else if (word_pos == r.opt1) {
          // if not the end: put this word in to array and check for next
          words.push(curr_word_obj);
          next_possible = this.getNext_FromRule(word_pos);
        }
      }
    }
    let attr = {
      count: "singular DEMO",
    };
    // if not the end of rules but end of words just add what it has to an array (incoplete phrase)
    let tag = this.tag_pharse(words);
    p.push({ type: "P", name: tag, children: words, attributes: attr });

    return p;
  }

  all_s(input) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i].children.length > 0) {
        let x = this.s_to_p(input[i].children);
        input[i].children = x;

        output.push(input[i]);
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
    for (let i = 0; i < input.length; i++) {
      let curr_word = input[i].POS;
      if (curr_word == "DT" || curr_word == "NN" || curr_word == "NN")
        return "NP";
      if (curr_word == "VB") return "VP";
    }
    return "";
  }

  sObjToString(input) {
    let output = "[ ";
    input = input[0];
    output += `${input.name}  `;
    input["children"].forEach((e) => {
      output += `[_${e.name}_  `;
      e["children"].forEach((e) => {
        output += `[_${e.POS}_ ${e.name}] `;
      });
      output += ` ]`;
    });
    output = output + "]";
    return output;
  }

  toTrent(input) {
    let x = input;
    /*
 children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
    /*

    let x =[
      {
        name: "vg",
    
        children: [
          {
            name: "NP",
            children: [
              {
                name: "DET",
              },
              {
                name: "NN",
              },
            ],
          },
          {
            name: "VP",    
            children: [
              {
                name: "VB",
              },
            ],
          },
        ],
      },
    ]
*/
    return x;
  }
}
