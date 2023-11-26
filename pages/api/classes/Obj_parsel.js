import { Children } from "react";
import { NP } from "./NP";
import { VP } from "./VP";

export class Obj_parsel {
  constructor(lexicon, pos, rules) {
    this._lexicon = lexicon;
    this._pos = pos;
    this._rules = rules;
  }

  // take array of words and verify against dictionary
  words_to_obj_arr(input) {
    let output = [];
    // loop over array
    input.forEach((e) => {
      let lex_output = {};
      // check existance of word in a dictionary
      this._lexicon.forEach((lex) => {
        // if word exists, add it to an output
        if (lex.name.toLowerCase() == e.toLowerCase()) {
          lex_output = lex;
        }
      });
      output.push(lex_output);
    });
    return output;
  }

  parsePhrases(input, find) {
    let leftNode = { valid: false, wordsConsumed: 0 };
    let rightNode = { valid: false, wordsConsumed: 0 };
    let S = { leftNode, rightNode };

    // get rules to see what kind of notes expected
    let rules = this.solveExpected(find);

    // send input and what Phrase POS
    // receive phrase for that POS
    leftNode = this.getP(input, rules.first[0]);

    //offset = leftNode?.wordsConsumed;
    if (leftNode.valid) {
      // remove words that was in first Phrase
      input.splice(0, leftNode.wordsConsumed);
      // send input and what Phrase POS
      // receive phrase for that POS
      rightNode = this.getP(input, rules.last[0]);
    }

    let valid = rightNode.number == leftNode.number;
    S = { leftNode, rightNode, valid };

    return S;
  }

  //  find Phrase by POS
  getP(input_obj, find, offset) {
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

    // check if input exist
    let err = "none";
    if (input_obj.length == 1 && Object.keys(input_obj[0]).length == 0) {
      let output = {};
      output.valid = false;
      output.wordsConsumed = 0;
      return output;
    }

    let input = input_obj;

    for (let i = 0; i < input.length; i++) {
      /// break if text longer then expected length of output
      if (i == settigs.expected.length) {
        break;
      }
      let curr_word = input[i];

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

          let x = this.getP(tempIN, settigs.optional[0]);
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
    // filter dublicates
    let number_uniq = [...new Set(number_arr)];

    // if still have more than one number then its not valid
    // else tag parse to this number
    if (number_uniq.length > 1) {
      valid = false;
    } else {
      number = number_uniq[0];
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
      input_obj.POS = find;
      input_obj.wordsConsumed = words.length;
      output = input_obj;

      return output;
    } else {
      return { valid, err: err, wordsConsumed: 0 };
    }
  }
  getSettigsForPOS(pos) {
    let expectByRules = this.solveExpected(pos);
    switch (pos) {
      case "NP": // NP -> DT (JJ) [NN, NNS]
        return {
          expected: [expectByRules.first, ["JJ"], expectByRules.last],
          optional_Pos: 1,
          optional: ["JJ"],
          mustContain: ["NN", "NNS"],
        };
      case "VP":
        return {
          expected: [expectByRules.first, expectByRules.last],
          optional_Pos: 1,
          optional: ["NP"],
          mustContain: ["VB"],
        };
      default:
        return {
          expected: [[pos]],
          mustContain: [pos],
        };
    }
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
    let number;
    let leftNode = input.leftNode;
    let rightNode = input.rightNode;

    if (leftNode.valid) {
      number = leftNode.number;
      let childrens = leftNode.children;
      for (let i = 0; i < childrens.length; i++) {
        let e = childrens[i];
        if (e.type == "W") {
          //  let rules = this.getNext_FromRule(e.POS);

          return;
        } else {
        }
      }
    }
    return [{ name: "S", children: [leftNode, rightNode] }];
  }

  processNP(input_all) {
    let input = input_all.children;
    let np_obj = new NP();

    if (input_all.valid) {
      np_obj._number = input_all.number;
    }

    for (let i = 0; i < input?.length; i++) {
      if (input[i].POS == "DT") {
        np_obj._dt = input[i];
      }
      if (input[i].POS == "NNS" || input[i].POS == "NN") {
        np_obj._valid = true;
        np_obj._noun = input[i];
      }
      if (input[i].POS == "JJ") {
        np_obj._jj = input[i];
      }
    }

    return np_obj;
  }

  processVP(input_all) {
    let input = input_all.children;
    let vp_obj = new VP();

    for (let i = 0; i < input?.length; i++) {
      if (input[i].POS == "VB") {
        vp_obj._verb = input[i];
        vp_obj._number = input[i].number;
        vp_obj._valid = true;
      }
      if (input[i].POS == "NP") {
        let np = this.processNP(input[i]);
        vp_obj._object = np;
      }
    }

    if (vp_obj._object) {
      let vp_number = vp_obj._number;
      let vp_obj_number = vp_obj._object._number;
      let number_OK = vp_obj_number == vp_number;
      vp_obj._valid = number_OK && vp_obj._valid;
    }

    return vp_obj;
  }

  solveExpected(pos) {
    let first = [];
    let last = [];

    this._rules.forEach((e) => {
      if (e.start == pos) {
        first.push(e.opt1);
        last.push(e.opt2);
      }
    });
    first = [...new Set(first)];
    last = [...new Set(last)];
    return { first, last };
  }
  /*
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
  */
  sObjToString(s) {
    let output = "[S  ";
    output += ``;

    Object.keys(s).forEach((e) => {
      let curr_ph = s[e];
      output += `\n[_${s[e]._POS}_  `;

      if (curr_ph._POS == "NP") {
        if (this.ifDef(curr_ph["_dt"]?.POS)) {
          output += `[  _${curr_ph["_dt"]?.POS}_ ${curr_ph["_dt"]?.name} ]`;
        }
        if (this.ifDef(curr_ph["_jj"]?.POS)) {
          output += `[  _${curr_ph["_jj"]?.POS}_ ${curr_ph["_jj"]?.name} ]`;
        }
        if (this.ifDef(curr_ph["_noun"]?.POS)) {
          output += `[  _${curr_ph["_noun"]?.POS}_ ${curr_ph["_noun"]?.name} ]`;
        }
        output += "] ";
      }
      if (curr_ph._POS == "VP") {
        if (this.ifDef(curr_ph["_verb"]?.POS)) {
          output += `[  _${curr_ph["_verb"]?.POS}_ ${curr_ph["_verb"]?.name} ]`;
        }
        if (this.ifDef(curr_ph["_object"])) {
          let curr = curr_ph["_object"];
          output += `[ _${curr.POS}_  `;

          if (this.ifDef(curr["_dt"]?.POS)) {
            output += `[  _${curr["_dt"]?.POS}_ ${curr["_dt"]?.name} ]`;
          }
          if (this.ifDef(curr["_jj"]?.POS)) {
            output += `[  _${curr["_jj"]?.POS}_ ${curr["_jj"]?.name} ]`;
          }
          if (this.ifDef(curr["_noun"]?.POS)) {
            output += `[  _${curr["_noun"]?.POS}_ ${curr["_noun"]?.name} ]`;
          }
          output += "] ";
        }
      }
    });
    output += ` ]`;
    return output;
  }
  ifDef(input) {
    if (input) return input;
    else return "";
  }
}
