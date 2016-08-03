'use strict';

class MedicamentsController {

  get(req, res) {
    const cis = req.params.cis
    return res.json('pong')
  }
}

module.exports = MedicamentsController;
