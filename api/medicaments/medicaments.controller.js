const MedicamentsService = require('./medicaments.service')

class MedicamentsController {
  constructor(options) {
    this.medicamentsService = new MedicamentsService(options)
  }
  get(req, res, next) {
    const cis = req.params.cis
    this.medicamentsService.getByCis(cis)
      .then((result) => {
        return res.json(result)
      })
      .catch(next)
  }

  getByQuery(req, res, next) {
	if (req.query.nom) {
		this.medicamentsService.getByName(req.query.nom)
		  .then((result) => {
			return res.json(result)
		  })
		  .catch(next)
    }
	else if (req.query.CIP13)  {
		this.medicamentsService.getByCIP13(req.query.CIP13)
		  .then((result) => {
			return res.json(result)
		  })
		  .catch(next)
	}
  }

}

module.exports = MedicamentsController;
