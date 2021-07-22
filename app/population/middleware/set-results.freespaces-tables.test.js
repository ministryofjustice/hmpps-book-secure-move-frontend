const dateTableDecorator = { decorateAsDateTable: sinon.stub() }
const locationsToPopulationComponent = {
  locationsToPopulationTable: sinon.stub(),
}

const proxyquire = require('proxyquire')

const middleware = proxyquire('./set-results.freespaces-tables', {
  '../../../common/presenters/date-table/date-table-decorator':
    dateTableDecorator,
  '../../../common/presenters/date-table/locations-to-population-table-component':
    locationsToPopulationComponent,
})

const mockLocations = ['ABADCAFE', 'BAADF00D']

const mockPopulationTables = [
  {
    caption: 'Category Sigma',
    head: { text: 'Title', date: '2020-06-01' },
    rows: [{ text: 'Value', date: '2020-06-01' }],
  },
]

const mockDateTables = {
  caption: 'Category Sigma',
  head: { text: 'Title', date: '2020-06-01', classes: 'date-stying' },
  rows: [{ text: 'Value', date: '2020-06-01', classes: 'date-styling' }],
}

describe('Population middleware', function () {
  describe('#setResultsPopulationTables()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      locationsToPopulationComponent.locationsToPopulationTable.returns(
        sinon.stub().returns(mockPopulationTables)
      )
      dateTableDecorator.decorateAsDateTable.returns(mockDateTables)

      next = sinon.stub()
      res = {
        locals: {
          today: new Date('2020-06-03'),
        },
      }
      req = {
        dateRange: ['2020-06-01', '2020-06-05'],
        locations: mockLocations,
        resultsAsPopulation: mockPopulationTables,
      }
    })

    afterEach(function () {
      locationsToPopulationComponent.locationsToPopulationTable.resetHistory()
      dateTableDecorator.decorateAsDateTable.resetHistory()
    })

    context('by default', function () {
      beforeEach(function () {
        middleware(req, res, next)
      })

      it('should call locationsToPopulationTable presenter', function () {
        expect(
          locationsToPopulationComponent.locationsToPopulationTable
        ).to.have.been.calledOnce
      })

      it('should call decorateAsDateTable decorator', function () {
        expect(dateTableDecorator.decorateAsDateTable).to.have.been.calledOnce
      })

      it('should set resultsAsPopulationTables on req', function () {
        expect(req).to.have.property('resultsAsPopulationTables')
        expect(req.resultsAsPopulationTables[0]).to.deep.equal(mockDateTables)
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('on errors', function () {
      it('should call next with missing resultsAsPopulation', function () {
        middleware({}, res, next)

        expect(next).to.have.been.calledWith(
          sinon.match(
            sinon.match
              .instanceOf(Error)
              .and(sinon.match.has('message', 'missing resultsAsPopulation'))
          )
        )
      })

      it('should call next with presenter errors', function () {
        locationsToPopulationComponent.locationsToPopulationTable.throws(
          new Error('Presenter error')
        )

        middleware(req, res, next)

        expect(next).to.have.been.calledWith(
          sinon.match(
            sinon.match
              .instanceOf(Error)
              .and(sinon.match.has('message', 'Presenter error'))
          )
        )
      })
    })
  })
})
