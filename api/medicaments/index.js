
const express = require('express');
const Controller = require('./medicaments.controller');
const validation = require('./medicaments.validation');

var router = express.Router();

module.exports = function(options){
  const medicamentsController = new Controller(options);
  router.get('/search', validation.search, medicamentsController.search.bind(medicamentsController));
  router.get('/:cis', medicamentsController.get.bind(medicamentsController));

  router.get('/', validation.getByName, medicamentsController.getByName.bind(medicamentsController));

  return router
}
