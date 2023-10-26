import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "./session/session_config";
import { Words } from "./classes/Word";
import { Pos } from "./classes/Pos";
import { Rule } from "./classes/Rule";
import { Parsel } from "./classes/Parsel";
const fs = require("fs");

export default withIronSessionApiRoute(main, ironOptions);

let lexicon;
let pos;
let rules;
let parsel;
async function main(req, res) {
  let data = req.body;

  if (data.type == "init") {
    load_lex();
    load_pos();
    load_rule();

    parsel = new Parsel(lexicon.lexicon, pos.pos, rules.rules);

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
    let input = data.text;
    let parse_output = parsel.parse(input);

    isDictionary = parsel.validate_dict(parse_output);
   
    res.status(200).json({
      data: {
        ok: true,
        text: parse_output,
        isDictionary,
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
