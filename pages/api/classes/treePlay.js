import { TreeNode } from "./TreeNode";
import { Words } from "./Word";
import { main } from "../main";
import { Rule } from "./Rule";
const fs = require("fs");
let lexicon;
let r;
let root = new TreeNode("S", null, null);
export class TreePlay {
  constructor() {}

  run() {
    this.load_lex();
    this.load_rule();

    let words = lexicon.element;
    let rules = r.element;

    traverse(root, null, null);

    function traverse(root, temp, temp1) {
    
      for (let i = 0; i < rules.length; i++) {
        if (root.node == rules[i].start) {
          root.leftNode = rules[i].opt1;
          root.rightNode = rules[i].opt2;
        }
      }

      if (typeof root.leftNode != undefined) {
        let curr_node = root.leftNode;
       
        // /traverse(new TreeNode(curr_node));
      }
      /*
      for (let i = 0; i < rules.length; i++) {
        // console.log(root.node);
        if (root.node.POS == rules[i].start) {
          
          root.node.leftNode = rules[i].opt1;
          root.node.rightNode = rules[i].opt2;
          console.log(root.node);
        }
        
      }
      */
    }
  }

  load_rule() {
    let rules_str = fs.readFileSync("./pages/api/files/rules.txt", {
      encoding: "utf8",
      flag: "r",
    });

    r = new Rule(rules_str);
  }

  load_lex() {
    let lex_str = fs.readFileSync("./pages/api/files/lexicon.txt", {
      encoding: "utf8",
      flag: "r",
    });
    lexicon = new Words(lex_str);
  }
}
