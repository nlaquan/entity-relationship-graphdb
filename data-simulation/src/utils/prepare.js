const fs = require('fs');
const toLower = require('lodash/toLower');
const toUpper = require('lodash/toUpper');
const capitalize = require('lodash/capitalize');
const { createBaseFolder, createFolder } = require('./folder');
const { createHeaderFile, createHeaderFileForRel } = require('./headerfile');
const { writeToCSVWithoutHeader } = require('./misc');

function readConfig(configFilePath) {
  const stringData = fs.readFileSync(configFilePath, 'utf8');
  const { entities: eConfig, facts: factsConfig } = JSON.parse(stringData);

  const entities = standardLabel(eConfig);
  const facts = standardRel(factsConfig);

  const relMap = facts.reduce((acc, rel) => ({
    ...acc, [toLower(rel.type)]: { subject: toLower(rel.subject), object: toLower(rel.object) }
  }), {});

  return {
    entities, facts, relMap
  };
}

function standardLabel(entityConfig) {
  const numberOfEntitySorted = Object.entries(entityConfig).sort((e1, e2) => e1[1] - e2[1]);
  return numberOfEntitySorted.reduce((acc, e) => ({
    ...acc,
    [e[0]]: e[1]
  }), {});
}

function standardRel(relConfig) {
  const relStd = relConfig.map(rel => ({
    ...rel,
    type: toUpper(rel.type),
    subject: capitalize(rel.subject),
    object: capitalize(rel.object)
  }));

  return relStd.sort((rel1, rel2) => rel1.amount - rel2.amount);
}

function prepare(relMap, hierarchy, { entityRootFolder, entityFolderNames }, { relRootFolder, relFolderNames }) {
  createBaseFolder(hierarchy);
  createFolder(entityRootFolder, entityFolderNames);
  createFolder(relRootFolder, relFolderNames);

  relFolderNames.forEach(rel => {
    if (rel == "hasFact") {
      createHeaderFile(`${relRootFolder}/${rel}/hasFactHeader.csv`, [
        { id: "start", title: ':START_ID(News-ID)' },
        { id: "end", title: `:END_ID(Fact-ID)` },
        { id: "type", title: ':TYPE' }
      ]);
    } else {
      const file1 = `${relRootFolder}/${rel}/hasSubjectHeader.csv`;
      const file2 = `${relRootFolder}/${rel}/hasObjectHeader.csv`;
      const file3 = `${relRootFolder}/${rel}/hasTimeHeader.csv`;
      createHeaderFileForRel(relMap[rel].subject, file1);
      createHeaderFileForRel(relMap[rel].object, file2);
      createHeaderFileForRel("Time", file3);
    }
  });

  entityFolderNames.forEach(e => createHeaderFile(`${entityRootFolder}/${e}/${e}Header.csv`, [
    { id: "idSpace", title: `${e}Id:ID(${capitalize(e)}-ID)` },
    { id: "name", title: 'name' },
    { id: "description", title: 'description' },
    { id: "label", title: ':LABEL' }
  ]));

  createHeaderFile(`${entityRootFolder}/news/newsHeader.csv`, [
    { id: "newsId", title: 'newsId:ID(News-ID)' },
    { id: "link", title: 'link' },
    { id: "date", title: 'extractedDate:date' },
    { id: "label", title: ':LABEL' }
  ]);

  createHeaderFile(`${entityRootFolder}/fact/factHeader.csv`, [
    { id: "factId", title: 'factId:ID(Fact-ID)' },
    { id: "label", title: ':LABEL' }
  ]);

  createHeaderFile(`${entityRootFolder}/time/timeHeader.csv`, [
    { id: "timeId", title: 'timeId:ID(Time-ID)' },
    { id: "date", title: 'date:date' },
    { id: "label", title: ':LABEL' }
  ]);
}

async function saveTime(dates) {
  path = `import/entities/time/time-part.csv`;
  dataArr = dates.map((d, i) => ({
    'timeId:ID(Time-ID)': i,
    'date:date': d,
    ':LABEL': 'Time'
  }));

  await writeToCSVWithoutHeader(`time`, dataArr, path);
}

module.exports = {
  readConfig,
  standardLabel,
  standardRel,
  prepare,
  saveTime
}
