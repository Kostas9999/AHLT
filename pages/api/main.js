import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "./session/session_config";
import { Words } from "./classes/Word";
import { Pos } from "./classes/Pos";
import { Rule } from "./classes/Rule";
import { Tester } from "./classes/Tester";
import { Obj_parsel } from "./classes/Obj_parsel";
import { TreePlay } from "./classes/treePlay";
import { Sentence } from "./classes/Sentence";
import { NP } from "./classes/NP";
import { toTrent } from "./classes/TreeToTrent";
const fs = require("fs");

export default withIronSessionApiRoute(main, ironOptions);

let lexicon;
let pos;
let rules;
let parsel;
let test;
let obj_parsel;
async function main(req, res) {
  let data = req.body;

  if (data.type == "init") {
    load_lex();
    load_pos();
    load_rule();

    // parsel = new Parsel(lexicon.lexicon, pos.pos, rules.rules);
    obj_parsel = new Obj_parsel(lexicon.lexicon, pos.pos, rules.rules);
    test = new Tester(lexicon.lexicon, pos.pos, rules.rules);

    res.status(200).json({
      data: {
        pos: pos.pos,
        rules: rules.rules,
        lexicon: lexicon.lexicon,
      },
    });
  }

  if (data.type == "parse") {
    let isDict = true;
    let isPOS = true;
    let isPnumber = false;
    let input = data.text;

    // make an word array from user input
    let input_array = input.split(" ");
    // check against dictionary, existing word convert to an word object (from dictionary)
    let words_to_obj_arr = obj_parsel.words_to_obj_arr(input_array);

    // returns array of indexes for words that not found in dictionary
    let validate_POS_DICT = test.test_dict(words_to_obj_arr, input_array);
    let err_msg = test.err_msg(validate_POS_DICT);

    let strip_P = obj_parsel.parsePhrases(words_to_obj_arr, "S");

    let np_raw = strip_P.leftNode;
    let vp_raw = strip_P.rightNode;

    let np = obj_parsel.processNP(np_raw);
    let vp = obj_parsel.processVP(vp_raw);

    let np_Number_valid = test.test_NP_Number(np);
    let vp_Number_valid = test.test_VP_Number(vp);
    vp_Number_valid ? "" : (err_msg += `VPhrase number missmatch! `);
    np_Number_valid ? "" : (err_msg += `NPhrase number missmatch! `);

    if (np._number && vp._number && np._number !== vp._number) {
      err_msg += `Phrase number missmatch!\nNP: ${np._number}\nVP: ${vp._number}  `;
      isPnumber = false;
    } else {
      isPnumber = true;
    }

    let s = new Sentence(np, vp);

    let s_obj_str = obj_parsel.sObjToString(s); // string to display

    let trent_data = toTrent(s);
    let output = s_obj_str;

    isPOS = validate_POS_DICT.no_POS.length == 0;
    isDict = validate_POS_DICT.no_dict.length == 0;

    let isValid =
      isPOS && isDict && isPnumber && np_Number_valid && vp_Number_valid;

    res.status(200).json({
      data: {
        ok: true,
        text: output,
        trent_data,
        err_msg,
        isValid,
      },
    });
  }

  res.status(200).json({ data: { ok: false } });
}

function load_lex() {
  let lex_str = fs.readFileSync("./pages/api/files/lexicon.txt", {
    encoding: "utf8",
    flag: "r",
  });
  lexicon = new Words(lex_str);
}

function load_pos() {
  let pos_str = fs.readFileSync("./pages/api/files/rules.txt", {
    encoding: "utf8",
    flag: "r",
  });

  pos = new Pos(pos_str);
}

function load_rule() {
  let rules_str = fs.readFileSync("./pages/api/files/rules.txt", {
    encoding: "utf8",
    flag: "r",
  });

  rules = new Rule(rules_str);
}
