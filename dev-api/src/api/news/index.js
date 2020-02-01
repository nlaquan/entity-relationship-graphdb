const API = require('../base');
const { seperate } = require('../utils');
const fs = require('fs');

async function withTryCatch({
  promise, onSuccess, onError
}) {
  try {
    const responsedData = await promise();
    onSuccess(responsedData);
  } catch (err) {
    onError(err);
  }
}

function NewsAPI(service) {
  API.call(this, service);

  /**
   * proxy function
   * @param {*} req
   * @param {*} res
   */
  async function getNews(req, res) {
    console.log('run get news');
    const links = seperate(req.query.links);

    withTryCatch({
      promise: async () => await service.news(links),
      onSuccess: (responsedData) => res.send(responsedData),
      onError: (err) => res.send(err)
    });
  }

  // get article has Entity and Relationship
  async function getNewsHasEntityAndRelationship(req, res) {
    const { sId, relationship, oId } = req.query;
    const rel = relationship.toUpperCase();

    withTryCatch({
      promise: async () => await service.newsHasEntityAndRelationship({ sId, rel, oId }),
      onSuccess: (responsedData) => res.send(responsedData),
      onError: (err) => res.send(err)
    });
  }

  async function createNews(req, res) {
    const { filename } = req.file;
    const filePath = `./uploads/${filename}`;

    try {
      const stringData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(stringData);

      withTryCatch({
        promise: async () => await service.createNews(jsonData),
        onSuccess: (responsedData) => res.send(responsedData),
        onError: (err) => res.send(err)
      });
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function importFile(req, res) {
    const { filename } = req.file;
    const csvFilePath = `./uploads/${filename}`;

    try {
      const jsonArray = await csv().fromFile(csvFilePath);

      const responsedData = await service.importFile(jsonArray);
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function getNewsByTime(req, res) {
    console.log('run this');
    const { from, to } = req.query;

    try {
      withTryCatch({
        promise: async () => await service.getNewsByTime(from, to),
        onSuccess: (responsedData) => res.send(responsedData),
        onError: (err) => res.send(err)
      });
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  return {
    getNews,
    getNewsHasEntityAndRelationship,
    createNews,
    importFile,
    getNewsByTime
  }
}

module.exports = NewsAPI;
