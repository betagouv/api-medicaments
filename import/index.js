const insertFile = require('./insertFile');
const async = require('async')
const fs = require('fs')

module.exports = function(options, callback) {
  const fileNames = [
    'CIS_bdpm',
    'CIS_CIP_bdpm',
    'CIS_COMPO_bdpm',
    'CIS_HAS_SMR_bdpm',
    'CIS_HAS_ASMR_bdpm',
    'CIS_GENER_bdpm',
    'CIS_CPD_bdpm'
  ]
  const db = {}

  const files = fileNames.map((item) => {
    return {
      name: item,
      path: __dirname + '/../data/'+ item +'.txt',
      db
    }
  })
  async.eachSeries(files, insertFile, (err) => {
    if(err) return callback(err);
    fs.writeFile(__dirname + '/../data/medicaments.json', JSON.stringify(db), callback);
  });
}
