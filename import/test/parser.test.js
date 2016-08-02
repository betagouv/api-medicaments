const TransformStream = require('../TransformStream')
const expect = require('chai').expect
const MemoryStream = require('memorystream');


describe('the parser file', () => {

  let memStream;
  beforeEach(() => {
    memStream = new MemoryStream(undefined, { objectMode: true, writable: true, readable: false});
  })

  describe('when there is no headers', () => {
    it('return the empty object', (done) => {
      const array = ["toto", "tutu"]
      const headers = {}
      const transformStream = new TransformStream(headers)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({});
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a string field', () => {
    it('return the string', (done) => {
      const array = ["toto", "tutu"]
      const headers = { nom : {position: 1}}
      const transformStream = new TransformStream(headers)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({nom: 'tutu' });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a integer field', () => {
    it('return the string', (done) => {
      const array = ["34", "toto", "tutu"]
      const headers = { id : { position: 0, type: 'integer'}}
      const transformStream = new TransformStream(headers)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({id: 34 });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a array field', () => {
    it('return the string', (done) => {
      const array = ["34", "toto; tata", "tutu"]
      const headers = { voie : { position: 1, type: 'array'}}
      const transformStream = new TransformStream(headers)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({ voie: ['toto', 'tata'] });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a boolean field', () => {
    it('return the true when "Oui"', (done) => {
      const array = ["34", "toto, tata", "Oui"]
      const headers = { boolean : { position: 2, type: 'boolean'}}
      const transformStream = new TransformStream(headers)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({ boolean: true });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })

    it('return the false when "Non"', (done) => {
      const array = ["34", "toto, tata", "Non"]
      const headers = { boolean : { position: 2, type: 'boolean'}}
      const transformStream = new TransformStream(headers)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({ boolean: false });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })

    it('throw an error when is not defined', (done) => {
      const array = ["34", "toto, tata", "nond"]
      const headers = { boolean : { position: 2, type: 'boolean'}}
      const transformStream = new TransformStream(headers)
      transformStream
        .on('error', (err) => {
          expect(err).to.deep.equal(new Error("Impossible to parse the boolean : \"Nond\""));
          done();
        })
        .pipe(memStream)
      transformStream.write(array)
      transformStream.end()
    })
  })
})
