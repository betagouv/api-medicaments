const proxyquire = require('proxyquire');
const supertest = require('supertest');
const deleteFromIndex = require('./deleteFromIndex')
const elasticsearch = require('elasticsearch')

var Server = require('../../server');


module.exports = function(){
  let server;
  const options = {
    port: 4566,
    appname: "api-medicament-test",
    medicamentsPath: "./test/resources/medicaments",
    es: {
      "host": "127.0.0.1:9201",
      index: 'medicamentstest'
    }
  }

  options.port = process.env['SERVER_PORT_TEST'] || 4566;


  beforeEach((done) => {
    server = new Server(options);
    server.start(done)
  })
  afterEach((done) => {
    server.stop(done)
  })

  const api = function () {
    return supertest
      .agent('http://localhost:' + server.getPort());
  };

  const client = new elasticsearch.Client(options.es)

  beforeEach((done) => {
    deleteFromIndex(client, options.es.index, done)
  })

  return {
    api,
    client,
    esIndice: options.es.index
  }
};
