const {
  format,
  formatEntity,
  collectAndRemoveDuplicate,
  getData
} = require('../../../../api/utils');

const {
  QUARTERS,
  isEmptyArray,
  convertToQueryString,
  convertToQueryStringLabels,
  getInt
} = require('../../utils');


const entity = driver => async ({ label, name, isExact }) => {
  const session = driver.session();
  const queryString =
    isExact
      ? `match (n:${label} {name: '${name}'}) return n`
      : `match (n:${label}) where n.name contains '${name}' return n`;

  return session.run(queryString)
    .then(result => {
      session.close();
      if (isEmptyArray(result.records)) {
        return {}
      } else {
        const record = result.records.map(r => formatEntity(r.get("n")));
        if (record.length === 1) {
          return record[0];
        }

        return record;
      }
    })
    .catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const entityOccurencesInNews = driver => ({ links, id }) => {
  const session = driver.session();
  const ls = convertToQueryString(links);

  const queryString =
    `unwind (${ls}) as r
    match (n:News {link: r})-->(f)-->(o)
    where ID(o) = ${id}
    return count(f) as times`;

  console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      session.close();
      return {
        times: result.records[0].get('times').low
      }
    })
    .catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const entityOccurences = driver => async (id) => {
  const session = driver.session();

  const queryString =
    `match (n:News)-->(f)-->(o)
    where ID(o) = ${id}
    return distinct(n.link) as link, toString(n.extractedDate) as extractedDate`;

  console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      const dataReturned = result.records.map(record => ({
        link: record.get('link'),
        extractedDate: record.get('extractedDate')
      }));
      return dataReturned;
    })
    .catch(err => {
      return { response: false }
    });
}

const entityWithType = driver => async ({ labels, links }) => {
  const session = driver.session();
  const ls = convertToQueryString(links);
  const lbs = convertToQueryStringLabels(labels);

  const queryString =
    `unwind (${ls}) as r
    match (n:News {link: r})-[r1]->(f)-[r2]->(o)
    where labels(o) in ${lbs}
    return n, r1, f, r2, o
    `;
  const keys = ['n', 'r1', 'f', 'r2', 'o'];
  console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      const records = collectAndRemoveDuplicate(result.records, keys);
      // console.log('result', result);
      const dataReturned = records.map(record => format(record));
      return dataReturned;
    })
    .catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const entityHasRelWithOthersInNews = driver => async ({ links, id }) => {
  const session = driver.session();
  const ls = convertToQueryString(links);

  let queryString =
    `unwind (${ls}) as r
    match (n:News {link: r})-->(f1)-->(o)
    where ID(o) = ${id}
    with n, f1, o
    match (f1)-->(o1)
    with n, f1, o, o1
    match (o1)<-[r1]-(f2)-[r2]->(o2) where (f2)<--(n)
    return r1, r2, f1, f2, o, o1, o2`;

  const keys = ['r1', 'r2', 'f1', 'f2', 'o', 'o1', 'o2'];

  console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      const records = collectAndRemoveDuplicate(result.records, keys);
      const dataReturned = records.map(record => format(record));
      return dataReturned;
    })
    .catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const mergeEntity = driver => async (ids) => {
  console.log('merge');
  const session = driver.session();
  const queryString = mergeEntityQuery(ids);

  return session.run(queryString)
    .then(result => ({ response: true }))
    .catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const mergeEntityQuery = (ids) => {
  let queryString = '';
  for (let i = 0; i < ids.length; ++i) {
    queryString +=
      `\nmatch (p${i}) where ID(p${i}) = ${ids[i]}`
      + `\nwith p${i}`;
    for (let j = 0; j < i; ++j) {
      queryString += `, p${j} `;
    }
  }
  queryString += "\n";

  for (let i = 0; i < ids.length - 1; ++i) {
    queryString +=
      `create (p${i})<-[:SAME_AS]-(p${i + 1})\n`;
  }

  return queryString;
}

const entityWithRelationship = driver => ({ id, relationship }) => {
  const session = driver.session();
  const rel = relationship.toUpperCase();
  const queryString =
    `match (s)<-[:HAS_SUBJECT_IN_${rel}]-(f)-[:HAS_OBJECT_IN_${rel}]->(o)
    where ID(s) = ${id}
    return o as entity
    union
    match (s)<-[:HAS_SUBJECT_IN_${rel}]-(f)-[:HAS_OBJECT_IN_${rel}]->(o)
    where ID(o) = ${id}
    return s as entity
    `;

  console.log('query', queryString);

  const keys = ['entity'];

  return session.run(queryString)
    .then(result => {
      const records = collectAndRemoveDuplicate(result.records, keys);
      const dataReturned = records.map(record => format(record));
      return dataReturned;
    })
    .catch(err => {
      console.log('err', err);
      return { response: false }
    });
}

const entityWithRelationshipByMonth = driver => ({
  id, relationship, month, year
}) => {
  const session = driver.session();
  const rel = relationship.toUpperCase();

  const queryString =
    `match (s)<-[:HAS_SUBJECT_IN_${rel}]-(f)-[:HAS_OBJECT_IN_${rel}]->(o)
    where ID(s) = ${id}
    with f, s, o
    match (f)-[HAS_TIME]->(t)
    with (apoc.date.fields(toString(t.date), 'yyyy-MM-dd')) as date, o
    where date.months = ${month} and date.years = ${year}
    return distinct(o) as entity
    union
    match (s)<-[:HAS_SUBJECT_IN_${rel}]-(f)-[HAS_OBJECT_IN_${rel}]->(o)
    where ID(s) = ${id}
    with f, s, o
    match (f)-[HAS_TIME]->(t)
    with (apoc.date.fields(toString(t.date), 'yyyy-MM-dd')) as date, s
    where date.months = ${month} and date.years = ${year}
    return distinct(s) as entity`;

  console.log('queryString', queryString);

  return session.run(queryString)
    .then(result => {
      const _records = result.records.map(r => formatEntity(r.get(0)));

      // const dataReturned = _records.map(r => ({
      //   meta: {
      //     identity: r.identity.low,
      //     labels: r.labels
      //   },
      //   properties: r.properties
      // }));

      // return dataReturned;
      return _records;
    })
    .catch(err => {
      return { response: false }
    });
}

const entityWithRelationshipByQuarter = driver => ({
  id, relationship, quarter, year
}) => {
  const session = driver.session();
  const rel = relationship.toUpperCase();

  const queryString =
    `match(s)<-[:HAS_SUBJECT_IN_${rel}]-(f)-[:HAS_OBJECT_IN_${rel}]->(o)
    where ID(s) = ${id}
    with f, s, o
    match (f)-[:HAS_TIME]->(t)
    with (apoc.date.fields(toString(t.date), 'yyyy-MM-dd')) as date, o
    where date.years = ${year} and date.months in [${QUARTERS[quarter]}]
    return distinct(o) as entity
    union
    match(s)<-[:HAS_SUBJECT_IN_${rel}]-(f)-[:HAS_OBJECT_IN_${rel}]->(o)
    where ID(s) = ${id}
    with f, s, o
    match (f)-[:HAS_TIME]->(t)
    with (apoc.date.fields(toString(t.date), 'yyyy-MM-dd')) as date, s
    where date.years = ${year} and date.months in [${QUARTERS[quarter]}]
    return distinct(s) as entity`;

  // console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      const _records = result.records.map(r => formatEntity(r.get(0)));
      return _records;
    })
    .catch(err => {
      return { response: false }
    });
}

const statistic = driver => (ids) => {
  const session = driver.session();

  const queryString =
    `unwind [ ${ids} ] as id
    match (o)<--(f)<--(n:News) where ID(o) = id
    return o as entity, count(distinct(f)) as frequency, count(distinct(n)) as news_frequency;`;

  const keys = ['entity', 'frequency', 'news_frequency'];

  // console.log('query', queryString);

  return session.run(queryString)
    .then(result => {
      const records = result.records.map(r => getData(r, keys))

      /*
      In Neo4j, the type Integer can be larger what can be represented safely as
      an integer with JavaScript Number.

      It is only safe to convert to a JavaScript Number if you know that the number will be in
      the range Number.MIN_SAFE_INTEGER -(253- 1) and Number.MAX_SAFE_INTEGER (253- 1).

      https://github.com/neo4j/neo4j-javascript-driver#reading-integers
      */
      const dataReturned = records.reduce((acc, v, i) => [
        ...acc, {
          ...v.entity,
          identity: getInt(v.entity.identity),
          frequency: getInt(v.frequency),
          news_frequency: getInt(v.news_frequency)
        }
      ], []);

      console.log('dataReturnred', dataReturned);
      return dataReturned;
    })
    .catch(err => {
      return { response: false }
    });
}

module.exports = {
  entity,
  mergeEntity,
  entityWithType,
  entityOccurences,
  entityHasRelWithOthersInNews,
  entityOccurencesInNews,
  entityWithRelationship,
  entityWithRelationshipByMonth,
  entityWithRelationshipByQuarter,
  statistic
}
