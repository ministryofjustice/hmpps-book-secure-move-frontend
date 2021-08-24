const proxyquire = require('proxyquire')

const moveToMetaListComponent = sinon.stub().returns('__move-summary__')

const getMoveSummary = proxyquire('./get-move-summary', {
  '../../presenters/move-to-meta-list-component': moveToMetaListComponent,
})

describe('Move helpers', function () {
  const mockMove = {
    id: 'moveId',
  }

  beforeEach(function () {
    moveToMetaListComponent.resetHistory()
  })

  describe('#getMoveSummary', function () {
    let locals

    context('with move', function () {
      beforeEach(function () {
        locals = getMoveSummary(mockMove, { foo: 'bar' })
      })

      it('should get the move summary', function () {
        expect(moveToMetaListComponent).to.be.calledOnceWithExactly(mockMove, {
          foo: 'bar',
        })
      })

      it('should return the move summary', function () {
        expect(locals).to.deep.equal({
          moveSummary: '__move-summary__',
        })
      })
    })

    context('without move', function () {
      beforeEach(function () {
        locals = getMoveSummary()
      })

      it('should not get the move summary', function () {
        expect(moveToMetaListComponent).not.to.be.called
      })

      it('should return empty object', function () {
        expect(locals).to.deep.equal({})
      })
    })
  })
})
