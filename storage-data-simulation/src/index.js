const {
  saveEntitiesUseChildProcess,
  saveNewsUseChildProcess,
  saveEntitiesNameUseChildProcess
} = require('./utils/process');
const { rd, loadDates, rdEntity } = require('./utils/misc');
const { THRESSHOLD, FACTS_PER_NEWS } = require('./config');
const { createScript } = require('./utils/script');
const { readConfig, prepare, saveTime } = require('./utils/prepare');
const { writeToCSVWithoutHeader } = require('./utils/misc');

const hierarchy = {
  root: "import",
  subs: ["entities", "rels"]
};

(async function main() {
  const configFilePath = process.argv[2];
  const { entities, facts, relMap } = readConfig(configFilePath);
  const dates = await loadDates();

  let currentNewsId = 0;
  let interval = 0;
  let startId = 0;

  async function generate(relNth, entities, relationship, startId) {
    const { type, subject, object, amount } = relationship;

    const endHeaderSubjectStd = `:END_ID(${subject}-ID)`;
    const endHeaderObjectStd = `:END_ID(${object}-ID)`;
    const relTypeForSubject = `HAS_SUBJECT_IN_${type}`;
    const relTypeForObject = `HAS_OBJECT_IN_${type}`;

    const times = Math.floor(amount / THRESSHOLD);

    console.log(`GENERATE ${type}-relationship: ${times} times`);

    const maxSId = entities[subject] - 1;
    const maxOId = entities[object] - 1;

    async function fn(nth, start, end) {
      console.log(`-------- generate times: ${nth + 1}`);
      console.time(`-------- generate ${type}-relationship: ${nth + 1} times`);
      const facts = [];
      const hasFacts = [];
      const hasSubjects = [];
      const hasObjects = [];
      const hasTimes = [];
      const hasNames = [];

      let sId = 0;
      let oId = 0;
      let path = '';
      let displayName = ''

      for (let i = start; i < end; ++i, ++interval) {
        sId = rd(maxSId);
        oId = rd(maxOId);
        if (interval === FACTS_PER_NEWS) {
          interval = 0;
          ++currentNewsId;
        }

        hasSubjects.push({
          ':START_ID(Fact-ID)': i,
          [endHeaderSubjectStd]: sId,
          ':TYPE': relTypeForSubject
        });

        hasObjects.push({
          ':START_ID(Fact-ID)': i,
          [endHeaderObjectStd]: oId,
          ':TYPE': relTypeForObject
        });

        facts.push({
          'factId:ID(Fact-ID)': i,
          'date:date': rdEntity(dates),
          ':LABEL': 'Fact'
        });

        hasFacts.push({
          ':START_ID(News-ID)': currentNewsId,
          ':END_ID(Fact-ID)': i,
          ':TYPE': 'HAS_FACT'
        });

        // hasTimes.push({
        //   ':START_ID(Fact-ID)': i,
        //   ':END_ID(Time-ID)': rd(dates.length),
        //   ':TYPE': 'HAS_TIME'
        // });
      }

      try {
        path = `import/entities/Fact/fact_part${relNth}_${nth}.csv`;
        displayName = `fact_${relNth}${nth}`;
        await writeToCSVWithoutHeader(displayName, facts, path);

        path = `import/rels/has_fact/has_fact_part${relNth}_${nth}.csv`;
        displayName = `hasFact_${relNth}${nth}`
        await writeToCSVWithoutHeader(displayName, hasFacts, path);

        path = `import/rels/${type}/has_subject_part${relNth}_${nth}.csv`;
        displayName = `${type}_hasSubject_${relNth}${nth}`;
        await writeToCSVWithoutHeader(displayName, hasSubjects, path);

        path = `import/rels/${type}/has_object_part${relNth}_${nth}.csv`;
        displayName = `${type}_hasObject_${relNth}${nth}`;
        await writeToCSVWithoutHeader(displayName, hasObjects, path);

        // path = `import/rels/${type}/has_time_part.csv`;
        // displayName = `hasFact_${relNth}${nth}`;
        // await writeToCSVWithoutHeader(displayName, hasTimes, path);

        console.timeEnd(`-------- generate ${type}-relationship: ${nth + 1} times`);
      } catch (err) {
        console.log('err', err);
      }
    }

    if (times) {
      for (let i = 0; i < times; ++i) {
        await fn(i, startId + i * THRESSHOLD, startId + (i + 1) * THRESSHOLD);
      }
      if (amount - times * THRESSHOLD) {
        await fn(times + 1, startId + times + 1, startId + amount);
      }
    }
    if (amount - times * THRESSHOLD) {
      await fn(1, startId, startId + amount);
    }
  }

  prepare(relMap, hierarchy, {
    entityRootFolder: `${hierarchy.root}/${hierarchy.subs[0]}`,
    entityFolderNames: [...Object.keys(entities)],
  }, {
    relRootFolder: `${hierarchy.root}/${hierarchy.subs[1]}`,
    relFolderNames: [...Object.keys(relMap)]
  });

  for (let i = 0; i < facts.length; ++i) {
    await generate(i, entities, facts[i], startId);
    startId += facts[i].amount;
  }

  createScript(
    [...Object.keys(entities)],
    [...facts.map(rel => rel.type)]
  );

  saveEntitiesUseChildProcess({ ...entities });
  saveEntitiesNameUseChildProcess({ ...entities });
  saveNewsUseChildProcess(currentNewsId + 1);
  // await saveTime(dates);
})();

// function generateData(danh_sách_các_loại_thực_thể, danh_sách_các_loại_fact) {
//   entitiesMap = Map(){string, []};

//   load dữ liệu thời gian từ file và lưu vào entitiesMap.time;

//   for mỗi loại nhãn thực thể label, số lượng n in danh_sách_các_loại_thực_thể
//     sinh ra n thực thể có nhãn label;
//     lưu vào entitiesMap[label];
//   end

//   for mỗi loại fact r, số lượng n in danh_sách_các_loại_fact
//     while số lượng Fact loại này được sinh ra < số lượng Fact loại này được yêu cầu
//       tạo ra 1 bản tin (News) n;
//       tạo ra 1 đoạn bản tin fact (Fact) f;
//       chọn 1 thực thể thời gian (Time) t trong danh sách thực thể đã có;
//       chọn ra 1 cặp thực thể p1, p2 trong danh sách thực thể đã có thoả mãn loại Fact;
//       lần lượt tạo ra liên kết giữa bản tin n và đoạn bản tin f,
//         giữa đoạn bản tin f và thực thể thời gian t,
//           giữa đoạn bản tin f và 2 thực thể p1, p2;
//     endWhile
//   endFor
// }
