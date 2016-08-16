const expect = require('chai').expect;
const serverTest = require('./../../test/utils/server');


describe('Medicaments API', () => {
  const server = serverTest();
  const api = server.api
  const bucket = server.bucket
  const client = server.client

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

    const doc = {nom: 'doliprane'}

    beforeEach((done) => {
      client.create({
        index: server.esIndice,
        type: server.esIndice,
        refresh: true,
        body: {doc}
      },done)
    })

    describe("with correct query",  () => {

      it('replies with code 200 and matching medecines as body', (done) => {
        api()
          .get('/api/medicaments?nom=doliprane')
          .expect(200, [doc], done)
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


  describe("When requesting /api/medicaments/search",  () => {

    const doc = {composant: 'doliprane'}

    beforeEach((done) => {
      client.create({
        index: server.esIndice,
        type: server.esIndice,
        refresh: true,
        body: {doc}
      },done)
    })

    describe("with correct query",  () => {
      it('replies with code 200 and matching medecines as body', (done) => {
        api()
          .get('/api/medicaments/search?q=doliprane')
          .expect(200, [doc], done)
      });
    });

    describe("with incorrect query",  () => {

      it('replies with code 400', (done) => {
        api()
          .get('/api/medicaments/search')
          .expect(400, done)
      });
    });
  });
});
