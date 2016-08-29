const StandardError = require('standard-error')


class MedicamentsService {

  constructor(options) {
    this.medicaments = options.medicaments
    this.client = options.es.client
    this.indice = options.es.index
  }

  getByCis(cis) {
    const med = this.medicaments[cis]
    if(med) return Promise.resolve(med)
    else return Promise.reject(new StandardError("Le medicament n'a pas été trouvé", {code: 404}))
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

  search(q){
    return this.client.search({
      index: this.indice,
      q
    }).then((results) => {
      return results.hits.hits.map(a => a._source.doc)
    })
  }
}


module.exports = MedicamentsService
