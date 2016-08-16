const StandardError = require('standard-error')


const medicamentsValidation = {
  getByName,
  search
}

function getByName(req,res,next){
  if (!req.query.nom){
    return next(new StandardError("le paramètre nom est requis", { code: 400 }))
  }
  next()
}

function search(req,res,next){
  if (!req.query.q){
    return next(new StandardError("le paramètre q est requis", { code: 400 }))
  }
  next()
}

module.exports = medicamentsValidation
