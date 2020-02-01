const { getData, format, collectAndRemoveDuplicate } = require('../../../../api/utils');
const { capitalize } = require('lodash');
const removeEmptyLines = require("remove-blank-lines");

// get entity and relationship from a news or list of news
const news = driver => (links) => {
  const session = driver.session();
  let queryString = '';

  if (links.length === 1) {
    queryString =
      `match (n:News {link: '${links[0]}'})-[r1]->(f)-[r2]->(o) return n, r1, f, r2, o`
  } else {
    const linksString = links.reduce((acc, id, i) => {
      if (i === ids.length - 1) {
        acc += `'${id}']`;
      } else if (i === 0) {
        acc += `['${id}',`
      } else {
        acc += `'${id}',`;
      }

      return acc;
    }, '');

    queryString =
      `match (n:News)-[r1]->(f)-[r2]->(o)
      where n.link in ${linksString}
      return n, r1, f, r2, o`;
  }

  console.log('query', queryString);

  const keys = ['n', 'r1', 'f', 'r2', 'o'];

  return session.run(queryString)
    .then(result => {
      session.close();
      const records = collectAndRemoveDuplicate(result.records, keys);
      const dataReturned = records.map(record => format(record));
      return dataReturned;
    }).catch(err => {
      console.log('err', err);
      return { response: false }
    })
};

// get article has Entity and Relationship
const newsHasEntityAndRelationship = driver => ({ sId, rel, oId }) => {
  const session = driver.session();
  const queryString =
    `match (s)`
    + `<-[:HAS_SUBJECT_IN_${rel}]-(f)`
    + `-[:HAS_OBJECT_IN_${rel}]->(o)
      where ID(s) = ${sId} and ID(o) = ${oId}
      with f
      match (f)<--(n:News)
      return n as news`;

  return session.run(queryString)
    .then(result => {
      session.close();
      const dataReturned = result.records.map(record => format(record.get("news")));
      return dataReturned;
    }).catch(err => {
      console.log('err', err);
      return { response: false }
    })
}

// const _news = {
//   extractedDate: '2019/10/11',
//   date: '2019/10/10',
//   entities: [{
//     _id: 0,
//     identity: '1',
//     label: 'Person',
//     name: 'Obama',
//     description: 'description'
//   }, {
//     _id: 1,
//     // identity: '2',
//     label: 'Person',
//     name: 'NXP',
//     description: 'Chu tich nuoc Viet Nam',
//   }],
//   rels: [{
//     relationship: 'meet',
//     subjectId: 0,
//     objectId: 1
//   }, {
//     relationship: 'meet',
//     subjectId: 1,
//     objectId: 0,
//   }]
// }

const createNews = driver => async (jsonData) => {
  const session = driver.session();
  const { extractedDate, link, entities, rels, } = jsonData;

  if (entities == undefined || entities.length == 0) {
    throw "entities field must be an array"
  }

  if (rels == undefined || rels.length == 0) {
    throw "rels field must be an array"
  }

  const entityMap = entities.reduce((acc, v, i) => acc.set(v._id, i), new Map());

  const partialQueryStringForNews = rels.reduce((acc, _, i) =>
    `${acc}
      create (n)-[:HAS_FACT]->(f${i})`
    , '');

  const partialQueryStringForEntities = entities.reduce((acc, e, i) => {
    if (e.identity) {
      return `${acc}
      match (e${i}:${e.label}) where ID(e${i})=${e.identity}`
    }

    if (e.label === "Time") {
      const date = e.time.split('-');
      return `${acc}
      merge (e${i}:Time {date: date({year: ${date[0]}, month: ${date[1]}, day: ${date[2]}})})`;
    }

    return `${acc}
      create (e${i}:${e.label} {name: '${e.name}', description: '${e.description}'})`
  }, '');

  const partialQueryStringForFact = rels.reduce((acc, _, i) =>
    `${acc}
      create (f${i}:Fact)`
    , '');

  const partialQueryStringForRel = rels.reduce((acc, r, i) => {
    const rel = r.relationship.toUpperCase();
    const query =
      `${acc}
      create (f${i})-[:HAS_SUBJECT_IN_${rel}]->(e${entityMap.get(r.subjectId)})
      create (f${i})-[:HAS_OBJECT_IN_${rel}]->(e${entityMap.get(r.objectId)})
      create (f${i})-[:HAS_TIME]->(e${entityMap.get(r.timeId)})
      `;
    return query;
  }, '');

  const queryString =
    removeEmptyLines(`create (n:News {link: '${link}', extractedDate: '${extractedDate}'}) with n
    ${partialQueryStringForEntities}
    ${partialQueryStringForFact}
    ${partialQueryStringForNews}
    ${partialQueryStringForRel}`);

  return session.run(queryString)
    .then(result => {
      session.close();
      return { response: true }
    }).catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const importFile = driver => async (jsonArray) => {
  const session = driver.session();
  const queryString = jsonArray.reduce((query, news, i) => {
    query +=
      `merge (n${i}:News {
        link: '${news.link}',
        extractedDate: '${news.extractedDate}',
        processedDate: '${news.processedDate}'
      })
      create (f${i}:Fact {date: '${news.date}'})
      create (n${i})-[:HAS_FACT]->(f${i})
      merge (s${i}:${news.subjectLabel} {name: '${news.subjectName}'})
      merge (o${i}:${news.objectLabel} {name: '${news.objectName}'})
      create (f${i})-[:HAS_SUBJECT_IN_${news.rel.toUpperCase()}]->(s${i})
      create (f${i})-[:HAS_OBJECT_IN_${news.rel.toUpperCase()}]->(o${i})
      `;
    return query;
  }, '');

  return session.run(queryString)
    .then(result => {
      session.close();
      return { response: true }
    }).catch(err => {
      console.log('err', err);
      return { response: false }
    })
}

const getNewsByTime = driver => (start, end) => {
  const session = driver.session();
  const keys = ['n', 'r1', 'f', 'r2', 'o'];

  const queryString =
    `match (n:News)-[r1]->(f)-[r2]->(o) where n.extractedDate >= date(${toDateObject(start)})
    and n.extractedDate <= date(${toDateObject(end)})
    return n, r1, f, r2, o;`

  console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      const records = collectAndRemoveDuplicate(result.records, keys);
      const dataReturned = records.map(record => format(record));
      return dataReturned;
    }).catch(err => {
      console.log('err', err);
      return { response: false }
    })
}

const delimeter = (delimeter) => string => {
  const d = string.split(delimeter);
  const parse = parseIntBase(10);
  return { year: parse(d[0]), month: parse(d[1]), day: parse(d[2]) }
}

const toDateObject = string => {
  const parse = delimeter('-');
  const date = parse(string);

  return `{year: ${date.year}, month: ${date.month}, day: ${date.day}}`
}

const parseIntBase = base => string => {
  return parseInt(string, base);
}

module.exports = {
  news,
  importFile,
  createNews,
  newsHasEntityAndRelationship,
  getNewsByTime
}
