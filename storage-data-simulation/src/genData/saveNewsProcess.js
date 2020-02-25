const {
  loadDates
} = require('../utils/misc');
const {
  saveNews
} = require('./utils');

const [param1, param2, nthStr, startStr, endStr] = process.argv;

(async () => {
  try {
    const nth = parseInt(nthStr, 10);
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);

    const dates = await loadDates();

    await saveNews(nth, start, end, dates);
  } catch (err) {
    console.log('err: ', err);
  }
})();
