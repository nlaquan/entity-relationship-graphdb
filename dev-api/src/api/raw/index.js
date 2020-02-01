const API = require('../base');

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

function RawAPI(service) {
  API.call(this, service);

  async function rawQuery(req, res) {
    const { query } = req.body;

    try {
      withTryCatch({
        promise: async () => await service.executeRawQuery(query),
        onSuccess: (responsedData) => res.send(responsedData),
        onError: (err) => res.send(err)
      });
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  return {
    rawQuery
  }
}

module.exports = RawAPI;
