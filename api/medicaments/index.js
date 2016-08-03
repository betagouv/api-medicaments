
var express = require('express');
var Controller = require('./medicaments.controller');

var router = express.Router();

module.exports = function(options){
  var medicamentsController = new Controller(options);

  router.get('/:cis', medicamentsController.get);

  return router
}
