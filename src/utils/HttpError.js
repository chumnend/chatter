'use strict';

function HttpError(status, message, extra = null) {
  this.status = status;
  this.message = message;
  this.extra = extra;
}

HttpError.prototype = Object.create(Error.prototype);

module.exports = HttpError;
