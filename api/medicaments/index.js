
const express = require('express');
const Controller = require('./medicaments.controller');
const validation = require('./medicaments.validation');

var router = express.Router();

module.exports = function(options){
  const medicamentsController = new Controller(options);
  router.get('/:cis', medicamentsController.get.bind(medicamentsController));

  router.get('/', validation.getByQuery, medicamentsController.getByQuery.bind(medicamentsController));

  return router
}
