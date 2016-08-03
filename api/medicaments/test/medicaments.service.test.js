const expect = require('chai').expect
const MedicamentsService = require('./../medicaments.service')
const couchbase = require('couchbase-promises')
const StandardError = require('standard-error')


describe('Medicaments API', () => {
  const cluster = new couchbase.Cluster('couchbase://127.0.0.1');
  const bucket = cluster.openBucket('medicamentsTests');
  const medicamentsService = new MedicamentsService({ bucket});


  describe("When getting a medicaments by its cis",  () => {
    describe("the document does't exist",  () => {


      it('return an error', (done) => {
        medicamentsService.getByCis('45678873')
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
});
