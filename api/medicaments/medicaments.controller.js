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

  getByName(req, res, next) {
    this.medicamentsService.getByName(req.query.nom)
      .then((result) => {
        return res.json(result)
      })
      .catch(next)
  }
}

module.exports = MedicamentsController;
