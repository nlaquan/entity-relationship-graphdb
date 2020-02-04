const { ConfigNotFound, InvalidMode } = require('../base/errors');
require('dotenv').config();

const NEO4J_MODE = {
  single: true,
  cluster: true
};

const MESSAGE = {
  domain: "This configuration doesn't exist",
  user: "This configuration doesn't exist",
  password: "This configuration doesn't exist",
  domain: "This configuration doesn't exist",
}

const loadConfig = () => {
  const domain = process.env.NEO4J_DOMAIN;
  const user = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;
  const mode = process.env.NEO4J_MODE;

  const configuration = { domain, user, password, mode };

  for (let config of Object.keys(configuration)) {
    if (isInvalid(configuration[config])) {
      throw new ConfigNotFound(MESSAGE[config])
    }
  }

  if (!isValidMode(mode)) {
    throw new InvalidMode();
  }

  return configuration;
}

const isInvalid = str => str === undefined;
const isValidMode = mode => NEO4J_MODE[mode] || false;

const config = () => {
  const config = loadConfig();
  return config;
}

module.exports = config
