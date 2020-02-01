import { api } from '../config';

async function entity({ label, name, isExact }) {
  const url =
    isExact
      ? `/entity?label=${label}&name=${name}&isExact=true`
      : `/entity?label=${label}&name=${name}`;

  return api.get(url)
    .then(function (res) {
      return res.data;
    })
}

async function entityWithType({ links, labels }) {
  console.log('new with entity type');
  const url = `/news_with_entity_type?links=${links.join(',')}&labels=${labels.join(',')}`;

  return api.get(url)
    .then(function (res) {
      return res.data;
    })
}

async function entityOccurrencesInNews({ id, links }) {
  const url = `entity_occurrences_in_news?links=${links.join(',')}&id=${id}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

async function entityOccurrences(id) {
  const url = `entity_occurrences?id=${id}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

async function entityWithRelationship({ id, relationship }) {
  const url =
    `entity_with_relationship?id=${id}&relationship=${relationship}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

async function entityWithRelationshipByMonth({
  id, relationship, month, year
}) {
  const url =
    `entity_with_relationship_by_month?`
    + `id=${id}`
    + `&relationship=${relationship}`
    + `&month=${month}`
    + `&year=${year}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

async function entityWithRelationshipByQuarter({
  id, relationship, quarter, year
}) {
  const url =
    `entity_with_relationship_by_quarter?`
    + `id=${id}`
    + `&relationship=${relationship}`
    + `&quarter=${quarter}`
    + `&year=${year}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

async function entityWithOtherEntityInNews({ links, id }) {
  console.log('run');
  const url =
    `entity_has_rel_with_others_in_news?links=${links.join(',')}&id=${id}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

async function mergeEntity(ids) {
  const url =
    `merge?ids=${ids.join(',')}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    })
}

export {
  entity,
  entityWithType,
  entityOccurrences,
  entityWithOtherEntityInNews,
  entityOccurrencesInNews,
  entityWithRelationship,
  entityWithRelationshipByMonth,
  entityWithRelationshipByQuarter,
  mergeEntity
}
