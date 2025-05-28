const controller = require('./render-as-table')

const mockActiveMovesByDate = [
  { foo: 'bar', status: 'requested' },
  { fizz: 'buzz', status: 'requested' },
]
const mockDatePagination = {
  next: '/next',
  prev: '/prev',
}
const mockPagination = {
  next: '/next',
  prev: '/prev',
  page: 2,
}

describe('Collection controllers', function () {
  describe('#renderAsTable()', function () {
    let req, res

    beforeEach(function () {
      req = {
        canAccess: sinon.stub().returns(false),
        actions: ['1', '2'],
        context: 'listContext',
        datePagination: mockDatePagination,
        pagination: mockPagination,
        filter: [
          { label: 'bar', value: 2 },
          { label: 'foo', value: 6 },
          { label: 'fizz', value: 3 },
          { label: 'buzz', value: 7 },
        ],
        query: {
          status: 'complete',
        },
        params: {
          dateRange: ['2020-10-01', '2020-10-10'],
          period: 'day',
        },
        resultsAsTable: mockActiveMovesByDate,
      }
      res = {
        locals: {},
        render: sinon.spy(),
      }
    })

    describe('template params', function () {
      beforeEach(function () {
        controller(req, res)
      })

      it('should contain correct number of properties', function () {
        const params = res.render.args[0][1]
        expect(Object.keys(params)).to.have.length(11)
      })

      it('should contain actions property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('actions')
        expect(params.actions).to.deep.equal(['1', '2'])
      })

      it('should contain context property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('context')
        expect(params.context).to.equal('listContext')
      })

      it('should contain resultsAsTable property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('resultsAsTable')
        expect(params.resultsAsTable).to.deep.equal(mockActiveMovesByDate)
      })

      it('should contain dateRange property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('dateRange')
        expect(params.dateRange).to.deep.equal(req.params.dateRange)
      })

      it('should contain datePagination property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('datePagination')
        expect(params.datePagination).to.deep.equal(req.datePagination)
      })

      it('should contain period property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('period')
        expect(params.period).to.deep.equal(req.params.period)
      })

      it('should contain filter property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('filter')
        expect(params.filter).to.deep.equal(req.filter)
      })

      it('should contain activeStatus property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('activeStatus')
        expect(params.activeStatus).to.deep.equal(req.query.status)
      })

      it('should contain total results property', function () {
        const params = res.render.args[0][1]
        expect(params).to.have.property('totalResults')
        expect(params.totalResults).to.deep.equal(18)
      })
    })

    it('should render table template', function () {
      controller(req, res)
      const template = res.render.args[0][0]

      expect(res.render).to.be.calledOnce
      expect(template).to.equal('collection-as-table')
    })
  })
})
