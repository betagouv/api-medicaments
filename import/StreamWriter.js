const iconv = require('iconv-lite');
const stream = require('stream');


class WriterStream extends stream.Writable {
  constructor() {
    super({
      objectMode: true
    });
  }

  _write(chunk, encoding, callback) {
    console.log('OUT : ' + JSON.stringify(chunk))
    callback();
  }
}

module.exports = WriterStream
