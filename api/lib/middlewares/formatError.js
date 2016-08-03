'use strict';
const S = require('string');
const StandardError = require('standard-error');
const http = require('http');

module.exports = function (err, req, res, next) {
  req.logger.error({error: err}, err.message);
  if (err.code) {
    if (err instanceof StandardError) {
      let error = {
        error: S(http.STATUS_CODES[err.code]).underscore().s,
        reason: err.message
      }
      return res.status(err.code).json(error)
    }
  }
  next(err);
}
