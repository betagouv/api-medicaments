const fs = require('fs');
const parse = require('csv-parse');
const iconv = require('iconv-lite');
const TransformStream = require('./TransformStream')
const WriterStream = require('./StreamWriter')

module.exports = function() {
  const fileName = 'CIS_bdpm'
  const headers = require('./config/'+ fileName)
  const decoder = iconv.decodeStream('win1252')
  const input = fs.createReadStream(__dirname + '/../data/'+ fileName +'.txt')
  const transform = new TransformStream(headers)
  const writer = new WriterStream()
  const parser = parse({
    delimiter: '\t',
    relax: true
  })
  const startTimestamp = new Date().getTime()
  console.log(`import ${fileName}...`)
  input
    .pipe(decoder)
    .pipe(parser)
    .pipe(transform)
    .pipe(writer)
    .on('finish', () => {
      const duration = new Date().getTime() - startTimestamp
      console.log(`in ${duration} seconds`)
      process.exit(0)
    })
}
