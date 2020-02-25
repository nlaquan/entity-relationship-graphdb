const { THRESSHOLD, LABEL_HAS_MANY_NAME } = require('../config');
const { saveEntity, saveHasName } = require('./utils');

(async () => {
  try {
    const label = process.argv[2];
    console.log(`GENERATE ${label}`);
    const maxId = parseInt(process.argv[4], 10);
    const times = Math.floor(maxId / THRESSHOLD);
    if (times) {
      for (let i = 0; i < times; ++i) {
        await saveEntity(label, i, i * THRESSHOLD, (i + 1) * THRESSHOLD);
        if (LABEL_HAS_MANY_NAME.includes(label)) {
          console.log('run this');
          await saveHasName(label, i, i * THRESSHOLD, (i + 1) * THRESSHOLD);
        }
      }

      if (maxId - times * THRESSHOLD) {
        await saveEntity(label, times + 1, times * THRESSHOLD, maxId);
        if (LABEL_HAS_MANY_NAME.includes(label)) {
          await saveHasName(label, i, i * THRESSHOLD, (i + 1) * THRESSHOLD);
        }
      }
    } else if (maxId > 0) {
      await saveEntity(label, 1, 0, maxId);
      if (LABEL_HAS_MANY_NAME.includes(label)) {
        await saveHasName(label, 1, 0, maxId);
      }
    }
  } catch (err) {
    console.log('err: ', err);
  }
})();
