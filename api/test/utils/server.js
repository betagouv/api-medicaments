const proxyquire = require('proxyquire');
const supertest = require('supertest');

var Server = require('../../server');


module.exports = function(){
  let server;
  const options = {
    port: 4566,
    appname: "api-medicament-test",
    medicamentsPath: "./test/resources/medicaments",
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

  return {
    api
  }
};
