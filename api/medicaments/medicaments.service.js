const StandardError = require('standard-error')
const couchbase = require('couchbase-promises')



class MedicamentsService {
  constructor(options) {
    this.bucket = options.cb.bucket
  }

  getByCis(cis) {
    return this.bucket.getAsync(cis)
      .then(function(result) {
        return result.value
      }).catch(couchbase.Error, function(e) {
        if (e.code === couchbase.errors.keyNotFound)
          throw new StandardError("Le medicament n'a pas été trouvé", {code: 404})
        throw e;
      });
  }
}


module.exports = MedicamentsService
