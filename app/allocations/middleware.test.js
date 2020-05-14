const allocationService = require('../../common/services/allocation')

const middleware = require('./middleware')

describe('#setAllocationsSummary', function() {
  let next
  let locals
  beforeEach(async function() {
    sinon.stub(allocationService, 'getCount').returns(18)
    next = sinon.stub()
    locals = {}
    await middleware.setAllocationsSummary(
      {
        params: {
          date: '2020-01-01',
          dateRange: ['2020-01-01', '2020-01-10'],
        },
        t: sinon.stub().returnsArg(0),
      },
      { locals },
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
        label: 'allocations::dashboard.labels.single_requests',
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
        params: {
          dateRange: ['2020-01-01', null],
        },
      },
      { locals: {} },
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
  context('when everything is fine', function() {
    let next
    let locals
    beforeEach(async function() {
      sinon.stub(allocationService, 'getCount').resolves(1)
      locals = {}
      next = sinon.stub()
      await middleware.setAllocationTypeNavigation(
        {
          baseUrl: '/allocations',
          params: {
            locationId: 123,
            period: 'week',
            date: '2020-01-01',
            dateRange: ['2019-12-30', '2020-01-05'],
          },
          _parsedOriginalUrl: {
            query: '?filter[complete_in_full]=true&createdBy=456',
          },
        },
        {
          locals,
        },
        next
      )
    })
    it('calls getAllocationTypeMetadata once per item in the config', function() {
      expect(allocationService.getCount).to.have.been.calledTwice
      expect(allocationService.getCount).to.have.been.calledWith({
        dateRange: ['2019-12-30', '2020-01-05'],
        additionalFilters: { complete_in_full: true },
      })
      expect(allocationService.getCount).to.have.been.calledWith({
        dateRange: ['2019-12-30', '2020-01-05'],
        additionalFilters: { complete_in_full: false },
      })
    })
    it('takes the resulting counts and calculates the total', function() {
      expect(locals).to.deep.equal({
        allocationTypeNavigation: [
          {
            label: 'total',
            filter: null,
            value: 2,
            active: false,
            href: '/allocations/week/2020-01-01/outgoing',
          },
          {
            label: 'complete',
            filter: {
              complete_in_full: true,
            },
            value: 1,
            active: false,
            href: '/allocations/week/2020-01-01/outgoing?complete_in_full=true',
          },
          {
            label: 'incomplete',
            filter: {
              complete_in_full: false,
            },
            value: 1,
            active: false,
            href:
              '/allocations/week/2020-01-01/outgoing?complete_in_full=false',
          },
        ],
      })
    })
    it('invokes next', function() {
      expect(next).to.have.been.calledOnce
    })
  })
  context('when the service errors', function() {
    let next
    let locals
    beforeEach(async function() {
      sinon.stub(allocationService, 'getCount').throws(new Error('500!'))
      locals = {
        dateRange: ['2019-12-30', '2020-01-05'],
      }
      next = sinon.stub()
      await middleware.setAllocationTypeNavigation(
        {
          baseUrl: '/allocations',
          params: {
            locationId: 123,
            period: 'week',
            date: '2020-01-01',
          },
          _parsedOriginalUrl: {
            query: '?filter[complete_in_full]=true&createdBy=456',
          },
        },
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
