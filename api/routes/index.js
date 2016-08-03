const system = require('./../system')

exports.configure = function (app, options) {
  app.use('/api', system(options));

};
