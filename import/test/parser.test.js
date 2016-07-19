const ParserStream = require('../StreamParser')
const expect = require('chai').expect
const MemoryStream = require('memorystream');
const fs = require('fs')


describe('the parser file', () => {

  let memStream;
  beforeEach(() => {
    memStream = new MemoryStream(undefined, { objectMode: true, writable: true, readable: false});
  })

  describe('when there is no headers', () => {
    it('return the empty object', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutanée	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Non"
      const headers = {}
      const parserStream = new ParserStream(headers)
      parserStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({});
          done();
        })
      parserStream.write(line)
      parserStream.end()
    })
  })

  describe('when there is a string field', () => {
    it('return the string', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutanée	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Non"
      const headers = { nom : {position: 1}}
      const parserStream = new ParserStream(headers)
      parserStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({nom: 'A 313 200 000 UI POUR CENT, pommade' });
          done();
        })
      parserStream.write(line)
      parserStream.end()
    })
  })

  describe('when there is a integer field', () => {
    it('return the string', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutanée	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Non"
      const headers = { id : { position: 0, type: 'integer'}}
      const parserStream = new ParserStream(headers)
      parserStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({id: 61266250 });
          done();
        })
      parserStream.write(line)
      parserStream.end()
    })
  })

  describe('when there is a array field', () => {
    it('return the string', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutane; oral	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Non"
      const headers = { voie : { position: 3, type: 'array'}}
      const parserStream = new ParserStream(headers)
      parserStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({ voie: ['cutane', 'oral'] });
          done();
        })
      parserStream.write(line)
      parserStream.end()
    })
  })

  describe('when there is a boolean field', () => {
    it('return the true when "Oui"', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutane; oral	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Oui"
      const headers = { boolean : { position: 11, type: 'boolean'}}
      const parserStream = new ParserStream(headers)
      parserStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({ boolean: true });
          done();
        })
      parserStream.write(line)
      parserStream.end()
    })

    it('return the false when "Non"', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutane; oral	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Non"
      const headers = { boolean : { position: 11, type: 'boolean'}}
      const parserStream = new ParserStream(headers)
      parserStream
        .pipe(memStream)
        .on('finish', () => {
          expect(memStream.queue[0]).to.deep.equal({ boolean: false });
          done();
        })
      parserStream.write(line)
      parserStream.end()
    })

    it('return null when is not defined', (done) => {
      const line = "61266250	A 313 200 000 UI POUR CENT, pommade	pommade	cutane; oral	Autorisation active	Procédure nationale	Commercialisée	12/03/1998			 PHARMA DEVELOPPEMENT	Nond"
      const headers = { boolean : { position: 11, type: 'boolean'}}
      const parserStream = new ParserStream(headers)
      parserStream
        .on('error', (err) => {
          expect(err).to.deep.equal(new Error("Impossible to parse the boolean : \"Nond\""));
          done();
        })
        .pipe(memStream)
      parserStream.write(line)
      parserStream.end()
    })
  })
})
