const fs = require('fs');
const toLower = require('lodash/toLower');
const toUpper = require('lodash/toUpper');
const lowerCase = require('lodash/lowerCase');
const capitalize = require('lodash/capitalize');
const { createBaseFolder, createFolder } = require('./folder');
const { createHeaderFile, createHeaderFileForRel } = require('./headerfile');
const { writeToCSVWithoutHeader } = require('./misc');
const {
  LABEL_HAS_MANY_NAME,
  DEFAULT_FOLDER_LIST,
  DEFAULT_REL_LIST
} = require('../config');

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
    [capitalize(e[0])]: e[1]
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
  createFolder(entityRootFolder, [...entityFolderNames, ...DEFAULT_FOLDER_LIST]);
  createFolder(relRootFolder, [...relFolderNames, ...DEFAULT_REL_LIST]);
  createFolder("import/rels/has_name", LABEL_HAS_MANY_NAME.map(label => toLower(label)));

  DEFAULT_REL_LIST.forEach(f => {
    if (f === "has_fact") {
      createHeaderFile(`${relRootFolder}/${f}/has_fact_header.csv`, [
        { id: "start", title: ':START_ID(News-ID)' },
        { id: "end", title: `:END_ID(Fact-ID)` },
        { id: "type", title: ':TYPE' }
      ]);
    }
  });

  relFolderNames.forEach(rel => {
    const file1 = `${relRootFolder}/${rel}/has_subject_header.csv`;
    const file2 = `${relRootFolder}/${rel}/has_object_header.csv`;
    createHeaderFileForRel(relMap[rel].subject, file1);
    createHeaderFileForRel(relMap[rel].object, file2);
  });

  entityFolderNames.forEach(e => {
    if (!DEFAULT_FOLDER_LIST.includes(e)) {
      createHeaderFile(`${entityRootFolder}/${e}/${toLower(e)}_header.csv`, [
        { id: "idSpace", title: `${e}Id:ID(${capitalize(e)}-ID)` },
        { id: "name", title: 'name:string[]' },
        { id: "description", title: 'description:string[]' },
        { id: "label", title: ':LABEL' }
      ])
    }
  });

  createHeaderFile(`${entityRootFolder}/News/news_header.csv`, [
    { id: "newsId", title: 'newsId:ID(News-ID)' },
    { id: "link", title: 'link' },
    { id: "date", title: 'extractedDate:date' },
    { id: "label", title: ':LABEL' }
  ]);

  createHeaderFile(`${entityRootFolder}/Fact/fact_header.csv`, [
    { id: "factId", title: 'factId:ID(Fact-ID)' },
    { id: "date", title: 'date:date' },
    { id: "label", title: ':LABEL' }
  ]);

  createHeaderFile(`${entityRootFolder}/Name/name_header.csv`, [
    { id: "nameId", title: 'nameId:ID(Name-ID)' },
    { id: "value", title: 'value' },
    { id: "label", title: ':LABEL' }
  ]);

  entityFolderNames.forEach(f => {
    if (LABEL_HAS_MANY_NAME.includes(f)) {
      createHeaderFile(`${relRootFolder}/has_name/${lowerCase(f)}/has_name_header.csv`, [
        { id: "start", title: `:START_ID(${capitalize(f)}-ID)` },
        { id: "end", title: `:END_ID(Name-ID)` },
        { id: "type", title: ':TYPE' }
      ])
    }
  });
}

module.exports = {
  readConfig,
  standardLabel,
  standardRel,
  prepare,
  saveTime,
}
