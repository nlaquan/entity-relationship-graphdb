function queryEntity({ label, name, isExact }) {
  const queryString =
    isExact
      ? `match (n:${label} {name: '${name}'}) return n`
      : `match (n:${label}) where n.name contains '${name}' return n`;

  return queryString;
}

function queryEntityOccurencesInNews({ newsId, label, id }) {
  const queryString =
    `match
    (:News {newsId: '${newsId}'})-->(f)-->(o:${label})
    where ID(o) = ${id}
    return count(f) as times`;

  return queryString;
}

function queryEntityOccurences({ label, id }) {
  const queryString =
    `match (n:News)-->(f)-->(o:${label})
    where ID(o) = ${id}
    return n.newsId as link, toString(f.date) as extractedDate`;

  return queryString;
}

function querySubjectEntity({
  subjectLabel, rel, objectLabel, objectName
}) {
  const queryString =
    `match(s:${subjectLabel})`
    + `<-[HAS_SUBJECT_IN_${rel}]-(f)`
    + `-[:HAS_OBJECT_IN_${rel}]->(:${objectLabel} {name: '${objectName}'})
  return distinct(s) as ${subjectLabel}`;

  return queryString;
}

function queryObjectEntity({
  subjectLabel, subjectName, objectLabel, rel
}) {
  const queryString =
    `match(:${subjectLabel} {name: '${subjectName}'})`
    + `<-[HAS_SUBJECT_IN_${rel}]-(f)`
    + `-[:HAS_OBJECT_IN_${rel}]->(o:${objectLabel})
    return distinct(o) as ${objectLabel}`;

  return queryString;
}

function querySubjectEntityByMonth({
  subjectLabel, objectLabel, objectId, rel, month, year
}) {
  const queryString =
    `match(s:${subjectLabel})`
    + `<--(f)`
    + `-[HAS_OBJECT_IN_${rel}]->(o:${objectLabel} {${capitalize(objectLabel)}Id: '${objectId}'})
    with f, s
    match (f)<--(n:News)
    with (apoc.date.fields(toString(n.date), 'yyyy-MM-dd')) as date, s
    where date.months = ${month} and date.years = ${year}
    return distinct(s) as ${subjectLabel}`;

  return queryString;
}

function queryObjectEntityByMonth({
  subjectLabel, subjectId, objectLabel, rel, month, year
}) {
  const queryString =
    `match(:${subjectLabel} {${capitalize(subjectLabel)}Id: '${subjectId}'})`
    + `<-[HAS_SUBJECT_IN_${rel}]-(f)`
    + `-->(o:${objectLabel})
      with f, o
      match (f)<--(n:News)
      with (apoc.date.fields(toString(n.date), 'yyyy-MM-dd')) as date, o
      where date.months = ${month} and date.years = ${year}
      return distinct(o) as ${objectLabel}`;

  return queryString;
}

function querySubjectEntityByQuarter({
  subjectLabel, objectLabel, objectId, rel, quarter, year
}) {
  const queryString =
    `match(s:${subjectLabel})`
    + `<--(f)`
    + `-[:HAS_OBJECT_IN_${rel}]->(o:${objectLabel} {${capitalize(objectLabel)}Id: '${objectId}'})
      with f, s
      match (f)<--(n:News)
      with (apoc.date.fields(toString(n.date), 'yyyy-MM-dd')) as date, s
      where date.years = ${year} and date.months in [${QUARTERS[quarter]}]
      return distinct(s) as ${subjectLabel}`;

  return queryString;
}

function queryObjectEntityByQuarter({
  subjectLabel, subjectId, objectLabel, rel, quarter, year
}) {
  const queryString =
    `match(:${subjectLabel} {${capitalize(subjectLabel)}Id: '${subjectId}'})`
    + `<-[HAS_SUBJECT_IN_${rel}]-(f)`
    + `-->(o:${objectLabel})
      with f, o
      match (f)<--(n:News)
      with (apoc.date.fields(toString(n.date), 'yyyy-MM-dd')) as date, o
      where date.years = ${year} and date.months in [${QUARTERS[quarter]}]
      return distinct(o) as ${objectLabel}`;

  return queryString;
}

function queryEntityWithType({ newsIds, labels }) {
  const lbs = convertToQueryStringLabels(labels);

  const queryString =
    `match (n:News {newsId: r})-[r1]->(f)-[r2]->(o)
    where ID(n) in [${newsIds.join(',')}] and labels(o) in ${lbs}
    return n, r1, f, r2, o`

  const keys = ['n', 'r1', 'f', 'r2', 'o'];

  return { queryString, keys };
}

function queryEntityHasRelWithOthers({
  newsIds, label, id, relationship, otherLabel
}) {
  const rel = relationship.toUpperCase();
  let queryString = '';

  if (newsIds.length === 1) {
    queryString =
      `match (e1:${label})`
      + `<-[:HAS_SUBJECT_IN_${rel}]-(f)`
      + `-[:HAS_OBJECT_IN_${rel}]->(e2:${otherLabel})
      where ID(e1) = ${id}
      with distinct(e2)
      return e2.name as name, e2.description as description`;
  } else {
    queryString =
      `match (e1:${label})`
      + `<-[:HAS_SUBJECT_IN_${rel}]-(f)`
      + `-[:HAS_OBJECT_IN_${rel}]->(e2:${otherLabel})
      where ID(e1) = ${id}
      with distinct(e2)
      return e2.name as name, e2.description as description
      union
      match (e1:${label})`
      + `<-[:HAS_OBJECT_IN_${rel}]-(f)`
      + `-[:HAS_SUBJECT_IN_${rel}]->(e2:${otherLabel})
      where ID(e1) = ${id}
      with distinct(e2)
      return e2.name as name, e2.description as description`;
  }

  return queryString;
}

module.exports = {
  queryEntity,
  queryEntityOccurences,
  queryEntityOccurencesInNews,
  querySubjectEntity,
  queryObjectEntity,
  querySubjectEntityByMonth,
  queryObjectEntityByMonth,
  querySubjectEntityByQuarter,
  queryObjectEntityByQuarter,
  queryEntityWithType,
  queryEntityHasRelWithOthers,
}
