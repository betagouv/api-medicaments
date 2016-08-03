const system = require('./../system')
const medicaments = require('./../medicaments')

exports.configure = function (app, options) {
  app.use('/api', system(options));
  app.use('/api/medicaments', medicaments(options));

};
