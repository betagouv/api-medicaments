const expect = require('chai').expect;
const serverTest = require('./../../test/utils/server');


describe('Medicaments API', () => {
  var server = serverTest();
  var api = server.api;

  describe("When requesting /api/medicaments",  () => {
    it('replies in json', (done) => {
      api()
        .get('/api/medicaments/65648393')
        .expect("content-type", /json/)
        .expect(200, done)
    });
  });
});
