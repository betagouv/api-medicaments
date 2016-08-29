const iconv = require('iconv-lite');
const stream = require('stream');



class WriterStream extends stream.Writable {
  constructor(db) {
    super({
      objectMode: true
    });
    this.db = db
  }

  _write(chunk, encoding, callback) {
    const { key, data } = chunk
    const db = this.db;
    if(key) {
      db[data.cis] = addTheData(db[data.cis], key, data)
      callback()
    } else {
      db[data.cis] = data
      callback()
    }
  }
}

function addTheData(oldValue, key, data) {
  const newObject = oldValue || {}
  if(key.type === 'array') {
    if(!newObject[key.name]) {
      newObject[key.name] = []
    }
    newObject[key.name].push(data)
  } else {
    newObject[key.name] = data
  }
  return newObject
}

module.exports = WriterStream
