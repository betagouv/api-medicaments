
var express = require('express');
var Controller = require('./system.controller');

var router = express.Router();

module.exports = function(options){
  var systemController = new Controller(options);

  router.get('/ping', systemController.ping);

  return router
}
