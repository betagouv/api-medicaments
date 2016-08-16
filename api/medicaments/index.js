
var express = require('express');
var Controller = require('./medicaments.controller');

var router = express.Router();

module.exports = function(options){
  const medicamentsController = new Controller(options);

  router.get('/:cis', medicamentsController.get.bind(medicamentsController));
  router.get('/', medicamentsController.getByName.bind(medicamentsController));

  return router
}
