export class Tester {
  constructor(lexicon, pos, rules) {
    this._lexicon = lexicon;
    this._pos = pos;
    this._rules = rules;
  }

  test_dict(input_obj, input_arr) {
    let output = { no_dict: [], no_POS: [] };
    input_obj.forEach((inp, i) => {
      if (!inp.name) {
        output.no_dict.push(input_arr[i]);
      }
      if (!this._pos.includes(inp.POS)) {
        output.no_POS.push(input_arr[i]);
      }
    });

    return output;
  }

  test_NP_Number(input) {
    if (input?._dt?.number == "ANY") {
      return true;
    } else if (input?._dt?.number === input?._noun?.number) {
      return true;
    }
    return false;
  }

  err_msg(input) {
    let msg = "";
    if (input.no_dict.length != 0) {
      msg += `Words not in dictionary: ${input.no_dict.join(", ")}\n`;
    }
    if (input.no_POS.length != 0) {
      msg += `Words not in POS: ${input.no_POS.join(", ")}\n`;
    }
    return msg;
  }
}
