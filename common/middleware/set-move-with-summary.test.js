const moveHelpers = require('../helpers/move')

const setMoveWithSummary = require('./set-move-with-summary')

describe('#setMoveSummary', function () {
  let mockReq, mockRes, nextSpy

  beforeEach(function () {
    sinon
      .stub(moveHelpers, 'getMoveWithSummary')
      .returns({ moveSummary: '__move-summary__' })
    nextSpy = sinon.spy()
    mockReq = {
      move: { id: '__move__' },
    }
    mockRes = {
      locals: {},
    }
    setMoveWithSummary(mockReq, mockRes, nextSpy)
  })

  it('should get the move summary', function () {
    expect(moveHelpers.getMoveWithSummary).to.be.calledOnceWithExactly({
      id: '__move__',
    })
  })

  it('should set the move summary', function () {
    expect(mockRes.locals).to.deep.equal({
      moveSummary: '__move-summary__',
    })
  })
})
