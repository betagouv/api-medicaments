const insertFile = require('./insertFile');

module.exports = function(callback) {
  const fileName = 'CIS_bdpm'
  insertFile({
    name: fileName,
    path: __dirname + '/../data/'+ fileName +'.txt'
  }, callback)
}
