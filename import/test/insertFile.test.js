const insertFile = require('../insertFile')
const expect = require('chai').expect


describe('the full insert file', () => {
  const bucketName = 'medicamentsTests'
  let db;

  beforeEach(() => {
    db = {}
  })


  describe('when importing a file', () => {
    it('insert the object in db', (done) => {
      const expectedDoc = { cis: 'AAA',
        nom: 'A 313 200 000 UI POUR CENT, pommade',
        formePharmaceutique: 'pommade',
        voiesAdmnistration: [ 'cutanï¿½e' ],
        statusAutorisation: 'Autorisation active',
        typeAutorisation: 'Procï¿½dure nationale',
        etatCommercialisation: 'Commercialisï¿½e',
        dateMiseSurLeMarche: '12/03/1998',
        StatutBdm: '',
        numeroAutorisationEuropeen: '',
        titulaire: [ 'PHARMA DEVELOPPEMENT' ],
        surveillanceRenforcee: false
      }
      const fileName = 'CIS_bdpm';
      insertFile({
        name: fileName,
        path: __dirname + '/resources/' + fileName +'.txt',
        db
      }, (err) => {
          if(err) return done(err)
          expect(db[expectedDoc.cis]).to.deep.equal(expectedDoc);
          done();
      });
    })
  })
})
