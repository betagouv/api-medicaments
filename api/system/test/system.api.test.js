const expect = require('chai').expect;
const serverTest = require('./../../test/utils/server');


describe('System API', () => {
  var server = serverTest();
  var api = server.api;

  describe("When requesting /api/ping",  () => {
    it('replies json with pong in json', (done) => {
      api()
        .get('/api/ping')
        .expect("content-type", /json/)
        .expect(200,"\"pong\"",done)
    });
  });

  describe("When requesting a bad route", () => {
    it('replies 404', function (done) {
      api()
        .get('/api/not-existing')
        .expect(404,done)
    });
  });
});
