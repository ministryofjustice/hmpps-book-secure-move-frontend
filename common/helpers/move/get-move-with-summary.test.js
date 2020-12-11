const proxyquire = require('proxyquire')

const moveToMetaListComponent = sinon.stub().returns('__move-summary__')

const getMoveWithSummary = proxyquire('./get-move-with-summary', {
  '../../presenters/move-to-meta-list-component': moveToMetaListComponent,
})

describe('Move helpers', function () {
  const mockMove = {
    id: 'moveId',
  }
  beforeEach(function () {
    moveToMetaListComponent.resetHistory()
  })

  describe('#getMoveWithSummary', function () {
    let locals
    beforeEach(function () {
      locals = getMoveWithSummary(mockMove)
    })

    it('should get the move summary', function () {
      expect(moveToMetaListComponent).to.be.calledOnceWithExactly(mockMove)
    })

    it('should return the move and summary', function () {
      expect(locals).to.deep.equal({
        move: mockMove,
        moveSummary: '__move-summary__',
      })
    })
  })
})
