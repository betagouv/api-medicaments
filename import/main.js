const readline = require('readline')
const fs = require('fs');

const ParserStream = require('./StreamParser')
const WriterStream = require('./StreamWriter')
const parse = require('./parser')

module.exports = function() {
  const fileName = 'CIS_bdpm'
  const headers = require('./config/'+ fileName)
  const inputStream = fs.createReadStream(__dirname + '/../data/'+ fileName +'.txt')
  const parserStream = new ParserStream(headers)
  const writerStream = new WriterStream()

  parse(inputStream, parserStream)
    .pipe(writerStream)
}
