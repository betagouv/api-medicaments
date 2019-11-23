const StandardError = require('standard-error')


const medicamentsValidation = {
  getByQuery
}

function getByQuery(req,res,next){
  if ((!req.query.nom) && (!req.query.CIP13)){
    return next(new StandardError("un des paramètres nom ou CIP13 est requis", { code: 400 }))
  }
  next()
}

module.exports = medicamentsValidation
