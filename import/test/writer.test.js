const StreamWriter = require('../StreamWriter')
const expect = require('chai').expect
const async = require('async')


describe('the writer file', () => {
  let db;

  beforeEach(() => {
    db = {}
  })

  describe('when inserting the base object', () => {
    it('insert the base object', (done) => {
      const doc = { cis: '1234', data: 'toto'}
      const streamWriter = new StreamWriter(db)
      streamWriter
        .on('finish', () => {
          expect(db[doc.cis]).to.deep.equal(doc);
          done();
        })
      streamWriter.write({data: doc})
      streamWriter.end()
    })
  })

  describe('when inserting a leaf object', () => {
    const baseDoc = { cis: '1234', data: { name:'toto' }}
    describe('when the base object exist', () => {
      beforeEach(() => {
        db = {}
      })

      describe('when the key is a object', () => {
        it('adds the object to the base object under the correct key', (done) => {
          const key = {name:'tutu', type: 'object'}
          const leafdoc = { cis: '1234', field1: 'titi'}
          const streamWriter = new StreamWriter(db)
          streamWriter
            .on('finish', () => {
              expect(db[baseDoc.cis][key.name]).to.deep.equal(leafdoc);
              done()
            })
          streamWriter.write({key, data: leafdoc})
          streamWriter.end()
        })
      })

      describe('when the key is a array', () => {
        it('create an array to the base object under the correct key', (done) => {
          const key = {name:'tutu', type: 'array'}
          const leafdoc = { cis: '1234', data: 'titi'}
          const streamWriter = new StreamWriter(db)
          streamWriter
            .on('finish', () => {
              expect(db[baseDoc.cis][key.name][0]).to.deep.equal(leafdoc);
              done()
            })
          streamWriter.write({key, data: leafdoc})
          streamWriter.end()
        })

        describe('when there is already a data', () =>  {
          it('create an array to the base object under the correct key', (done) => {
            const key = {name:'tutu', type: 'array'}
            const leafdoc1 = { cis: '1234', data: 'titi'}
            const leafdoc2 = { cis: '1234', data: 'koko'}
            const streamWriter = new StreamWriter(db)
            streamWriter
              .on('finish', () => {
                expect(db[baseDoc.cis][key.name][1]).to.deep.equal(leafdoc2);
                done()
              })
            streamWriter.write({key, data: leafdoc1})
            streamWriter.write({key, data: leafdoc2})
            streamWriter.end()
          })
        })
      })
    })

    describe('when the base object does\'nt exist', () => {

      it('add the object nonetheless', (done) => {
        const key = {name:'tutu', type: 'object'}
        const leafdoc = { cis: '5678', data: 'titi'}
        const streamWriter = new StreamWriter(db)
        streamWriter
        .on('finish', () => {
          expect(db[leafdoc.cis][key.name]).to.deep.equal(leafdoc);
          done()
        })
        streamWriter.write({key, data: leafdoc})
        streamWriter.end()
      })
    })
  })
})
