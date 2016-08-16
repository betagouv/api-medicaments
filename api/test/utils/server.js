const proxyquire = require('proxyquire');
const supertest = require('supertest');
const couchbase = require('couchbase-promises')
const deleteFromBucket = require('./deleteFromBucket')
const deleteFromIndex = require('./deleteFromIndex')
const elasticsearch = require('elasticsearch')

var Server = require('../../server');


module.exports = function(){
  let server;
  const options = {
    "port": 4566,
    "appname": "api-medicament-test",
    "cb": {
      "connectionString": "couchbase://127.0.0.1",
      "bucketName": "medicamentsTests"
    },
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

  const cluster = new couchbase.Cluster(options.cb.connectionString);
  const bucket = cluster.openBucket(options.cb.bucketName);
  const client = new elasticsearch.Client(options.es)

  beforeEach((done) => {
    deleteFromBucket(bucket, options.cb.bucketName, done)
  })

  beforeEach((done) => {
    deleteFromIndex(client, options.es.index, done)
  })

  return {
    api,
    bucket,
    client,
    esIndice: options.es.index
  }
};
