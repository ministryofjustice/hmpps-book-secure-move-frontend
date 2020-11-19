const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')
const moveService = require('../../../common/services/move')
const populationService = require('../../../common/services/population')

const middleware = require('./set-population')

const mockCapacities = [
  {
    id: 'ABADCAFE',
    meta: {
      populations: [{ id: 'A', free_spaces: 0 }],
    },
  },
]

const mockPopulation = {
  id: 'A',
  total_spaces: 100,
  moves_to: ['001', '002', '003'],
  moves_from: ['901', '902'],
}

const mockError = new Error('Error!!')

describe('Population middleware', function () {
  describe('#setPopulation()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      sinon.stub(locationsFreeSpacesService, 'getPrisonFreeSpaces')
      sinon.stub(populationService, 'getByIdWithMoves')
      sinon.stub(moveService, 'getActive')

      next = sinon.fake()

      res = {}
      req = {
        body: {},
        params: {
          locationId: 'BAADF00D',
          date: '2020-08-01',
        },
      }
    })

    context(
      'when locationFreeSpaces service resolves with population data',
      function () {
        beforeEach(async function () {
          locationsFreeSpacesService.getPrisonFreeSpaces.resolves(
            mockCapacities
          )
          populationService.getByIdWithMoves.resolves(mockPopulation)

          await middleware(req, res, next)
        })

        afterEach(function () {
          locationsFreeSpacesService.getPrisonFreeSpaces.restore()
          populationService.getByIdWithMoves.restore()
        })

        it('should call locationFreeSpaces service with date and locationId', function () {
          expect(
            locationsFreeSpacesService.getPrisonFreeSpaces
          ).to.have.been.calledOnceWith({
            dateFrom: '2020-08-01',
            dateTo: '2020-08-01',
            locationIds: 'BAADF00D',
          })
        })

        it('should call population service with population', function () {
          expect(
            populationService.getByIdWithMoves
          ).to.have.been.calledOnceWith('A')
        })

        it('should set req.population', function () {
          expect(req.population).to.deep.equal(mockPopulation)
        })

        it('should set req.transfers', function () {
          expect(req.transfers).to.deep.equal({
            transfersIn: 3,
            transfersOut: 2,
          })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledOnceWithExactly()
        })
      }
    )

    context('when service resolves with no population data', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves([
          {
            id: 'ABADCAFE',
            meta: {},
          },
        ])

        moveService.getActive.onCall(0).returns(4)
        moveService.getActive.onCall(1).returns(2)

        await middleware(req, res, next)
      })

      afterEach(function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.restore()
        moveService.getActive.restore()
      })

      it('should call the data service with request body', function () {
        expect(
          locationsFreeSpacesService.getPrisonFreeSpaces
        ).to.have.been.calledOnceWith({
          dateFrom: '2020-08-01',
          dateTo: '2020-08-01',
          locationIds: 'BAADF00D',
        })
      })

      it('should not call population service', function () {
        expect(populationService.getByIdWithMoves).not.to.have.been.called
      })

      it('should not set population on req', function () {
        expect(req.population).to.be.undefined
      })

      it('should call move service for transfers in and transfers out', function () {
        expect(moveService.getActive).to.have.been.calledTwice
        expect(moveService.getActive.firstCall).to.have.been.calledWith({
          dateRange: ['2020-08-01', '2020-08-01'],
          isAggregation: true,
          toLocationId: 'BAADF00D',
        })
        expect(moveService.getActive.secondCall).to.have.been.calledWith({
          dateRange: ['2020-08-01', '2020-08-01'],
          isAggregation: true,
          fromLocationId: 'BAADF00D',
        })
      })

      it('should set req.transfers', function () {
        expect(req.transfers).to.deep.equal({
          transfersIn: 4,
          transfersOut: 2,
        })
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when locationFreespaces service rejects', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should set req properties', function () {
        expect(req).not.to.have.property('population')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })

    context('when population service rejects', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves(mockCapacities)
        populationService.getByIdWithMoves.rejects(mockError)

        await middleware(req, res, next)
      })

      it('should set req properties', function () {
        expect(req).not.to.have.property('population')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
