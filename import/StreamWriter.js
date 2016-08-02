const iconv = require('iconv-lite');
const stream = require('stream');
const couchbase = require('couchbase');



class WriterStream extends stream.Writable {
  constructor(  cbCluster = new couchbase.Cluster('couchbase://127.0.0.1:8091'),
                bucket = 'medicaments') {
    super({
      objectMode: true
    });
    this.bucket = cbCluster.openBucket(bucket);
  }

  _write(chunk, encoding, callback) {
    this.bucket.upsert(chunk.data.cis, chunk.data, function(err, res) {
      callback(err);
    });
  }
}

module.exports = WriterStream
