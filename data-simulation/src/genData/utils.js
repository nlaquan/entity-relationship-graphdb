const random = require('random');
const { capitalize } = require('lodash');
const {
  writeToCSV, rdEntity, writeToCSVWithoutHeader
} = require('../utils/misc');
const { THRESSHOLD, RELS_MAP } = require('../config');

function createMeetFact(maxPersonId) {
  const sId = random.int(0, maxPersonId);
  let oId = random.int(0, maxPersonId);

  if (sId === oId && sId === maxPersonId) {
    oId = sId - 1;
  }
  if (sId === oId && sId !== maxPersonId) {
    oId = sId + 1;
  }
  return { sId, oId };
}

function createVisitFact(numberOfPeople, numberOfCountry) {
  const sId = random.int(0, numberOfPeople);
  const oId = random.int(0, numberOfCountry);
  return { sId, oId }
}

function createOrganizeFact(numberOfPeople, lastEventId) {
  const sId = random.int(0, numberOfPeople);
  return { sId, oId: lastEventId };
}

function createSupportFact(numberOfPeople, lastEventId) {
  const sId = random.int(0, numberOfPeople);
  return { sId, oId: lastEventId };
}

function createOpposeFact(numberOfPeople, lastEventId) {
  const sId = random.int(0, numberOfPeople);
  return { sId, oId: lastEventId };
}

function createTakePartInFact(numberOfPeople, lastEventId) {
  const sId = random.int(0, numberOfPeople);
  return { sId, oId: lastEventId };
}

function createCancelFact(numberOfCountry, lastAgreementId) {
  const sId = random.int(0, numberOfCountry);
  return { sId, oId: lastAgreementId };
}

function createNegotiateFact(numberOfCountry) {
  const sId = random.int(0, numberOfCountry);
  let oId = random.int(0, numberOfCountry);

  if (sId === oId && sId === numberOfCountry) {
    oId = sId - 1;
  }
  if (sId === oId && sId !== numberOfCountry) {
    oId = sId + 1;
  }
  return { sId, oId };
}

function createTakePlaceFact(numberOfEvent, numberOfLocation) {
  const sId = random.int(0, numberOfEvent);
  const oId = random.int(0, numberOfLocation);
  return { sId, oId };
}

async function saveEntity(label, nth, start, end) {
  path = `import/entities/${label}/${label}-part${nth}.csv`;
  displayName = `${label}_part_${nth + 1}`;
  const capitalLabel = capitalize(label);
  const numberOfEntities = end - start;

  dataArr = Array.from(new Array(numberOfEntities), (_, i) => ({
    [`${label}Id:ID(${capitalLabel}-ID)`]: start + i,
    'name': `${capitalLabel} ${start + i}`,
    'description': `This is ${label} ${start + i}`,
    ':LABEL': `${capitalLabel}`
  }))

  await writeToCSVWithoutHeader(displayName, dataArr, path);
}

async function saveNews(nth, start, end, dates) {
  const numberOfNews = end - start;
  path = `import/entities/news/news-part${nth}.csv`;
  dataArr = Array.from(new Array(numberOfNews), (_, i) => ({
    'newsId:ID(News-ID)': start + i,
    'link': `https://link-to-new-${start + i}`,
    'date:date': rdEntity(dates),
    ':LABEL': 'News'
  }))
  await writeToCSVWithoutHeader(`news_${nth}`, dataArr, path);
}

function generateObject(factType, factId, sId, oId) {
  switch (factType) {
    case RELS_MAP.MEET:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_MEET'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_MEET'
      }]
    case RELS_MAP.VISIT:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_VISIT'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Country-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_VISIT'
      }]
    case RELS_MAP.ORGANIZE:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_ORGANIZE'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_ORGANIZE'
      }]
    case RELS_MAP.SPEAK:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_SPEAK'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_SPEAK'
      }]
    case RELS_MAP.SUPPORT:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_SUPPORT'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_SUPPORT'
      }]
    case RELS_MAP.OPPOSE:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_OPPOSE'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_OPPOSE'
      }]
    case RELS_MAP.TAKE_PART_IN:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Person-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_TAKE_PART_IN'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_TAKE_PART_IN'
      }]
    case RELS_MAP.CANCEL:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Country-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_CANCEL'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Agreement-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_CANCEL'
      }]
    case RELS_MAP.NEGOTIATE:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Country-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_NEGOTIATE'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_NEGOTIATE'
      }]
    case RELS_MAP.INTENSE:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Country-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_TENSE'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Country-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_TENSE'
      }]
    case RELS_MAP.TAKE_PLACE_IN:
      return [{
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Event-ID)': sId,
        ':TYPE': 'HAS_SUBJECT_IN_TAKE_PLACE'
      }, {
        ':START_ID(Fact-ID)': factId,
        ':END_ID(Location-ID)': oId,
        ':TYPE': 'HAS_OBJECT_IN_TAKE_PLACE'
      }]
  }
}

module.exports = {
  generateObject,
  createCancelFact,
  createMeetFact,
  createNegotiateFact,
  createOpposeFact,
  createOrganizeFact,
  createSupportFact,
  createTakePartInFact,
  createTakePlaceFact,
  createVisitFact,
  saveEntity,
  saveNews,
}
