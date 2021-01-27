const locationsFreeSpacesService = {
  getPrisonFreeSpaces: sinon.stub(),
}

const middleware = require('./set-location-free-spaces')

const mockFreeSpaces = {
  'Category Epsilon': [
    {
      id: 'ABADCAFE',
      meta: {
        populations: [
          { id: 'A', free_spaces: 0, transfers_in: 3, transfers_out: 2 },
        ],
      },
    },
  ],
}

const mockError = new Error('Error!!')

describe('Population middleware', function () {
  beforeEach(function () {
    locationsFreeSpacesService.getPrisonFreeSpaces.resetHistory()
  })

  describe('#setLocationFreeSpaces()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      req = {
        body: {},
        dateRange: ['2020-08-01', '2020-08-01'],
        params: {},
        locations: ['BAADF00D', 'ABADCAFE'],
        services: {
          locationsFreeSpaces: locationsFreeSpacesService,
        },
      }

      res = {}
      next = sinon.fake()
    })

    context('when locationFreeSpaces service resolves', function () {
      beforeEach(function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resetHistory()
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves(mockFreeSpaces)
      })

      it('should call locationFreeSpaces service with date and locations', async function () {
        await middleware(req, res, next)

        expect(
          locationsFreeSpacesService.getPrisonFreeSpaces
        ).to.have.been.calledOnceWith({
          dateFrom: '2020-08-01',
          dateTo: '2020-08-01',
          locationIds: 'BAADF00D,ABADCAFE',
        })
      })

      it('should call locationFreeSpaces service with date and locationId', async function () {
        req.params.locationId = 'BAADF00D'

        await middleware(req, res, next)

        expect(
          locationsFreeSpacesService.getPrisonFreeSpaces
        ).to.have.been.calledOnceWith({
          dateFrom: '2020-08-01',
          dateTo: '2020-08-01',
          locationIds: 'BAADF00D',
        })
      })

      it('should set req.resultsAsPopulation', async function () {
        await middleware(req, res, next)

        expect(req.resultsAsPopulation).to.deep.equal(mockFreeSpaces)
      })

      it('should call next', async function () {
        await middleware(req, res, next)

        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when locationFreeSpaces service rejects', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should not set req properties', function () {
        expect(req).not.to.have.property('resultsAsPopulation')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
