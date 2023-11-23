
export class Tester {
  constructor(lexicon, pos, rules) {
    this._lexicon = lexicon;
    this._pos = pos;
    this._rules = rules;
  }

  test_dict(input_obj, input_arr){
    let output = {no_dict:[], no_POS:[]};
    input_obj.forEach((inp, i) => {
      if(!inp.name){output.no_dict.push(input_arr[i])}    
      if (!(this._pos.includes(inp.POS))){
        output.no_POS.push(input_arr[i])
       }

    });

    return output
  }

  err_msg(input){
    let msg = ""
    if (input.no_dict.length !=0){
      msg += `Words not in Dictionary: ${input.no_dict.join(", ")}\n`
    }
    if (input.no_POS.length !=0){
      msg += `Words not in POS: ${input.no_POS.join(", ")}\n`
    }
     

      return msg
  }
}
