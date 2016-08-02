const insertFile = require('../insertFile')
const expect = require('chai').expect
const couchbase = require('couchbase')


describe('the full insert file', () => {
  const bucketName = 'medicamentsTests'
  let bucket;
  let cbCluster;

  beforeEach(() => {
    cbCluster = new couchbase.Cluster('couchbase://127.0.0.1:8091');
    bucket = cbCluster.openBucket(bucketName);
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
        bucket: bucketName
      }, () => {
        bucket.get(expectedDoc.cis, function(err, result) {
          if (err) return  done(err);
          expect(result.value).to.deep.equal(expectedDoc);
          done();
        });
      })
    })
  })
})
