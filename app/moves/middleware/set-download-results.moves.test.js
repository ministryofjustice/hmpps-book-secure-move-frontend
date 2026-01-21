const middleware = require('./set-download-results.moves')

const mockMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]
const mockBodyKey = 'outgoing'
const errorStub = new Error('Problem')

describe('Moves middleware', function () {
  describe('#setDownloadResultsMoves()', function () {
    let req, res, nextSpy, moveService

    beforeEach(function () {
      nextSpy = sinon.spy()
      res = {}
    })

    context('when API call returns successfully', function () {
      beforeEach(async function () {
        moveService = {
          getDownload: sinon.stub().resolves({ status: 200, data: mockMoves }),
        }
        req = initialReq(moveService)

        await middleware(mockBodyKey)(req, res, nextSpy)
      })

      it('should call API with move date and location ID', function () {
        expect(moveService.getDownload).to.be.calledOnceWithExactly(
          req,
          req.body[mockBodyKey]
        )
      })

      it('should not set results on req', function () {
        expect(req).to.have.property('results')
        expect(req.results).to.deep.equal(mockMoves)
      })

      it('should set emailFallback to false', function () {
        expect(req).to.have.property('emailFallback')
        expect(req.emailFallback).to.equal(false)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when API call returns 202', function () {
      beforeEach(async function () {
        moveService = {
          getDownload: sinon.stub().resolves({ status: 202, data: null }),
        }
        req = initialReq(moveService)
        await middleware(mockBodyKey)(req, res, nextSpy)
      })

      it('should call API with move date and location ID', function () {
        expect(moveService.getDownload).to.be.calledOnceWithExactly(
          req,
          req.body[mockBodyKey]
        )
      })

      it('should not set results on req', function () {
        expect(req).to.not.have.property('results')
      })

      it('should set emailFallback to true', function () {
        expect(req).to.have.property('emailFallback')
        expect(req.emailFallback).to.equal(true)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when API call returns an error', function () {
      beforeEach(async function () {
        req.services.move.getDownload = sinon.stub().throws(errorStub)
        await middleware(mockBodyKey)(req, res, nextSpy)
      })

      it('should not request properties', function () {
        expect(req).not.to.have.property('results')
      })

      it('should send error to next function', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
      })
    })
  })
})

function initialReq(moveService) {
  return {
    body: {
      [mockBodyKey]: {
        dateRange: ['2010-10-10', '2010-10-11'],
        locationId: '5555',
      },
    },
    services: {
      move: moveService,
    },
  }
}
