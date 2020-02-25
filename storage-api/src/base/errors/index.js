function FileNotFoundException(message) {
  this.message = message;
  Error.captureStackTrace(this, FileNotFoundException);
}

FileNotFoundException.prototype = Object.create(Error.prototype);
FileNotFoundException.prototype.name = 'FileNotFoundException';

function ConfigNotFound(message) {
  this.message = message;
  Error.captureStackTrace(this, ConfigNotFound);
}

ConfigNotFound.prototype = Object.create(Error.prototype);
ConfigNotFound.prototype.name = 'ConfigNotFoundException';

function InvalidMode() {
  this.message = "Mode only has 2 options: single or cluster";
  Error.captureStackTrace(this, InvalidMode);
}

InvalidMode.prototype = Object.create(Error.prototype);
InvalidMode.prototype.name = 'InvalidMode';

module.exports = {
  FileNotFoundException,
  ConfigNotFound,
  InvalidMode
}
