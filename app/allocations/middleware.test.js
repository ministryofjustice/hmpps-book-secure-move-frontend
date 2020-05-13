const presenters = require('../../common/presenters')
const allocationService = require('../../common/services/allocation')

const middleware = require('./middleware')

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
        label: 'allocations::dashboard.labels.allocations',
        href: '/allocations/week/2020-01-01/outgoing',
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
          view: 'outgoing',
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
        '/allocations/week/2020-04-13/outgoing'
      )
    })

    it('creats correctly prevUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.prevUrl).to.equal(
        '/allocations/week/2020-04-09/outgoing'
      )
    })

    it('creats correctly nextUrl', function() {
      expect(res.locals.pagination.nextUrl).to.exist
      expect(res.locals.pagination.nextUrl).to.equal(
        '/allocations/week/2020-04-23/outgoing'
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
      expect(res.locals.pagination.prevUrl).to.exist
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
  context('with filters', function() {
    beforeEach(function() {
      res = {
        locals: {},
      }
      req = {
        baseUrl: '/allocations',
        query: {
          filter1: true,
          filter2: false,
        },
        params: {
          date: '2020-04-16',
          period: 'week',
          view: 'outgoing',
        },
      }
      nextSpy = sinon.spy()
      middleware.setPagination(req, res, nextSpy)
    })

    it('creats correctly todayUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.todayUrl).to.equal(
        '/allocations/week/2020-04-13/outgoing?filter1=true&filter2=false'
      )
    })

    it('creats correctly prevUrl', function() {
      expect(res.locals.pagination.todayUrl).to.exist
      expect(res.locals.pagination.prevUrl).to.equal(
        '/allocations/week/2020-04-09/outgoing?filter1=true&filter2=false'
      )
    })

    it('creats correctly nextUrl', function() {
      expect(res.locals.pagination.nextUrl).to.exist
      expect(res.locals.pagination.nextUrl).to.equal(
        '/allocations/week/2020-04-23/outgoing?filter1=true&filter2=false'
      )
    })
  })
})
describe('#setAllocationsByDateAndFilter', function() {
  let next
  beforeEach(async function() {
    sinon.stub(allocationService, 'getByStatus')
    next = sinon.stub()
    await middleware.setAllocationsByDateAndFilter(
      {
        _parsedOriginalUrl: {
          query: 'complete_in_full=true',
        },
      },
      {
        locals: {
          dateRange: ['2020-01-01', null],
        },
      },
      next
    )
  })
  it('invokes the allocation service with the filters and the date range', function() {
    expect(allocationService.getByStatus).to.have.been.calledWithExactly({
      dateRange: ['2020-01-01', null],
      additionalFilters: { complete_in_full: true },
    })
  })
  it('calls next', function() {
    expect(next).to.have.been.called
  })
})
describe('#setAllocationTypeNavigation', function() {
  let next
  let locals
  context('when everything is fine', function() {
    beforeEach(async function() {
      next = sinon.stub()
      sinon.stub(allocationService, 'getCount').resolves(30)
      sinon.stub(presenters, 'moveTypesToFilterComponent').returnsArg(0)
      locals = {
        dateRange: ['2020-01-01', '2020-01-10'],
      }
      await middleware.setAllocationTypeNavigation(
        {},
        {
          locals,
        },
        next
      )
    })
    it('calls allocation service', function() {
      expect(allocationService.getCount).to.have.been.calledOnce
    })
    it('attaches the allocationTypeNavigation on locals', function() {
      expect(locals).to.deep.equal({
        allocationTypeNavigation: [
          {
            active: false,
            filter: null,
            label: 'allocations::total',
            value: 30,
          },
        ],
        dateRange: ['2020-01-01', '2020-01-10'],
      })
    })
    it('maps the result onto the presenter', function() {
      expect(presenters.moveTypesToFilterComponent).to.have.been.calledOnce
    })
    it('invokes next', function() {
      expect(next).to.have.been.calledOnce
    })
  })
  context('when the service errors', function() {
    beforeEach(function() {
      next = sinon.stub()
      sinon.stub(allocationService, 'getCount').throws(new Error('500!'))
      locals = {
        dateRange: ['2020-01-01', '2020-01-10'],
      }
      middleware.setAllocationTypeNavigation(
        {},
        {
          locals,
        },
        next
      )
    })
    it('if there is an error, it invokes next with the error', function() {
      expect(next).to.have.been.calledWithExactly(
        sinon.match({
          message: '500!',
        })
      )
    })
  })
})
