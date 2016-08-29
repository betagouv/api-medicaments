const normalizeString = require('../normalizeString');
const lunr = require('lunr');

class TextIndex {
  constructor(key, options = {}) {
    if (!key) throw new Error('key is required');
    this._key = key;
    const refKey = this._refKey = options.ref || 'id';
    this._index = lunr(function () {
      this.field(key);
      this.ref(refKey);

      this.pipeline.add(normalizeString);
    });
  }

  index(item) {
    if (this._key in item) {
      this._index.add(item);
    }
  }

  load(items = []) {
    items.forEach(item => this.index(item));
  }

  find(terms, options = {}) {
    return this._index.search(terms)
  }
}

module.exports = TextIndex;
