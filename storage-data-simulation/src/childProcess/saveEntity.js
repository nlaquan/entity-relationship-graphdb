const { THRESSHOLD } = require('../config');
const { saveEntity } = require('./utils');

(async () => {
  try {
    const label = process.argv[2];
    const maxId = parseInt(process.argv[4], 10);
    const times = Math.floor(maxId / THRESSHOLD);

    for (let i = 0; i < times; ++i) {
      await saveEntity(label, i, i * THRESSHOLD, (i + 1) * THRESSHOLD);
    }

    await saveEntity(label, times + 1, times * THRESSHOLD + 1, maxId);
  } catch (err) {
    console.log('err: ', err);
  }
})();
