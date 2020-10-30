'use strict';

// returns error message as json
module.exports = function (err, req, res, next) {
  return res.status(err.status || 500).json({
    message: err.message || 'something went wrong',
    extra: err.extra || null,
  });
};
