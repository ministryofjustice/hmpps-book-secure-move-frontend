const proxyquire = require('proxyquire')

const getMoveSummaryStub = sinon
  .stub()
  .returns({ moveSummary: '__move-summary__' })

const setMoveSummaryWithSessionData = proxyquire(
  './set-move-summary-with-session-data',
  {
    '../helpers/move/get-move-summary': getMoveSummaryStub,
  }
)

describe('#setMoveSummaryWithSessionData', function () {
  let mockReq, mockRes, nextSpy
  const mockSessionData = {
    fizz: 'buzz',
  }

  beforeEach(function () {
    getMoveSummaryStub.resetHistory()
    nextSpy = sinon.spy()
    mockReq = {
      session: {
        currentLocation: {
          id: '123',
          title: 'Current location',
        },
      },
      sessionModel: {
        toJSON: sinon.stub().returns(mockSessionData),
      },
    }
    mockRes = {
      locals: {
        foo: 'bar',
      },
    }
  })

  context('with move', function () {
    beforeEach(function () {
      mockReq.move = {
        id: '__req_move__',
        fizz: 'baz',
        from_location: {
          id: '567',
          title: 'Req location',
        },
      }
      setMoveSummaryWithSessionData(mockReq, mockRes, nextSpy)
    })

    it('should get the move summary', function () {
      expect(getMoveSummaryStub).to.be.calledOnceWithExactly({
        id: '__req_move__',
        fizz: 'buzz',
        from_location: {
          id: '567',
          title: 'Req location',
        },
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
      setMoveSummaryWithSessionData(mockReq, mockRes, nextSpy)
    })

    it('should get the move summary', function () {
      expect(getMoveSummaryStub).to.be.calledOnceWithExactly({
        fizz: 'buzz',
        from_location: {
          id: '123',
          title: 'Current location',
        },
      })
    })

    it('should set the move summary', function () {
      expect(mockRes.locals).to.deep.equal({
        foo: 'bar',
        moveSummary: '__move-summary__',
      })
    })
  })
})
