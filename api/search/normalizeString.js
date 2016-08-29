const removeDiacritics = require('./removeDiacritics');
const lunr = require('lunr');

function normalizeString(nom) {
  return removeDiacritics(nom)
    .toLowerCase()
}

lunr.Pipeline.registerFunction(normalizeString, 'normalizeString');

module.exports = normalizeString;
