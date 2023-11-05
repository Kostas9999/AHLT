export default function toTrent(x) {
  let nounP = x._noun_Phrase;
  let verbP = x._verb_Phrase;
  let np = processNP(nounP);
  let vp = processVP(verbP);

  let children = [];

  if (nounP.valid) {
    children.push(np);
  }
  if (verbP.valid) {
    children.push(vp);
  }

  return children;
}

function processVP(verbP) {
  let vpChild = [];

  vpChild.push({
    name: verbP._verb?.name,
    attributes: {
      POS: verbP._verb?.POS,
      Number: verbP._verb?.number,
    },
  });

  if (verbP._object) {
    let np = processNP(verbP._object);

    vpChild.push(np);
  }
  let vp = {
    name: verbP._POS,
    attributes: {
      number: verbP.number,
    },
    children: vpChild,
  };

  return vp;
}
function processNP(nounP) {
  let npchilds = [];
  if (nounP._dt) {
    npchilds.push({
      name: nounP._dt?.name,
      attributes: {
        POS: nounP?._dt?.POS,
        Number: nounP?._dt?.number,
      },
    });
  }
  if (nounP._jj) {
    npchilds.push({
      name: nounP._jj?.name,
      attributes: {
        POS: nounP?._jj?.POS,
        Number: nounP?._jj?.number,
      },
    });
  }

  if (nounP._noun) {
    npchilds.push({
      name: nounP._noun?.name,
      attributes: {
        POS: nounP?._noun?.POS,
        Number: nounP?._noun?.number,
      },
    });
  }
  let np = {
    name: nounP._POS,
    attributes: {
      number: nounP.number,
    },

    children: npchilds,
  };

  return np;
}

export { toTrent };
