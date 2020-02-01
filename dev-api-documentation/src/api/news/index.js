import { api } from '../config';

async function news(ids) {
  const url = `/news?links=${ids.join(',')}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    });
}

async function newsHasEntityAndRelationship({ sId, oId, relationship }) {
  const url = `news_has_entity_and_relationship?`
    + `sId=${sId}&`
    + `oId=${oId}&`
    + `relationship=${relationship}`;

  return api.get(url)
    .then((res) => {
      return res.data;
    });
}

/**
 * @param {Object} newArticle
 * @return
 */
async function createNews(file) {
  const url = `news`;
  const formData = new FormData()
  formData.append('file', file);

  return api.post(url, formData)
    .then(res => res.data);
}

/**
 * @param {File} file
 * @return
 */
async function importFile(file) {
  const url = `import`;
  const formData = new FormData()
  formData.append('file', file);

  return api.post(url, formData)
    .then(res => res);
}

export {
  news,
  importFile,
  createNews,
  newsHasEntityAndRelationship
}
