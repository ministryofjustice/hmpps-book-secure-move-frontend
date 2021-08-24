const proxyquire = require('proxyquire')

const getMoveSummaryStub = sinon
  .stub()
  .returns({ moveSummary: '__move-summary__' })

const setMoveSummary = proxyquire('./set-move-summary', {
  '../helpers/move/get-move-summary': getMoveSummaryStub,
})

describe('#setMoveSummary', function () {
  let mockReq, mockRes, nextSpy

  beforeEach(function () {
    getMoveSummaryStub.resetHistory()
    nextSpy = sinon.spy()
    mockReq = {}
    mockRes = {
      locals: {
        foo: 'bar',
      },
    }
  })

  beforeEach(function () {
    mockReq.move = { id: '__move__' }
    setMoveSummary(mockReq, mockRes, nextSpy)
  })

  it('should get the move summary', function () {
    expect(getMoveSummaryStub).to.be.calledOnceWithExactly({
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
