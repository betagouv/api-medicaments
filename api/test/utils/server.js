const proxyquire = require('proxyquire');
const supertest = require('supertest');
const nock = require('nock')
const couchbase = require('couchbase-promises')
const deleteFromBucket = require('./deleteFromBucket')

var Server = require('../../server');


module.exports = function(){
  let server;
  const options = {
    "port": 4566,
    "appname": "api-medicament-test",
    "cb": {
      "connectionString": "couchbase://127.0.0.1",
      "bucketName": "medicamentsTests"
    }
  }

  options.port = process.env['SERVER_PORT_TEST'] || 4566;

  nock.enableNetConnect('localhost');

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

  const cluster = new couchbase.Cluster('couchbase://127.0.0.1');
  const bucket = cluster.openBucket(options.cb.bucketName);

  beforeEach((done) => {
    deleteFromBucket(bucket, options.cb.bucketName, done)
  })

  return {
    api,
    bucket
  }
};
