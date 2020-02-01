const neo4j = require('neo4j-driver').default;

const newsApi = require('./lib/news');
const entityApi = require('./lib/entity');
const locationApi = require('./lib/location');
const rawQuery = require('./lib/raw');

const apis = { ...newsApi, ...entityApi, ...locationApi, ...rawQuery  };

/**
 *
 * @param {string} config.domain - IP:port or domain:port of a neo4j server
 * @param {string} config.mode - neo4j database mode: single|cluster
 * @returns {string} uri of neo4j server
 */
const getUri = (domain, mode) => {
  let uri = {
    'single': `bolt://${domain}`,
    'cluster': `neo4j://${domain}`
  }

  return uri[mode];
}


const driver = ({ domain, user, password, mode }) => {
  let uri = getUri(domain, mode);
  console.log('uri', uri);
  const internalDriver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  const apiName = Object.keys(apis);

  return apiName.reduce((acc, v) => ({ ...acc, [v]: apis[v](internalDriver) }), {});
}

module.exports = driver;
