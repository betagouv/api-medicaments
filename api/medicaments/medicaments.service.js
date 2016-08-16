const StandardError = require('standard-error')
const couchbase = require('couchbase-promises')


class MedicamentsService {
  constructor(options) {
    this.bucket = options.cb.bucket
    this.client = options.es.client
    this.indice = options.es.index
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

  getByName(name){
    const query = {
      index: this.indice,
      body:{
        query:{
          match:{
            "doc.nom": name
          }
        }
      }
    }
    return this.client.search(query).then((results) => {
      return results.hits.hits.map(a => a._source.doc)
    })
  }
}


module.exports = MedicamentsService
