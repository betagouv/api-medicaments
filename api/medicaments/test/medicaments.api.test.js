const expect = require('chai').expect;
const serverTest = require('./../../test/utils/server');


describe('Medicaments API', () => {
  const server = serverTest();
  const api = server.api
  const bucket = server.bucket

  describe("When requesting /api/medicaments/:cis",  () => {

    const cis = '45678873'
    const doc = { cis }

    beforeEach((done) => {
      bucket.upsert(cis, doc, done)
    })

    it('replies the correct document', (done) => {
      api()
        .get('/api/medicaments/' + cis)
        .expect("content-type", /json/)
        .expect(200, doc, done)
    });
  });

  describe("When requesting /api/medicaments",  () => {

    describe("with correct query",  () => {

      it('replies with code 200', (done) => {
        api()
          .get('/api/medicaments?nom=test')
          .expect(200, done)
      });
    });

    describe("with incorrect query",  () => {

      it('replies with code 400', (done) => {
        api()
          .get('/api/medicaments')
          .expect(400, done)
      });
    });


  });
});
