const locationsFreeSpacesService = {
  getPrisonFreeSpaces: sinon.stub(),
}

const middleware = require('./set-results.population')

const mockLocations = ['ABADCAFE', 'BAADF00D']

const mockPopulationTables = [
  {
    caption: 'Category Sigma',
    head: { text: 'Title', date: '2020-06-01' },
    rows: [{ text: 'Value', date: '2020-06-01' }],
  },
]

describe('Population middleware', function () {
  beforeEach(function () {
    locationsFreeSpacesService.getPrisonFreeSpaces.resetHistory()
  })

  describe('#setResultsPopulationTables()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      next = sinon.stub()
      res = {
        locals: {
          today: new Date('2020-06-03'),
        },
      }
      req = {
        dateRange: ['2020-06-01', '2020-06-05'],
        locations: mockLocations,
        services: {
          locationsFreeSpaces: locationsFreeSpacesService,
        },
      }
    })

    afterEach(function () {
      locationsFreeSpacesService.getPrisonFreeSpaces.resetHistory()
    })

    context('when service resolves', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves(
          mockPopulationTables
        )

        await middleware(req, res, next)
      })

      it('should call the data service with request body', function () {
        expect(
          locationsFreeSpacesService.getPrisonFreeSpaces
        ).to.have.been.calledOnceWith({
          dateFrom: '2020-06-01',
          dateTo: '2020-06-05',
          locationIds: 'ABADCAFE,BAADF00D',
        })
      })

      it('should set resultsAsPopulationTables on req', function () {
        expect(req).to.have.property('resultsAsPopulation')
        expect(req.resultsAsPopulation).to.deep.equal(mockPopulationTables)
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
        expect(req).not.to.have.property('resultsAsPopulationTables')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
