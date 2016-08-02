const stream = require('stream');


class TransformStream extends stream.Transform {
  constructor(headers) {
    super({
      objectMode: true
    });
    this.headers = headers
  }

  _transform(array, encoding, callback) {
    try {
      let data = {}
      Object.keys(this.headers).forEach((key) => {
        const parseOption = this.headers[key]
        const rawValue = array[this.headers[key].position]
        data[key] = parseField(rawValue, parseOption)
      });
      this.push(data)
      callback();
    } catch(e) {
      callback(e)
    }
  }
}

function parseField(rawValue, parseOption) {
  switch (parseOption.type) {
    case 'integer':
      return parseInt(rawValue)
    case 'boolean':
      if(rawValue === "Oui") return true;
      if(rawValue === "Non") return false;
      throw new Error("Impossible to parse the boolean : \"" + rawValue + "\"")
    case 'array':
      return rawValue
                .split(';')
                .map((item) => { return item.trim() })
    default:
      return rawValue;
  }

}

module.exports = TransformStream
