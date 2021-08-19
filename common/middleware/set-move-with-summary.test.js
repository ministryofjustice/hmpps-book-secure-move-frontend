const moveHelpers = require('../helpers/move')

const setMoveWithSummary = require('./set-move-with-summary')

describe('#setMoveSummary', function () {
  let mockReq, mockRes, nextSpy

  beforeEach(function () {
    sinon
      .stub(moveHelpers, 'getMoveWithSummary')
      .returns({ moveSummary: '__move-summary__' })
    nextSpy = sinon.spy()
    mockReq = {}
    mockRes = {
      locals: {
        foo: 'bar',
      },
    }
  })

  context('with move', function () {
    beforeEach(function () {
      mockReq.move = { id: '__move__' }
      setMoveWithSummary(mockReq, mockRes, nextSpy)
    })

    it('should get the move summary', function () {
      expect(moveHelpers.getMoveWithSummary).to.be.calledOnceWithExactly({
        id: '__move__',
      })
    })

    it('should set the move summary', function () {
      expect(mockRes.locals).to.deep.equal({
        foo: 'bar',
        moveSummary: '__move-summary__',
      })
    })
  })

  context('without move', function () {
    beforeEach(function () {
      setMoveWithSummary(mockReq, mockRes, nextSpy)
    })

    it('should not get the move summary', function () {
      expect(moveHelpers.getMoveWithSummary).not.to.be.called
    })

    it('should not set the move summary', function () {
      expect(mockRes.locals).to.deep.equal({
        foo: 'bar',
      })
    })
  })
})
