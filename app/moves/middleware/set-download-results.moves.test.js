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
      moveService = {
        getDownload: sinon.stub().resolves(mockMoves),
      }
      nextSpy = sinon.spy()
      res = {}
      req = {
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
    })

    context('when API call returns successfully', function () {
      context('without `locationKey`', function () {
        beforeEach(async function () {
          await middleware(mockBodyKey)(req, res, nextSpy)
        })

        it('should call API with move date and location ID', function () {
          expect(moveService.getDownload).to.be.calledOnceWithExactly(
            req,
            req.body[mockBodyKey]
          )
        })

        it('should set results on req', function () {
          expect(req).to.have.property('results')
          expect(req.results).to.deep.equal(mockMoves)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
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
