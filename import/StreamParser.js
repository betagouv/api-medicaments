const iconv = require('iconv-lite');
const stream = require('stream');


class ParseStream extends stream.Transform {
  constructor(headers) {
    super({
      objectMode: true
    });
    this.headers = headers
  }

  _transform(chunk, encoding, callback) {
    const line = decodeFromBinary(chunk)
    const fields = line.split('\t');
    let data = {}
    Object.keys(this.headers).forEach((key) => {
      const parseOption = this.headers[key]
      const rawValue = fields[this.headers[key].position]
      data[key] = parseField(rawValue, parseOption)
    });
    this.push(data)
    callback();
  }
}


function decodeFromBinary(data) {
  return iconv.decode(Buffer.from(data) ,'iso-8859-1')
}

function parseField(rawValue, parseOption) {
  switch (parseOption.type) {
    case 'integer':
      return parseInt(rawValue)
    case 'array':
      return rawValue
                .split(';')
                .map((item) => { return item.trim() })
    default:
      return rawValue;
  }

}

module.exports = ParseStream
