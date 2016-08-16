const expect = require('chai').expect
const StandardError = require('standard-error')
const medicamentsValidation = require('./../medicaments.validation')


describe('Medicaments validation', () => {

  const res = null

  describe('when requesting an medicament by name', () => {

    function createReq(name){
      return {
        query: {
          nom: name
        }
      }
    }

    it("should return an error if no name query parameter", (done) => {
      const req = createReq(null)

      function next(err){
        expect(err).to.exist
        expect(err).to.deep.equal(new StandardError("le paramètre nom est requis",{code:400}))
        done()
      }

      medicamentsValidation.getByName(req, res, next)
    })

    it("should return no error with the name parameters", (done) => {
      const req = createReq("doliprane")

      function next(err){
        expect(err).to.not.exist
        done(err)
      }

      medicamentsValidation.getByName(req, res, next)
    })
  })

  describe('when requesting an medicament by name', () => {

    function createSearch(q){
      return {
        query: {
          q
        }
      }
    }

    it("should return an error if no name query parameter", (done) => {
      const req = createSearch(null)

      function next(err){
        expect(err).to.exist
        expect(err).to.deep.equal(new StandardError("le paramètre q est requis",{code:400}))
        done()
      }

      medicamentsValidation.search(req, res, next)
    })
  })

});
