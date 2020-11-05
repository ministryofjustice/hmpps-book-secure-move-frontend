const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

const middleware = require('./set-body.population-id')

const mockCapacities = [
  {
    id: 'ABADCAFE',
    meta: {
      populations: [{ id: 'A', free_spaces: 0 }],
    },
  },
]

describe('Population middleware', function () {
  describe('#setBodyPopulationId()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      sinon.stub(locationsFreeSpacesService, 'getPrisonFreeSpaces')

      next = sinon.stub()
      res = {}
      req = {
        body: {},
        params: {
          locationId: 'BAADF00D',
          date: '2020-08-01',
        },
      }
    })

    context('when service resolves with population data', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves(mockCapacities)

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

      it('should set resultsAsPopulationTable on req', function () {
        expect(req.body).to.have.property('population')
        expect(req.body.population).to.have.property('populationId')
        expect(req.body.population.populationId).to.equal('A')
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

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

      it('should set resultsAsPopulationTable on req', function () {
        expect(req.body).to.have.property('population')
        expect(req.body.population).to.have.property('populationId')
        expect(req.body.population.populationId).to.be.undefined
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when service rejects', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should not request properties', function () {
        expect(req).not.to.have.property('resultsAsPopulationTable')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
