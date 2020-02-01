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

function LocationAPI(service) {
  API.call(this, service);

  async function updateLocation(req, res) {
    const { id } = req.params;
    const { long, lat } = req.query;

    try {
      withTryCatch({
        promise: async () => await service.updateLocation({ id, lat, long }),
        onSuccess: (responsedData) => res.send(responsedData),
        onError: (err) => res.send(err)
      });
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  return {
    updateLocation
  }
}

module.exports = LocationAPI;
