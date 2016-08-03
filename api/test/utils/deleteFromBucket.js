const async = require('async')
const N1qlQuery = require('couchbase-promises').N1qlQuery

module.exports = function(bucket, bucketName, done) {
  const indexQuery = N1qlQuery.fromString("CREATE PRIMARY INDEX ON `" + bucketName + "` USING GSI;");
  bucket.query(indexQuery, (err) => {
    const query = N1qlQuery.fromString("SELECT cis FROM "+ bucketName);
    bucket.query(query, (err, results) => {
      if(err) return done(err)
      async.each(results, (result, callback) => {
        bucket.remove(result.cis, callback);
      }, done);
    })
  })
}
