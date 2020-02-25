const { loadDates } = require('./misc');
const childProcess = require('child_process');
const { THRESSHOLD } = require('../config');
const { rdEntity, writeToCSVWithoutHeader } = require('./misc');

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

async function saveNewsUseChildProcess(numberOfNews) {
  const dates = await loadDates();

  const times = Math.floor(numberOfNews / THRESSHOLD);
  if (times) {
    const processArr = Array.from(new Array(times), (_, i) => {
      return childProcess.spawn('node', [
        'src/genData/saveNewsProcess.js',
        i + 1,
        i * THRESSHOLD,
        (i + 1) * THRESSHOLD
      ]);
    });

    processArr.forEach(process => {
      process.stdout.on('data', function (data) {
        console.log('finish');
      });

      process.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });
    });
    if (numberOfNews - times * THRESSHOLD) {
      await saveNews(times + 1, times * THRESSHOLD, numberOfNews, dates);
    }
  } else if (numberOfNews > 0) {
    await saveNews(1, 0, numberOfNews, dates);
  }
}

async function saveEntitiesUseChildProcess(entities) {
  const _entitiesArr = Object.entries(entities).sort((e1, e2) => e1[1] - e2[1]);

  const processArr = Array.from(new Array(_entitiesArr.length), (_, i) => {
    return childProcess.spawn('node', [
      'src/genData/saveEntityProcess.js',
      _entitiesArr[i][0],
      i,
      _entitiesArr[i][1]
    ]);
  });

  processArr.forEach(process => {
    process.stdout.on('data', function (data) {
      console.log('finish');
    });

    process.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
  });
}

async function saveEntitiesNameUseChildProcess(entities) {
  const _entitiesArr = Object.entries(entities).sort((e1, e2) => e1[1] - e2[1]);


  const processArr = Array.from(new Array(_entitiesArr.length), (_, i) => {
    return childProcess.spawn('node', [
      'src/genData/saveNameProcess.js',
      _entitiesArr[i][0],
      i,
      _entitiesArr[i][1]
    ]);
  });

  processArr.forEach(process => {
    process.stdout.on('data', function (data) {
      console.log('finish');
    });

    process.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
  });
}

module.exports = {
  saveNewsUseChildProcess,
  saveEntitiesUseChildProcess,
  saveEntitiesNameUseChildProcess
}
