const insertFile = require('./insertFile');
const async = require('async')
const couchbase = require('couchbase')

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
  const cbCluster = new couchbase.Cluster(options.cb.connectionString)
  
  const files = fileNames.map((item) => {
    return {
      name: item,
      path: __dirname + '/../data/'+ item +'.txt',
      cbCluster,
      bucket: options.cb.bucket
    }
  })
  async.eachSeries(files, insertFile, callback);
}
