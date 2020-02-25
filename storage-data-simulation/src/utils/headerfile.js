const capitalize = require('lodash/capitalize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function createHeaderFile(path, header) {
  const csvWriter = createCsvWriter({
    path,
    header
  });

  csvWriter
    .writeRecords([])
    .then();
}

function createHeaderFileForRel(object, path) {
  const csvWriter = createCsvWriter({
    path,
    header: [
      { id: "start", title: ':START_ID(Fact-ID)' },
      { id: "end", title: `:END_ID(${capitalize(object)}-ID)` },
      { id: "type", title: ':TYPE' }
    ]
  });

  csvWriter
    .writeRecords([])
    .then();
}

module.exports = {
  createHeaderFile,
  createHeaderFileForRel
}
