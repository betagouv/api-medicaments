const StreamWriter = require('../StreamWriter')
const expect = require('chai').expect
const couchbase = require('couchbase')
const async = require('async')
const N1qlQuery = couchbase.N1qlQuery;


describe('the writer file', () => {
  const bucketName = 'medicamentsTests'
  let bucket;
  let cbCluster;



  beforeEach(() => {
    cbCluster = new couchbase.Cluster('couchbase://127.0.0.1:8091');
    bucket = cbCluster.openBucket(bucketName);
  })

  beforeEach((done) => {
    const query = N1qlQuery.fromString("CREATE PRIMARY INDEX ON `" + bucketName + "` USING GSI;");
    bucket.query(query,done)
  })

  beforeEach((done) => {
    const query = N1qlQuery.fromString("SELECT cis FROM "+ bucketName);
    bucket.query(query, (err, results) => {
      if(err) return done(err)
      async.each(results, (result, callback) => {
        bucket.remove(result.cis, callback);
      }, done);
    })
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

  describe('when inserting a leaf object', () => {
    const baseDoc = { cis: '1234', data: 'toto'}
    describe('when the base object exist', () => {
      beforeEach((done) => {
        bucket.upsert(baseDoc.cis, baseDoc, done)
      })

      describe('when the key is a object', () => {
        it('adds the object to the base object under the correct key', (done) => {
          const key = {name:'tutu', type: 'object'}
          const leafdoc = { cis: '1234', data: 'titi'}
          const streamWriter = new StreamWriter(cbCluster, bucketName)
          streamWriter
            .on('finish', () => {
              bucket.get(leafdoc.cis, function(err, result) {
                if (err) return  done(err);
                expect(result.value[key.name]).to.deep.equal(leafdoc);
                done();
              });
            })
          streamWriter.write({key, data: leafdoc})
          streamWriter.end()
        })
      })

      describe('when the key is a array', () => {
        it('create an array to the base object under the correct key', (done) => {
          const key = {name:'tutu', type: 'array'}
          const leafdoc = { cis: '1234', data: 'titi'}
          const streamWriter = new StreamWriter(cbCluster, bucketName)
          streamWriter
            .on('finish', () => {
              bucket.get(leafdoc.cis, function(err, result) {
                if (err) return  done(err);
                expect(result.value[key.name][0]).to.deep.equal(leafdoc);
                done();
              });
            })
          streamWriter.write({key, data: leafdoc})
          streamWriter.end()
        })

        describe('when there is already a data', () =>  {
          it('create an array to the base object under the correct key', (done) => {
            const key = {name:'tutu', type: 'array'}
            const leafdoc1 = { cis: '1234', data: 'titi'}
            const leafdoc2 = { cis: '1234', data: 'koko'}
            const streamWriter = new StreamWriter(cbCluster, bucketName)
            streamWriter
              .on('finish', () => {
                bucket.get(leafdoc2.cis, function(err, result) {
                  if (err) return  done(err);
                  expect(result.value[key.name][1]).to.deep.equal(leafdoc2);
                  done();
                });
              })
            streamWriter.write({key, data: leafdoc1})
            streamWriter.write({key, data: leafdoc2})
            streamWriter.end()
          })
        })
      })
    })

    describe('when the base object does\'nt exist', () => {

      it('add the object nonetheless', (done) => {
        const key = 'tutu'
        const leafdoc = { cis: '5678', data: 'titi'}
        const streamWriter = new StreamWriter(cbCluster, bucketName)
        const CouchbaseError = couchbase.CouchbaseError;
        streamWriter
        .on('finish', () => {
          bucket.get(leafdoc.cis, function(err, result) {
            if (err) return  done(err);
            expect(result.value[key.name]).to.deep.equal(leafdoc);
            done();
          });
        })
        streamWriter.write({key, data: leafdoc})
        streamWriter.end()
      })
    })

    describe('when couchbase is not correcly configured', () => {

      it('an error is throw', (done) => {
        const key = 'tutu'
        const leafdoc = { cis: '5678', data: 'titi'}
        const streamWriter = new StreamWriter(new couchbase.Cluster('couchbase://127.0.0.1:5677'), bucketName)
        const CouchbaseError = couchbase.CouchbaseError;
        streamWriter
          .on('error', (err) => {
            expect(err.message).to.exist;
            done();
          })
        streamWriter.write({key, data: leafdoc})
        streamWriter.end()
      })
    })
  })
})
