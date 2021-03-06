const controller = require('./dashboard')

let clock

describe('Population controllers', function () {
  describe('#dashboard()', function () {
    let mockReq, mockRes

    beforeEach(function () {
      mockReq = {
        context: 'population',
        dateRange: ['2020-06-01', '2020-06-07'],
        datePagination: {
          todayUrl: '/population/week/2020-06-01',
          nextUrl: '/population/week/2020-06/08',
          prevUrl: '/population/week/20202-05-23',
        },
        resultsAsPopulationTables: {
          populationTableData: {},
        },
        params: {
          period: 'week',
        },
      }
      mockRes = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(function () {
        clock = sinon.useFakeTimers(new Date(Date.UTC(2020, 5, 1, 0, 0, 0, 0)))

        controller(mockReq, mockRes)
      })

      afterEach(function () {
        clock.restore()
      })

      it('should render template', function () {
        const template = mockRes.render.args[0][0]

        expect(mockRes.render.calledOnce).to.be.true
        expect(template).to.equal('population/views/dashboard')
      })

      describe('params', function () {
        let params

        beforeEach(function () {
          params = mockRes.render.args[0][1]
        })

        it('should pass correct number of params to template', function () {
          expect(Object.keys(params)).to.have.length(6)
        })

        it('should set context', function () {
          expect(params).to.have.property('context')
          expect(params.context).to.deep.equal(mockReq.context)
        })

        it('should set pageTitle', function () {
          expect(params).to.have.property('pageTitle')
          expect(params.pageTitle).to.deep.equal('dashboard::page_title')
        })

        it('should set pagination', function () {
          expect(params).to.have.property('datePagination')
          expect(params.datePagination).to.deep.equal(mockReq.datePagination)
        })

        it('should set resultsAsPopulationTables', function () {
          expect(params).to.have.property('resultsAsPopulationTables')
          expect(params.resultsAsPopulationTables).to.deep.equal(
            mockReq.resultsAsPopulationTables
          )
        })

        it('should set period', function () {
          expect(params).to.have.property('period')
          expect(params.period).to.deep.equal('week')
        })

        it('should set currentWeek', function () {
          expect(params).to.have.property('dateRange')
          expect(params.dateRange).to.deep.equal(mockReq.dateRange)
        })
      })
    })
  })
})
