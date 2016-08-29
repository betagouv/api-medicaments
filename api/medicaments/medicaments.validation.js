const StandardError = require('standard-error')


const medicamentsValidation = {
  getByName
}

function getByName(req,res,next){
  if (!req.query.nom){
    return next(new StandardError("le paramètre nom est requis", { code: 400 }))
  }
  next()
}

module.exports = medicamentsValidation
