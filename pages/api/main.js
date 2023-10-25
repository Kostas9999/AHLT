import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "./session/session_config";
import { Words } from "./classes/Word";
import { Pos } from "./classes/Pos";
import { Rule } from "./classes/Rule";
const fs = require("fs");

export default withIronSessionApiRoute(main, ironOptions);

let lexicon;
let pos;
let rules;
async function main(req, res) {
  let data = req.body;

  if (data.type == "init") {
    load_lex();
    load_pos();
    load_rule();

    res.status(200).json({
      data: {
        pos: pos.pos,
        rules: rules.rules,
        lexicon: lexicon.words,
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
  //console.log(lexicon.words);
}

function load_pos() {
  let pos_str = fs.readFileSync("./pages/api/files/rules.txt", {
    encoding: "utf8",
    flag: "r",
  });

  pos = new Pos(pos_str);
  //  console.log(pos.pos);
}

function load_rule() {
  let rules_str = fs.readFileSync("./pages/api/files/rules.txt", {
    encoding: "utf8",
    flag: "r",
  });

  rules = new Rule(rules_str);
  console.log(rules.rules);
}
