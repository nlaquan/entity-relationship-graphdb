const ENTITY_LABEL = [
  'Person', 'Event', 'Agreement', 'Location', 'Country'
];

const RELATIONSHIP_TYPE = [
  'MEET',
  'VISIT',
  'TAKE_PLACE',
  'SIGN_WITH',
  'ORGANIZE',
  'NEGOTIATE',
  'INTENSE_WITH',
  'SPEAK'
];

const YEARS = Array.from(new Array(10), (_, i) => `201${i}`);


export {
  ENTITY_LABEL,
  RELATIONSHIP_TYPE,
  YEARS
}
