const proxyquire = require('proxyquire');
const supertest = require('supertest');
const nock = require('nock')
const options = require('../../defaults')


var Server = require('../../server');


module.exports = function(){
  let server;
  options.port = process.env['SERVER_PORT_TEST'] || 4566;

  nock.enableNetConnect('localhost');

  beforeEach((done) => {
    server = new Server(options);
    server.start(done)
  })
  afterEach((done) => {
    server.stop(done)
  })

  var api = function () {
    return supertest
      .agent('http://localhost:' + server.getPort());
  };
  return {
    api : api
  }
};
