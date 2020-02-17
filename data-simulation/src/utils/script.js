const fs = require('fs');
const { LABEL_HAS_MANY_NAME } = require('../config');
const toLower = require('lodash/toLower');

function createScript(entities, relationships) {
  var stream = fs.createWriteStream("import/script.sh", { encoding: "utf8" });
  stream.once('open', function (fd) {
    stream.write(`./bin/neo4j-admin import \\ \n`);
    entities.forEach(label => {
      stream.write(` --nodes "import/entities/${label}/${label}Header.csv,import/entities/${label}/${label}-part.*" \\ \n`);
    });
    stream.write(` --nodes "import/entities/name/nameHeader.csv,import/entities/name/.*-hasName-part.*" \\ \n`);

    relationships.forEach(type => {
      if (type === "hasFact") {
        stream.write(` --relationships "import/rels/hasFact/hasFactHeader.csv,import/rels/hasFact/hasFact-part.*" \\ \n`);
      } else if (type === "hasName") {
        entities.map(e => {
          if (LABEL_HAS_MANY_NAME.includes(e)) {
            const f = toLower(e);
            stream.write(` --relationships "import/rels/hasName/${f}/hasNameHeader.csv,import/rels/hasName/${f}/hasName-part.*" \\ \n`);
          }
        })
      } else {
        const folder = toLower(type);
        stream.write(` --relationships "import/rels/${folder}/hasSubjectHeader.csv,import/rels/${folder}/hasSubject-part.*" \\ \n`);
        stream.write(` --relationships "import/rels/${folder}/hasObjectHeader.csv,import/rels/${folder}/hasObject-part.*" \\ \n`);
        stream.write(` --relationships "import/rels/${folder}/hasTimeHeader.csv,import/rels/${folder}/hasTime-part.*" \\ \n`);
      }
    });

    stream.end();
  });
}

module.exports = {
  createScript
}
