const fs = require('fs');

function createScript(entities, relationships) {
  var stream = fs.createWriteStream("import/script.sh", { encoding: "utf8" });
  stream.once('open', function (fd) {
    stream.write(`./bin/neo4j-admin import \\ \n`);
    entities.forEach(label => {
      stream.write(` --nodes "import/entities/${label}/${label}Header.csv,import/entities/${label}/${label}-part.*" \\ \n`);
    });

    relationships.forEach(type => {
      if (type === "hasFact") {
        stream.write(` --relationships "import/rels/hasFact/hasFactHeader.csv,import/rels/hasFact/hasFact-part.*" \\ \n`);
      } else {
        stream.write(` --relationships "import/rels/${type}/hasSubjectHeader.csv,import/rels/${type}/hasSubject-part.*" \\ \n`);
        stream.write(` --relationships "import/rels/${type}/hasObjectHeader.csv,import/rels/${type}/hasObject-part.*" \\ \n`);
        stream.write(` --relationships "import/rels/${type}/hasTimeHeader.csv,import/rels/${type}/hasTime-part.*" \\ \n`);
      }
    });

    stream.end();
  });
}

module.exports = {
  createScript
}
