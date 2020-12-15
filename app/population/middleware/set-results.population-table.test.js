const dateTableDecorator = { decorateAsDateTable: sinon.stub() }
const locationsFreeSpacesService = {
  getPrisonFreeSpaces: sinon.stub(),
}
const locationsToPopulationComponent = {
  locationsToPopulationTable: sinon.stub(),
}

const proxyquire = require('proxyquire')

const middleware = proxyquire('./set-results.population-table', {
  '../../../common/services/locations-free-spaces': locationsFreeSpacesService,
  '../../../common/presenters/date-table/date-table-decorator': dateTableDecorator,
  '../../../common/presenters/date-table/locations-to-population-table-component': locationsToPopulationComponent,
})

const mockLocations = ['ABADCAFE', 'BAADF00D']

const mockPopulationTable = {
  head: { text: 'Title', date: '2020-06-01' },
  rows: [{ text: 'Value', date: '2020-06-01' }],
}

const mockDateTable = {
  head: { text: 'Title', date: '2020-06-01', classes: 'date-stying' },
  rows: [{ text: 'Value', date: '2020-06-01', classes: 'date-styling' }],
}

describe('Population middleware', function () {
  beforeEach(function () {
    locationsFreeSpacesService.getPrisonFreeSpaces.resetHistory()
  })

  describe('#setResultsPopulationTable()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      locationsToPopulationComponent.locationsToPopulationTable.returns(
        sinon.stub().returns(mockPopulationTable)
      )
      dateTableDecorator.decorateAsDateTable.returns(mockDateTable)

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
      locationsToPopulationComponent.locationsToPopulationTable.resetHistory()
      dateTableDecorator.decorateAsDateTable.resetHistory()
    })

    context('when service resolves', function () {
      beforeEach(async function () {
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

      it('should call locationsToPopulationTable presenter', function () {
        expect(
          locationsToPopulationComponent.locationsToPopulationTable
        ).to.have.been.calledOnce
      })

      it('should call decorateAsDateTable decorator', function () {
        expect(dateTableDecorator.decorateAsDateTable).to.have.been.calledOnce
      })

      it('should set resultsAsPopulationTable on req', function () {
        expect(req).to.have.property('resultsAsPopulationTable')
        expect(req.resultsAsPopulationTable).to.deep.equal(mockDateTable)
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
