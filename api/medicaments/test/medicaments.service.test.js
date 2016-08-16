const expect = require('chai').expect
const MedicamentsService = require('./../medicaments.service')
const couchbase = require('couchbase-promises')
const StandardError = require('standard-error')
const deleteFromBucket = require('../../test/utils/deleteFromBucket')
const sinon = require('sinon')
const elasticsearch = require('elasticsearch')



describe('Medicaments service', () => {
  const cluster = new couchbase.Cluster('couchbase://127.0.0.1');
  const bucket = cluster.openBucket('medicamentsTests');
  const client = new elasticsearch.Client()
  const index = "medicaments"
  const options = {
    cb: {
      bucket
    },
    es: {
      client,
      index
    }
  }
  const medicamentsService = new MedicamentsService(options);

  let sandbox = null;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("When getting a medicaments by its cis",  () => {

    beforeEach((done) => {
      deleteFromBucket(bucket, 'medicamentsTests', done)
    })

    describe("the document does't exist",  () => {
      it('return an error', (done) => {
        medicamentsService.getByCis('45678873dsd')
          .then(() => {
            done(new Error('shouldn\'t succeed'))
          })
          .catch(function(e) {
            expect(e).to.deep.equal(new StandardError("Le medicament n'a pas été trouvé", {code: 404}))
            done()
          })
      });
    })

    describe("the document exist",  () => {

      const cis = '45678873'
      const doc = { cis }
      beforeEach((done) => {
        bucket.upsert(cis, doc, done)
      })

      it('return the doc', (done) => {
        medicamentsService.getByCis(cis)
          .then((result) => {
            expect(result).to.deep.equal(doc)
            done()
          })
          .catch(function(e) {
            done(e)
          })
      });
    })
  });

  describe("When searching medicaments by their names",  () => {
    function createEsResult(hits) {
      const data = hits.map(item => ({ _source: {doc: item}}))

      return {
          hits: { total: hits.length, hits: data
        }
      }
    }
    describe("there is no match",  () => {
      it('return an empty list', (done) => {
        const esResult = createEsResult([])

        sandbox.stub(client,"search").returns(Promise.resolve(esResult))
        medicamentsService.getByName('doliprane')
          .then((result) => {
            expect(result).to.deep.equal([])
            done()
          })
          .catch(done)
      });
    })

    describe("there is match",  () => {
      it('return matched records', (done) => {
        const esResult = createEsResult([ {test :'coucou'}]);

        const query = {
          index,
          body:{
            query:{
              match:{
                "doc.nom":'doliprane'
              }
            }
          }
        }

        sandbox.stub(client,"search").withArgs(query).returns(Promise.resolve(esResult))
        medicamentsService.getByName('doliprane')
          .then((result) => {
            expect(result).to.deep.equal([{test :'coucou'}])
            done()
          })
          .catch(done)
      });
    })

    describe("when there is a problem",  () => {
      it('return an error', (done) => {
        const error = new Error('Something went wrong')
        sandbox.stub(client,"search").returns(Promise.reject(error))
        medicamentsService.getByName('doliprane')
          .then((result) => {
            done(new Error('should not succeed'))
          })
          .catch((err) => {
            expect(err).to.deep.equal(error)
            done()
          })
      });
    })
  })

  describe("When searching medicaments globaly",  () => {
    function createEsResult(hits) {
      const data = hits.map(item => ({ _source: {doc: item}}))

      return {
          hits: { total: hits.length, hits: data
        }
      }
    }
    describe("there is no match",  () => {
      it('return an empty list', (done) => {
        const esResult = createEsResult([])

        sandbox.stub(client,"search").returns(Promise.resolve(esResult))
        medicamentsService.search('doliprane')
          .then((result) => {
            expect(result).to.deep.equal([])
            done()
          })
          .catch(done)
      });
    })

    describe("there is match",  () => {
      it('return matched records', (done) => {
        const esResult = createEsResult([ {test :'coucou'}]);

        const query = {
          index,
          q: 'doliprane'
        }

        sandbox.stub(client,"search").withArgs(query).returns(Promise.resolve(esResult))
        medicamentsService.search('doliprane')
          .then((result) => {
            expect(result).to.deep.equal([{test :'coucou'}])
            done()
          })
          .catch(done)
      });
    })
  })



});
