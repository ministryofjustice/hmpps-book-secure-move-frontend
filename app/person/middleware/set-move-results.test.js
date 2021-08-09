const presenters = require('../../../common/presenters')

const middleware = require('./set-move-results')

const mockMoves = [
  { id: '1', foo: 'bar', status: 'requested' },
  { id: '2', fizz: 'buzz', status: 'requested' },
  { id: '3', foo: 'bar', status: 'completed' },
  { id: '4', fizz: 'buzz', status: 'completed' },
]

describe('Person app', function () {
  describe('Middleware', function () {
    describe('#setMoveResults()', function () {
      let res
      let req
      let next
      let movesToTableStub
      let moveService

      beforeEach(function () {
        movesToTableStub = sinon.stub().returnsArg(0)
        moveService = {
          getAll: sinon.stub().resolves(mockMoves),
        }
        sinon
          .stub(presenters, 'movesToTableComponent')
          .returns(movesToTableStub)
        next = sinon.stub()
        res = {}
        req = {
          query: { status: 'filled' },
          person: { id: 'person' },
          services: {
            move: moveService,
          },
        }
      })

      context('when service resolves', function () {
        beforeEach(async function () {
          await middleware(req, res, next)
        })

        it('should call the data service with request body', function () {
          expect(moveService.getAll).to.have.been.calledOnceWithExactly({
            filter: { person_id: 'person' },
            include: ['from_location', 'to_location'],
          })
        })

        it('should set results on req', function () {
          expect(req).to.have.property('results')
          expect(req.results.data).to.deep.equal(mockMoves)
        })

        it('should set resultsAsTable on req', function () {
          expect(req).to.have.property('resultsAsTable')
          expect(req.resultsAsTable).to.deep.equal(mockMoves)
        })

        it('should call presenter with correct config', function () {
          expect(presenters.movesToTableComponent).to.be.calledWithExactly({
            query: { status: 'filled' },
          })

          expect(movesToTableStub).to.be.calledWithExactly(mockMoves)
        })

        it('should call next', function () {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })

      context('when service rejects', function () {
        const mockError = new Error('Error!')

        beforeEach(async function () {
          moveService.getAll.rejects(mockError)
          await middleware(req, res, next)
        })

        it('should not request properties', function () {
          expect(req).not.to.have.property('resultsAsTable')
        })

        it('should call next with error', function () {
          expect(next).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
