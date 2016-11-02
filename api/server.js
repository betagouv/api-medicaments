'use strict';

const http = require('http');
const express = require('express');
const StandardError = require('standard-error');
const emptylogger = require('bunyan-blackhole');
const expressBunyanLogger = require("express-bunyan-logger");
const cors = require('cors');
const formatError = require('./lib/middlewares/formatError')
const routes = require('./routes');

module.exports = Server;

function Server (options) {
  var self = this;
  options = options || {};
  options.port = options.port || 0;
  options.medicaments = require(options.medicamentsPath)
  options.logger = options.logger || emptylogger();
  var logger = options.logger
  var app = express();
  app.set('port', options.port);
  app.set('json spaces', 2);
  app.disable('x-powered-by');
  app.use(cors());
  app.use('/doc', express.static(__dirname + '/swagger'));

  app.get('/', (req, res) => {
    res.redirect('https://api.gouv.fr/explorer/medicapi/');
  });

  app.use(expressBunyanLogger({
    name: "requests",
    logger: logger
  }));

  app.use((req, res, next) => {
    req.logger = logger;
    next();
  })

  routes.configure(app, options);

  app.use(function notFound(req, res, next) {
    next(new StandardError('no route for URL ' + req.url, {code: 404}));
  });

  app.use(formatError);

  this.getPort = function() {
    return this.port;
  };

  var server = http.createServer(app);
  this.start = function (onStarted) {
    server.listen(app.get('port'), function (error) {
      if (error) {
        logger.error({error: error}, 'Got error while starting server');
        return onStarted(error);
      }
      self.port = server.address().port;
      app.set('port', self.port);
      logger.info({
        event: 'server_started',
        port: self.port
      }, 'Server listening on port', self.port);
      onStarted();
    });
  };

  this.stop = function (onStopped) {
    logger.info({
      event: 'server_stopping'
    }, 'Stopping server');
    server.close(function (error) {
      onStopped(error);
    });
  }
}
