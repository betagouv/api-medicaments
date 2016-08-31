const normalizeString = require('../normalizeString')
const expect = require('chai').expect

describe('normalizeString()', function() {
  describe('empty string', function() {
    it('should return an empty string.', function() {
      const result = normalizeString('');
      expect(result).to.equal('');
    });
  });

  describe('Upercase string', function() {
    it('should return a lowercase string.', function() {
      const result = normalizeString('ABC');
      expect(result).to.equal('abc');
      checkNormalization('ABC', 'abc')
    });
  });


  describe('Accent string', function() {
    it('should return a string without accent.', function() {
      checkNormalization('ÂÃÄÀÁÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäæçèéêëìíîïòóôöùûüýÿ',
                         'aaaaaaaeceeeeiiiinooooouuuuyaaaaaaeceeeeiiiioooouuuyy')

    });
  });

});

function checkNormalization(input, expected_result) {
  const result = normalizeString(input);
  expect(result).to.equal(expected_result);
}
