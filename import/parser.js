const readline = require('readline')


module.exports = function(inputStream, parserStream) {
  const rl = readline.createInterface({
    input: inputStream
  });

  rl.on('line', (line) => {
    parserStream.write(line)
  })

  return parserStream;
}
