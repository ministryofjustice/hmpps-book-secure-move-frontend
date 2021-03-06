const presenters = require('../../../common/presenters')

const middleware = require('./set-results.allocations')

const mockActiveMoves = {
  data: [
    { id: '1', foo: 'bar', status: 'requested' },
    { id: '2', fizz: 'buzz', status: 'requested' },
    { id: '3', foo: 'bar', status: 'completed' },
    { id: '4', fizz: 'buzz', status: 'completed' },
  ],
  meta: {
    pagination: {
      total_pages: 2,
    },
  },
}

describe('Allocations middleware', function () {
  describe('#setResultsAllocations()', function () {
    let res
    let req
    let next
    let allocationsToTableStub
    let allocationService

    beforeEach(function () {
      allocationService = {
        getByDateAndLocation: sinon.stub(),
      }
      allocationsToTableStub = sinon.stub().returnsArg(0)
      sinon
        .stub(presenters, 'allocationsToTableComponent')
        .returns(allocationsToTableStub)
      next = sinon.stub()
      res = {}
      req = {
        session: {},
        canAccess: sinon.stub().callsFake(permission => {
          if (Array.isArray(permission)) {
            permission = permission[0]
          }

          return permission === 'allocation:person:assign'
        }),
        query: {
          status: 'approved',
        },
        body: {
          allocations: {
            status: 'proposed',
            moveDate: ['2019-01-01', '2019-01-07'],
            fromLocationId: '123',
          },
        },
        services: {
          allocation: allocationService,
        },
      }
    })

    context('when services resolve', function () {
      beforeEach(function () {
        req.canAccess.returns(false)
        allocationService.getByDateAndLocation.resolves(mockActiveMoves)
      })

      context('by default', function () {
        beforeEach(async function () {
          await middleware(req, res, next)
        })

        it('should call the data service with request body', function () {
          expect(
            allocationService.getByDateAndLocation
          ).to.have.been.calledOnceWithExactly({
            fromLocationId: '123',
            moveDate: ['2019-01-01', '2019-01-07'],
            status: 'proposed',
          })
        })

        it('should set resultsAsTable on req', function () {
          expect(req).to.have.property('results')
          expect(req.results).to.deep.equal(mockActiveMoves)
        })

        it('should set resultsAsTable on req', function () {
          expect(req).to.have.property('resultsAsTable')
          expect(req.resultsAsTable).to.deep.equal(mockActiveMoves.data)
        })

        it('should call presenter correct number of times', function () {
          expect(presenters.allocationsToTableComponent).to.be.calledOnce
        })

        it('should call presenter with correct config', function () {
          expect(
            presenters.allocationsToTableComponent
          ).to.be.calledWithExactly({
            query: { status: 'approved' },
            showRemaining: false,
            showFromLocation: true,
          })
        })

        it('should call presenter for active moves', function () {
          expect(allocationsToTableStub).to.have.been.calledWithExactly(
            mockActiveMoves.data
          )
        })

        it('should call next', function () {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      })

      context('when single location is selected', function () {
        beforeEach(async function () {
          req.session.currentLocation = {
            id: '123',
          }
          await middleware(req, res, next)
        })

        it('should call presenter with correct config', function () {
          expect(
            presenters.allocationsToTableComponent
          ).to.be.calledWithExactly({
            query: { status: 'approved' },
            showRemaining: false,
            showFromLocation: true,
          })
        })
      })

      context(
        'when user has permissions to assign a person to a move',
        function () {
          beforeEach(async function () {
            req.canAccess.withArgs('allocation:person:assign').returns(true)
            await middleware(req, res, next)
          })

          it('should call presenter with correct config', function () {
            expect(
              presenters.allocationsToTableComponent
            ).to.be.calledWithExactly({
              query: { status: 'approved' },
              showRemaining: true,
              showFromLocation: false,
            })
          })
        }
      )
    })

    context('when service rejects', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        allocationService.getByDateAndLocation = sinon.stub().rejects(mockError)
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
