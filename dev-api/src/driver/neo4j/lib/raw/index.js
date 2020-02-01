const { getData, format, collectAndRemoveDuplicate } = require('../../../../api/utils');
const { capitalize } = require('lodash');
const removeEmptyLines = require("remove-blank-lines");

const executeRawQuery = driver => (query) => {
  const session = driver.session();

  return session.run(query)
    .then(result => {
      session.close();
      return result.records;
    }).catch(err => {
      console.log('err', err);
      return { response: false, err: err.toString() }
    })
};


module.exports = {
  executeRawQuery
}
