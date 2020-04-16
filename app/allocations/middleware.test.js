const middleware = require('./middleware')
const allocationService = require('../../common/services/allocation')

describe('#setAllocationsSummary', function() {
  let next
  let locals
  beforeEach(async function() {
    sinon.stub(allocationService, 'getCount').returns(18)
    next = sinon.stub()
    locals = {
      dateRange: ['2020-01-01', '2020-01-10'],
    }
    await middleware.setAllocationsSummary(
      {
        params: {
          date: '2020-01-01',
        },
        t: sinon.stub().returnsArg(0),
      },
      {
        locals,
      },
      next
    )
  })

  it('calls get count with the date range', function() {
    expect(allocationService.getCount).to.have.been.calledOnceWithExactly({
      dateRange: ['2020-01-01', '2020-01-10'],
    })
  })

  it('updates the locals', function() {
    expect(locals.allocationsSummary).to.deep.equal([
      {
        active: false,
        label: 'allocations::dashboard.label',
        href: '/allocations/week/2020-01-01/',
        value: 18,
      },
    ])
  })

  it('calls next', function() {
    expect(next).to.have.been.calledOnce
  })
})

describe('#setPagination', function() {
  const mockDateRange = ['2020-04-13', '2020-04-19']
  let req, res, nextSpy
  beforeEach(function() {
    this.clock = sinon.useFakeTimers(new Date(mockDateRange[0]).getTime())
    nextSpy = sinon.spy()
  })

  afterEach(function() {
    this.clock.restore()
  })

  context('by week', function() {
    beforeEach(function() {
      res = {
        locals: {},
      }
      req = {
        baseUrl: '/allocations',
        params: {
          date: '2020-04-16',
          period: 'week',
        },
      }
      nextSpy = sinon.spy()
      middleware.setPagination(req, res, nextSpy)
    })

    it('creates pagination on locals', function() {
      expect(res.locals.pagination).to.exist
    })

    it('creats correctly todayUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.todayUrl).to.equal(
        '/allocations/week/2020-04-13/'
      )
    })

    it('creats correctly prevUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.prevUrl).to.equal(
        '/allocations/week/2020-04-09/'
      )
    })

    it('creats correctly nextUrl', function() {
      expect(res.locals.pagination.nextUrl).to.exist
      expect(res.locals.pagination.nextUrl).to.equal(
        '/allocations/week/2020-04-23/'
      )
    })
  })
  context('by day', function() {
    beforeEach(function() {
      res = {
        locals: {},
      }
      req = {
        baseUrl: '/allocations',
        params: {
          date: '2020-04-16',
          period: 'day',
        },
      }
      nextSpy = sinon.spy()
      middleware.setPagination(req, res, nextSpy)
    })

    it('creates pagination on locals', function() {
      expect(res.locals.pagination).to.exist
    })

    it('creats correctly todayUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.todayUrl).to.equal(
        '/allocations/day/2020-04-13/'
      )
    })

    it('creats correctly prevUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.prevUrl).to.equal(
        '/allocations/day/2020-04-15/'
      )
    })

    it('creats correctly nextUrl', function() {
      expect(res.locals.pagination.nextUrl).to.exist
      expect(res.locals.pagination.nextUrl).to.equal(
        '/allocations/day/2020-04-17/'
      )
    })
  })
})
