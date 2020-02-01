function FileNotFoundException(message) {
  this.message = message;
  Error.captureStackTrace(this, FileNotFoundException);
}

FileNotFoundException.prototype = Object.create(Error.prototype);
FileNotFoundException.prototype.name = 'FileNotFoundException';

module.exports = {
  FileNotFoundException
}
