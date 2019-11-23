const StandardError = require('standard-error')
const TextIndex = require('../search/index/Text')
const { clone } = require('lodash')

class MedicamentsService {

  constructor(options) {
    this.medicaments = options.medicaments
    this.nameIndex = new TextIndex('nom', {ref: 'cis'})
    const medicamentsAsArray = Object.keys(this.medicaments)
                                  .map((key) =>  this.medicaments[key])
    this.nameIndex.load(medicamentsAsArray)
	// CIP index
	var cipIndex = {};
	medicamentsAsArray.forEach(function(med){
		const cis = med['cis'];
		if ('presentation' in med) {
		med['presentation'].forEach(function(pres) {
			if (pres['CIP13']) cipIndex[pres['CIP13']] = cis;
		});
		}
	  });
	this.cipIndex = cipIndex;
  }

  getByCis(cis) {
    const med = this.medicaments[cis]
    if(med) return Promise.resolve(med)
    else return Promise.reject(new StandardError("Le medicament n'a pas été trouvé", {code: 404}))
  }

  getByName(name){
    const results = this.nameIndex
            .find(name)
            .map((item) => {
              const result = clone(this.medicaments[item.ref])
              result._score = item.score
              return result
            })

    return Promise.resolve(results)
  }


  getByCIP13(cip){
	  return this.getByCis(this.cipIndex[cip])
  }
}


module.exports = MedicamentsService
