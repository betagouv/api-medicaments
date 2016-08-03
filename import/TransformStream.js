const stream = require('stream');


class TransformStream extends stream.Transform {
  constructor(config) {
    super({
      objectMode: true
    });
    this.key = config.key
    this.headers = config.mapping
  }

  _transform(array, encoding, callback) {
    try {
      let data = {}
      Object.keys(this.headers).forEach((key) => {
        const parseOption = this.headers[key]
        const rawValue = array[this.headers[key].position]
        data[key] = parseField(rawValue, parseOption, key)
      });
      this.push({key: this.key, data})
      callback();
    } catch(e) {
      callback(e)
    }
  }
}

function parseField(rawValue, parseOption, key) {
  switch (parseOption.type) {
    case 'integer':
      return parseInt(rawValue)
    case 'float':
      return parseFloat(rawValue)
    case 'boolean':
      if(rawValue === "Oui" || rawValue === "oui") return true;
      if(rawValue === "Non" || rawValue === "non") return false;
      throw new Error("Impossible to parse the boolean : \"" + rawValue + "\"")
    case 'array':
      return rawValue
                .split(';')
                .map((item) => { return item.trim() })
    case 'enum':
      return parseOption.options[rawValue]
    default:
      return rawValue;
  }

}

module.exports = TransformStream
