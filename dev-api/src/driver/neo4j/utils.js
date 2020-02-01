function isEmptyArray(array) {
  if (array && array.length === 0) {
    return true;
  }

  return false;
}

const QUARTERS = {
  1: [1, 2, 3],
  2: [4, 5, 6],
  3: [7, 8, 9],
  4: [10, 11, 12]
};

function convertToQueryString(ids) {
  if (ids.length === 1) {
    return `['${ids[0]}']`
  }

  const idsString = ids.reduce((acc, id, i) => {
    if (i === ids.length - 1) {
      acc += `'${id}']`;
    } else if (i === 0) {
      acc += `['${id}',`
    } else {
      acc += `'${id}',`;
    }

    return acc;
  }, '');

  return idsString;
}

function convertToQueryStringLabels(labels) {
  if (labels.length === 1) {
    return `[['${labels[0]}']]`
  }

  let _labels = '[';
  labels.forEach((l, i) => {
    if (i !== labels.length - 1) {
      _labels += `['${l}'],`;
    } else {
      _labels += `['${l}']]`;
    }
  });
  return _labels;
}

/**
 * https://github.com/neo4j/neo4j-javascript-driver/blob/4.0/types/integer.d.ts
 * @param {*} neo4jInteger
 * @returns int | string
 */

const getInt = (neo4jInteger) => {
  if (neo4jInteger.inSafeRange()) {
    return neo4jInteger.toNumber();
  }

  return neo4jInteger.toString();
}

module.exports = {
  QUARTERS,
  isEmptyArray,
  convertToQueryString,
  convertToQueryStringLabels,
  getInt
}
