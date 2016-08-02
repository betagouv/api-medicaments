const StreamWriter = require('../StreamWriter')
const expect = require('chai').expect
const couchbase = require('couchbase')


describe('the writer file', () => {
  const bucketName = 'medicamentsTests'
  let bucket;
  let cbCluster;

  beforeEach(() => {
    cbCluster = new couchbase.Cluster('couchbase://127.0.0.1:8091');
    bucket = cbCluster.openBucket(bucketName);
  })


  describe('when inserting the base object', () => {
    it('insert the base object', (done) => {
      const doc = { cis: '1234', data: 'toto'}
      const streamWriter = new StreamWriter(cbCluster, bucketName)
      streamWriter
        .on('finish', () => {
          bucket.get(doc.cis, function(err, result) {
            if (err) return  done(err);
            expect(result.value).to.deep.equal(doc);
            done();
          });
        })
      streamWriter.write({data: doc})
      streamWriter.end()
    })
  })
})
