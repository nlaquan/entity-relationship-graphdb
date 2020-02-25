import axios from 'axios';

function ConfigNotFound(message) {
  this.message = message;
  Error.captureStackTrace(this, ConfigNotFound);
}

ConfigNotFound.prototype = Object.create(Error.prototype);
ConfigNotFound.prototype.name = 'ConfigNotFoundException';

const isInvalid = str => str === undefined;

const loadConfig = () => {
  const apiAddress = process.env.REACT_APP_API_ADDRESS;

  if (isInvalid(apiAddress)) {
    throw new ConfigNotFound("API_ADDRESS not found!!!");
  }

  const domain = `http://${apiAddress}`;
  const baseURL = `${domain}/er-services`;

  const api = axios.create({
    baseURL
  });

  return ({ api, domain, baseURL })
};

const { api, domain, baseURL } = loadConfig();

export {
  api,
  domain,
  baseURL
}
