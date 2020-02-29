const fs = require('fs');
const {
  LABEL_HAS_MANY_NAME,
  DEFAULT_FOLDER_LIST,
  DEFAULT_REL_LIST
} = require('../config');
const toLower = require('lodash/toLower');
const capitalize = require('lodash/capitalize');

function createScript(entities, relationships) {
  var stream = fs.createWriteStream("import/script.sh", { encoding: "utf8" });
  const _entities = [...entities, ...DEFAULT_FOLDER_LIST]
  const _relationships = [...relationships, ...DEFAULT_REL_LIST]
  stream.once('open', function (fd) {
    stream.write(`./bin/neo4j-admin import \\\n`);
    _entities.forEach(label => {
      if (label !== "Name") {
        const capitalLabel = capitalize(label);
        const lowerLabel = toLower(label);
        stream.write(`--nodes "import/entities/${capitalLabel}/${lowerLabel}_header.csv,import/entities/${capitalLabel}/${lowerLabel}_part.*" \\\n`);
      }
    });
    stream.write(`--nodes "import/entities/Name/name_header.csv,import/entities/Name/.*_name_part.*" \\\n`);

    _relationships.forEach(type => {
      if (type === "has_fact") {
        stream.write(`--relationships "import/rels/has_fact/has_fact_header.csv,import/rels/has_fact/has_fact_part.*" \\\n`);
      } else if (type === "has_name") {
        entities.map(e => {
          if (LABEL_HAS_MANY_NAME.includes(e)) {
            const f = toLower(e);
            stream.write(`--relationships "import/rels/has_name/${f}/has_name_header.csv,import/rels/has_name/${f}/has_name_part.*" \\\n`);
          }
        })
      } else {
        const folder = toLower(type);
        stream.write(`--relationships "import/rels/${folder}/has_subject_header.csv,import/rels/${folder}/has_subject_part.*" \\\n`);
        stream.write(`--relationships "import/rels/${folder}/has_object_header.csv,import/rels/${folder}/has_object_part.*" \\\n`);
      }
    });

    stream.end();
  });
}

module.exports = {
  createScript
}
