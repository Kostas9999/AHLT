import {TreeNode} from './TreeNode'
import { Words } from "./Word";
import {main } from "../main"
import { Rule } from "./Rule";
const fs = require("fs");
let lexicon;
let r;
let root = {POS:"S"}
export class TreePlay {
    constructor(){

    }
  


run(){
    this.load_lex()
    this.load_rule() 

      let words = lexicon.element
      let rules = r.element
      console.log(words)

      for(let i = 0;  i < rules.length; i++){
        if(root.POS == "S")
        console.log(rules[i])
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

