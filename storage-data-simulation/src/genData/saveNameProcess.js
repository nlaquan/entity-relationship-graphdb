const { THRESSHOLD, LABEL_HAS_MANY_NAME } = require('../config');
const { saveName } = require('./utils');

(async () => {
  try {
    const label = process.argv[2];
    console.log('arg', process.argv);
    const maxId = parseInt(process.argv[4], 10);
    const times = Math.floor(maxId / THRESSHOLD);
    if (LABEL_HAS_MANY_NAME.includes(label)) {
      if (times) {
        for (let i = 0; i < times; ++i) {
          await saveName(label, i, i * THRESSHOLD, (i + 1) * THRESSHOLD);
        }

        if (maxId - times * THRESSHOLD) {
          await saveName(label, times + 1, times * THRESSHOLD, maxId);
        }
      } else if (maxId > 0) {
        console.log('run this');
        await saveName(label, 1, 0, maxId);
      }
    }
  } catch (err) {
    console.log('err: ', err);
  }
})();
