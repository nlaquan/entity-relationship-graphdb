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
    const { id } = req.params;
    const { long, lat } = req.query;

    try {
      withTryCatch({
        promise: async () => await service.rawQuery({ id, lat, long }),
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
