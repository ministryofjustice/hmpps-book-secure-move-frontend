const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')
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
}

const mockError = new Error('Error!!')

describe('Population middleware', function () {
  describe('#setPopulation()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      sinon.stub(locationsFreeSpacesService, 'getPrisonFreeSpaces')
      sinon.stub(populationService, 'getById')

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
          populationService.getById.resolves(mockPopulation)

          await middleware(req, res, next)
        })

        afterEach(function () {
          locationsFreeSpacesService.getPrisonFreeSpaces.restore()
          populationService.getById.restore()
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
          expect(populationService.getById).to.have.been.calledOnceWith('A')
        })

        it('should set resultsAsPopulationTable on req', function () {
          expect(req.population).to.deep.equal(mockPopulation)
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

        await middleware(req, res, next)
      })

      afterEach(function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.restore()
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
        expect(populationService.getById).not.to.have.been.called
      })

      it('should not set population on req', function () {
        expect(req.population).to.be.undefined
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
        populationService.getById.rejects(mockError)

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
