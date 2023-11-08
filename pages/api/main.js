import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "./session/session_config";
import { Words } from "./classes/Word";
import { Pos } from "./classes/Pos";
import { Rule } from "./classes/Rule";
//import { Parsel } from "./classes/Parsel";
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
let obj_parsel;
async function main(req, res) {
  let data = req.body;

  if (data.type == "init") {
    load_lex();
    load_pos();
    load_rule();

    // parsel = new Parsel(lexicon.lexicon, pos.pos, rules.rules);
    obj_parsel = new Obj_parsel(lexicon.lexicon, pos.pos, rules.rules);

    res.status(200).json({
      data: {
        pos: pos.pos,
        rules: rules.rules,
        lexicon: lexicon.lexicon,
      },
    });
  }

  if (data.type == "parse") {
    let isDictionary = true;
    let isPOS = true;
    let input = data.text;

    // creates word objects from string
    // let word_to_obj = obj_parsel.word_to_struc(input);

    let words_to_obj_arr = obj_parsel.words_to_obj_arr(input);

    /*
    [
  {
    type: 'W',
    name: 'the',
    POS: 'DT',
    number: 'ANY',
    root: 'THE\r',
    attributes: { POS: 'DT', Number: 'ANY' }
  },
  {
    type: 'W',
    name: 'dog',
    POS: 'NN',
    number: 'singular',
    root: 'DOG\r',
    attributes: { POS: 'NN', Number: 'singular' }
  }
]*/

    // let obj_arr_to_S_arr = obj_parsel.obj_arr_to_S_arr(words_to_obj_arr); //[ { name: 'S1', count: 2, children: [ [word obj], [word obj] ] } ]

    //let all_s_obj = obj_parsel.all_s(obj_arr_to_S_arr); // [ { name: 'S1', count: 2, children: [ [phrase obj], [phrase obj] ] } ]
    //
    let strip_P = obj_parsel.parsePhrases(words_to_obj_arr, "S");
   
    let np_raw = strip_P.leftNode;
    let vp_raw = strip_P.rightNode;

    let np = obj_parsel.processNP(np_raw);
    let vp = obj_parsel.processVP(vp_raw);

    let s = new Sentence(np, vp);
    s.numberValid();

    let parse_childs = obj_parsel.parse_childs(strip_P);

    let s_obj_str = obj_parsel.sObjToString(s); // string to display

    let visual_tree = toTrent(s);
    let output = s_obj_str;

    res.status(200).json({
      data: {
        ok: true,
        text: output, //rules_valid_word[0],
        trent_data: visual_tree,
        // pharse_obj,
        //  isDictionary,
        //  isPOS,
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
