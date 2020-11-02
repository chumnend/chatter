'use strict';

const createError = (status, message, extra = null) => {
  const error = new Error(message);
  error.status = status;
  error.extra = extra;

  return error;
};

module.exports = createError;
