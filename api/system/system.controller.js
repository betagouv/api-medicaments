'use strict';

class SystemController {

  ping(req, res) {
    return res.json('pong')
  }
}

module.exports = SystemController;
