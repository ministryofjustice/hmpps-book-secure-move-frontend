const presenters = require('../../../common/presenters')
const locationsFreeSpacesService = require('../../../common/services/locations-free-spaces')

const middleware = require('./set-results.population-table')

const mockCapacities = [
  {
    id: 'ABADCAFE',
    meta: {
      populations: [
        { id: 'A', free_spaces: 0 },
        { id: 'B', free_spaces: -1 },
        { id: 'C', free_spaces: -1 },
        { id: 'D' },
        { free_spaces: 0 },
      ],
    },
  },
]

const mockLocations = ['ABADCAFE', 'BAADF00D']

const mockPopulationTable = {
  head: { text: 'Title' },
  rows: [],
}

describe('Population middleware', function () {
  describe('#setResultsPopulationTable()', function () {
    let res
    let req
    let next
    let setResultsAsPopulationStub

    beforeEach(function () {
      setResultsAsPopulationStub = sinon.stub().returns(mockPopulationTable)
      sinon.stub(locationsFreeSpacesService, 'getPrisonFreeSpaces')
      sinon
        .stub(presenters, 'locationsToPopulationTableComponent')
        .returns(setResultsAsPopulationStub)
      next = sinon.stub()
      res = {}
      req = {
        dateRange: ['2020-08-01', '2020-08-05'],
        locations: mockLocations,
      }
    })

    context('when service resolves', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves(mockCapacities)
        setResultsAsPopulationStub = sinon.stub().returnsArg(0)

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
          dateTo: '2020-08-05',
          locationIds: 'ABADCAFE,BAADF00D',
        })
      })

      it('should set resultsAsPopulationTable on req', function () {
        expect(req).to.have.property('resultsAsPopulationTable')
        expect(req.resultsAsPopulationTable).to.deep.equal(mockPopulationTable)
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

    context('calling locationsToPopulationTable presenter', function () {
      beforeEach(async function () {
        locationsFreeSpacesService.getPrisonFreeSpaces.resolves(mockCapacities)

        await middleware(req, res, next)
      })

      it('should return rendered table', function () {
        expect(req.resultsAsPopulationTable).to.deep.equal({
          head: { text: 'Title' },
          rows: [],
        })
      })
    })
  })
})
