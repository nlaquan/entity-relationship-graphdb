import apiDes from './apiDesccription';
import questions from './questions';

const RELATIONSHIP_TYPE = [
  'MEET',
  'SPEAK',
  'VISIT',
  'ORGANIZE',
  'SIGN_WITH',
  'NEGOTIATE',
  'TAKE_PLACE',
  'INTENSE_WITH',
];

const ENTITY_LABEL = [
  'Person', 'Event', 'Agreement', 'Location', 'Country'
];

const YEARS = Array.from(new Array(10), (_, i) => `201${i}`);

export {
  YEARS,
  apiDes,
  questions,
  ENTITY_LABEL,
  RELATIONSHIP_TYPE,
}
