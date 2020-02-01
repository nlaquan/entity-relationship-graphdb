const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { FileNotFoundException } = require('../base');

const loadConfig = () => {
  try {
    let yamlConfig = fs.readFileSync(path.resolve(__dirname, "config.yaml"), 'utf8');
    let config = yaml.safeLoad(yamlConfig);
    return config;
  } catch (e) {
    throw new FileNotFoundException(e.message);
  }
}

const config = () => {
  const config = loadConfig();
  return config;
}

module.exports = config
