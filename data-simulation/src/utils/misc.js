const fs = require('fs');
const csvWriter = require('csv-writer');
const csv = require('csv-parser');
const random = require('random');

const writeFile = (data, target) => {
  fs.writeFile(
    target,
    JSON.stringify(data, null, 2),
    (err) => err ? console.error('Data not written!', err) : console.log('Data written!')
  )
}

// random a number in range
function rdNumber(range) {
  return Math.floor((Math.random() * 10000000) % range) + 1;
}

// random 2 number in range [start, end]
function rd2Number(start, end) {
  const range = end - start;
  const rd1 = rdNumber(range);
  let rd2 = rdNumber(range);
  if (rd1 === rd2) {
    return [rd1, rd1 + 1];
  }

  return [rd1, rd2];
}

function rdEntity(entityArray) {
  const len = entityArray.length;
  return entityArray[rdNumber(len - 1)];
}

async function loadLocations() {
  const locations = await new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream('data/country/countries.csv')
      .pipe(csv())
      .on('data', row => data.push(row.name))
      .on('end', () => resolve(data))
  })
  return locations;
}

async function loadCountries() {
  const countries = await new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream('data/country/countries.csv')
      .pipe(csv())
      .on('data', row => data.push(row.name))
      .on('end', () => resolve(data))
  })
  return countries;
}

async function loadDates() {
  const dates = await new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream('data/date/date.csv')
      .pipe(csv())
      .on('data', row => data.push(row.date))
      .on('end', () => resolve(data))
  })
  return dates;
}

async function loadPeople() {
  const people = await new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream('data/people/people.csv')
      .pipe(csv())
      .on('data', row => data.push(row.name))
      .on('end', () => resolve(data));
  })
  return people;
}

async function loadEvents() {
  const times = 1000000;
  const data = [];
  for (let i = 0; i < times; ++i) {
    data.push({ name: `Event ${i + 1}` });
  }
  return data;
}

function takeAmountOfRecord(dataArray, amount) {
  const len = dataArray.length;
  const result = [dataArray[0]];
  const map = { 0: true };

  while (result.length < amount) {
    const t = rdNumber(len);
    if (!map[t]) {
      result.push(dataArray[t]);
    }
  }

  return result;
}

function takeAmountOfIndex(dataArray, amount) {
  const len = dataArray.length;
  const init = rdNumber(len);
  const result = [init];
  const map = { [init]: true };

  while (result.length < amount) {
    const t = rdNumber(len);
    if (!map[t]) {
      result.push(t);
    }
  }

  return result;
}


function generateKeyFrom2Number(num1, num2) {
  const key = num1 < num2 ? `${num1}${num2}` : `${num2}${num1}`;
  return key;
}


function takeAmountOfPairRecord(dataArray, amount) {
  const len = dataArray.length;
  const [init1, init2] = rd2Number(0, len);
  const key = generateKeyFrom2Number(init1 - 1, init2 - 1);
  const map = { [key]: true };
  const result = [[dataArray[init1 - 1], dataArray[init2 - 1]]];

  while (result.length < amount) {
    const [n1, n2] = rd2Number(0, len);
    const k = generateKeyFrom2Number(n1 - 1, n2 - 1);
    if (!map[k]) {
      result.push([dataArray[n1 - 1], dataArray[n2 - 1]]);
    }
  }

  return result;
}

function takeAmountOfPairIndex(dataArray, amount) {
  const len = dataArray.length;
  const [i1, i2] = rd2Number(0, len);
  const key = generateKeyFrom2Number(i1, i2);
  const map = { [key]: true };
  const result = [[i1, i2]];

  while (result.length < amount) {
    const [n1, n2] = rd2Number(0, len);
    const k = generateKeyFrom2Number(n1, n2);
    if (!map[k]) {
      result.push([n1, n2]);
    }
  }

  return result;
}

async function writeToCSV(name, data, path) {
  const createCsvWriter = csvWriter.createObjectCsvWriter;
  const header = Object.keys(data[0]).reduce((acc, key) => [
    ...acc,
    {
      id: key, title: key
    }
  ], []);

  const writer = createCsvWriter({
    path,
    header
  });

  return writer.writeRecords(data) // return a promise
    .then(() => {
      console.log(`Writing ${name} done`);
    });
}

async function writeToCSVWithoutHeader(name, data, path) {
  const createCsvWriter = csvWriter.createObjectCsvWriter;
  const header = Object.keys(data[0]).reduce((acc, key) => [
    ...acc,
    key
  ], []);

  const writer = createCsvWriter({
    path,
    header
  });

  return writer.writeRecords(data) // return a promise
    .then(() => true);
}

function rd(maxId) {
  return Math.floor(Math.random() * maxId);
}

function numberOfDigit(num) {
  let _num = num
  let n = 0;
  while ((_num / 10) !== 0) {
    ++n;
    _num = Math.floor(_num / 10);
  }
  return n;
}

function createNumber(numberOfDigit) {
  return Math.pow(10, numberOfDigit);
}

module.exports = {
  writeFile,
  rd,
  rdNumber,
  rd2Number,
  rdEntity,
  writeToCSV,
  loadDates,
  loadLocations,
  loadPeople,
  loadCountries,
  loadEvents,
  takeAmountOfRecord,
  takeAmountOfPairRecord,
  takeAmountOfPairIndex,
  takeAmountOfIndex,
  writeToCSVWithoutHeader
}
