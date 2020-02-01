const { Node } = require('neo4j-driver/lib/v1/graph-types.js')

function getData(record, keys) {
  keys.forEach(key => record.get(`${key}`));
  const result = keys.reduce((acc, key) => ({ ...acc, [key]: record.get(`${key}`) }), {});
  return result;
}

function format(record) {
  if (record instanceof Node) {
    return {
      meta: {
        type: "Node",
        label: record.labels,
        id: record.identity.low
      },
      properties: record.properties
    }
  }

  return {
    meta: {
      type: "Relationship",
      relationshipType: record.type,
      id: record.identity.low,
      startId: record.start.low,
      endId: record.end.low
    },
    properties: record.properties
  }
}

function formatEntity(record) {
  return {
    label: record.labels,
    id: record.identity.low,
    ...record.properties
  }
}

function collectAndRemoveDuplicate(records, keys) {
  const resultMap = {};
  let collection = null;
  records.forEach(r => {
    collection = Object.values(getData(r, keys));
    collection.forEach(d => {
      if (!resultMap[d.identity]) {
        resultMap[d.identity] = d;
      }
    })
  });

  return Object.values(resultMap);
}

function convertLabels(labelsString) {
  const labels = labelsString.split(',');
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

function seperate(string) {
  return string.split(',');
}

module.exports = {
  seperate,
  getData,
  format,
  formatEntity,
  convertLabels,
  collectAndRemoveDuplicate
}
