const TextIndex = require('../index/Text')
const expect = require('chai').expect
const sinon = require('sinon')

describe('TextIndex', () => {
  describe('constructor', () => {
    describe('no key given', () => {
      it('should throw an error', () => {
        expect(() => new TextIndex()).to.throw(Error,'key is required');
      })
    })
  })

  describe('#index(item)', () => {
    let ind;
    beforeEach(() => {
      ind = new TextIndex('foo');
      sinon.spy(ind._index, "add");
    });

    afterEach(() => {
      ind._index.add.restore()
    })

    describe('item without indexed key', () => {
      it('should not call _index.add', () => {
        ind.index({ id: '1', bar: 'lol' });
        expect(ind._index.add.called).to.be.false;
      });
    });
    describe('item with indexed key', () => {
      it('should call _index.add once', () => {
        ind.index({ id: '1', foo: 'bar' });
        expect(ind._index.add.calledOnce).to.be.true;
        expect(ind._index.add.getCall(0).args[0]).to.eql({ id: '1', foo: 'bar' });
      });
    });
  });

  describe('#load(items)', () => {
    let ind;
    beforeEach(() => {
      ind = new TextIndex('foo');
      sinon.spy(ind._index, "add");
    });
    afterEach(() => {
      ind._index.add.restore()
    })
    describe('call with an empty array', () => {
      it('should not call index', () => {
        ind.load([]);
        expect(ind._index.add.calledOnce).to.not.be.true;
      });
    });
    describe('call with items', () => {
      it('should call index for each item in list', () => {
        ind.load([
          { id: '1', foo: 'bar' },
          { id: '2', foo: 'fizz' },
          { id: '3', foo: 'boo' }]);
        expect(ind._index.add.callCount).to.eql(3);
      });
    });
  });

  describe('#find(terms, options)', () => {
    let ind;
    beforeEach(() => {
      ind = new TextIndex('foo');

      ind.load([
        { id: '1', foo: 'bar' },
        { id: '2', foo: 'fizz' },
        { id: '3', foo: 'boo' }]);
    });

    describe('when looking for an existing field indexed', () => {
      it('returns the id', () => {
        expect(ind.find('bar')).to.deep.equal([{ref: '1', score: 1}])
      })
    })

    describe('when looking for the begining existing field indexed', () => {
      it('returns the id', () => {
        expect(ind.find('ba')).to.deep.equal([{ref: '1', score: 1}])
      })
    })

    describe('when matching multiple data', () => {
      it('returns an array with the data sorted by score', () => {
        expect(ind.find('b')).to.deep.equal([
          {ref: '1', score: 0.7071067811865475},
          {ref: '3', score: 0.7071067811865475}
        ])
      })
    })

    describe('when matching with no data', () => {
      it('returns an empty array', () => {
        expect(ind.find('coco')).to.deep.equal([])
      })
    })
  });
});
