const TransformStream = require('../TransformStream')
const expect = require('chai').expect
const MemoryStream = require('memorystream');


describe('the parser file', () => {

  let memStream;
  beforeEach(() => {
    memStream = new MemoryStream(undefined, { objectMode: true, writable: true, readable: false});
  })

  describe('when there is no config', () => {
    it('return the empty object', (done) => {
      const array = ["toto", "tutu"]
      const config = {
        mapping: {}
      }
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({});
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a string field', () => {
    it('return the string', (done) => {
      const array = ["toto", "tutu"]
      const config = { mapping: { nom : {position: 1}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({nom: 'tutu' });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a integer field', () => {
    it('return the string', (done) => {
      const array = ["34", "toto", "tutu"]
      const config = { mapping: { id : { position: 0, type: 'integer'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({id: 34 });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a float field', () => {
    it('return the string', (done) => {
      const array = ["34.89", "toto", "tutu"]
      const config = { mapping: { id : { position: 0, type: 'float'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({id: 34.89 });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a array field', () => {
    it('return the string', (done) => {
      const array = ["34", "toto; tata", "tutu"]
      const config = { mapping: { voie : { position: 1, type: 'array'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({ voie: ['toto', 'tata'] });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a enum field', () => {
    it('return the correct', (done) => {
      const array = ["34", "toto; tata", "tutu"]
      const config = { mapping: { voie : {
        position: 2,
        type: 'enum',
        options: {
          'tutu': 'prout',
          'toto': 'proot',
        }
      }}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({ voie: 'prout' });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })
  })

  describe('when there is a boolean field', () => {
    it('return the true when "Oui"', (done) => {
      const array = ["34", "toto, tata", "Oui"]
      const config = { mapping: { boolean : { position: 2, type: 'boolean'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({ boolean: true });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })

    it('return the false when "Non"', (done) => {
      const array = ["34", "toto, tata", "Non"]
      const config = { mapping: { boolean : { position: 2, type: 'boolean'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({ boolean: false });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })

    it('return the true when "oui"', (done) => {
      const array = ["34", "toto, tata", "oui"]
      const config = { mapping: { boolean : { position: 2, type: 'boolean'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({ boolean: true });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })

    it('return the false when "non"', (done) => {
      const array = ["34", "toto, tata", "non"]
      const config = { mapping: { boolean : { position: 2, type: 'boolean'}}}
      const transformStream = new TransformStream(config)
      transformStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0].data).to.deep.equal({ boolean: false });
          done();
        })
      transformStream.write(array)
      transformStream.end()
    })

    it('throw an error when is not defined', (done) => {
      const array = ["34", "toto, tata", "nond"]
      const config = { mapping: { boolean : { position: 2, type: 'boolean'}}}
      const transformStream = new TransformStream(config)
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
