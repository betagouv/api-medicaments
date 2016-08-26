const fs = require('fs');
const parse = require('csv-parse');
const iconv = require('iconv-lite');
const TransformStream = require('./TransformStream')
const WriterStream = require('./StreamWriter')


module.exports = function({
                            name,
                            path,
                            db
                          }, callback) {
  const headers = require('./config/'+ name)
  const decoder = iconv.decodeStream('win1252')
  const input = fs.createReadStream(path)
  const transform = new TransformStream(headers)
  const writer = new WriterStream(db)
  const parser = parse({
    delimiter: '\t',
    relax: true
  })
  console.log(`import ${name}...`)
  input
    .pipe(decoder)
    .pipe(parser)
    .pipe(transform)
    .pipe(writer)
    .on('finish', callback)
}
