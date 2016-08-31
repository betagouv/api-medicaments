const expect = require('chai').expect
const MedicamentsService = require('./../medicaments.service')
const StandardError = require('standard-error')
const sinon = require('sinon')



describe('Medicaments service', () => {
  const options = {
    medicaments: {
    }
  }

  let medicamentsService = new MedicamentsService(options);

  describe("When getting a medicaments by its cis",  () => {

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
      const doc = { cis, nom:'doliprane' }
      beforeEach(() => {
        options.medicaments[cis] = doc
        medicamentsService = new MedicamentsService(options);
      })

      it('return the doc', (done) => {
        medicamentsService.getByCis(cis)
          .then((result) => {
            expect(result).to.deep.equal(doc)
            done()
          })
          .catch(done)
      });
    })
  });

  describe("When searching medicaments by their names",  () => {

    const cis = '45678873'
    const doc = { cis, nom:'DOLIPRANE 500 mg, comprimé' }
    beforeEach(() => {
      options.medicaments[cis] = doc
      medicamentsService = new MedicamentsService(options);
    })

    describe("there is no match",  () => {
      it('return an empty list', (done) => {

        medicamentsService.getByName('ibuprofen')
          .then((result) => {
            expect(result).to.deep.equal([])
            done()
          })
          .catch(done)
      });
    })

    describe("there is match",  () => {
      it('return matched records', (done) => {
        medicamentsService.getByName('doliprane')
          .then((result) => {
            expect(result).to.deep.equal([{ cis, _score: 0.5, nom:'DOLIPRANE 500 mg, comprimé' }])
            done()
          })
          .catch(done)
      });
    })
  })
});
