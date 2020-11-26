const proxyquire = require('proxyquire')

const urlHelpers = require('../../helpers/url')

const middleware = proxyquire('./set-pagination', {
  '../../../app/date-select/constants': {
    MOUNTPATH: '/datejumper',
  },
})

describe('Moves middleware', function () {
  describe('#setPagination()', function () {
    const mockToday = '2020-10-10'
    const mockDate = '2019-10-10'
    const mockRoute = '/moves/:date/:locationId?'

    let req, res, nextSpy

    beforeEach(function () {
      sinon.stub(urlHelpers, 'compileFromRoute').returnsArg(0)
      this.clock = sinon.useFakeTimers(new Date(mockToday).getTime())
      res = {}
      req = {
        baseUrl: '/base-url',
        path: '/path',
        query: {},
        params: {
          date: mockDate,
        },
        originalUrl: '/foo?bar=baz',
      }
      nextSpy = sinon.spy()
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('when matching route is found', function () {
      context('by default', function () {
        beforeEach(function () {
          middleware(mockRoute)(req, res, nextSpy)
        })
        it('should contain pagination on req', function () {
          expect(req).to.have.property('pagination')
        })
        it('should set today link', function () {
          expect(req.pagination.todayUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2020-10-10',
            }
          )
        })
        it('should set next link', function () {
          expect(req.pagination.nextUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2019-10-11',
            }
          )
        })
        it('should set previous link', function () {
          expect(req.pagination.prevUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2019-10-09',
            }
          )
        })
        it('should set date select link', function () {
          expect(req.pagination.dateSelectUrl).to.equal(
            '/datejumper?referrer=/foo%3Fbar%3Dbaz'
          )
        })
        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with day', function () {
        beforeEach(function () {
          req.params.period = 'day'
          middleware(mockRoute)(req, res, nextSpy)
        })
        it('should contain pagination on req', function () {
          expect(req).to.have.property('pagination')
        })
        it('should set today link', function () {
          expect(req.pagination.todayUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2020-10-10',
            }
          )
        })
        it('should set next link', function () {
          expect(req.pagination.nextUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2019-10-11',
            }
          )
        })
        it('should set previous link', function () {
          expect(req.pagination.prevUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2019-10-09',
            }
          )
        })
        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with week', function () {
        beforeEach(function () {
          req.params.period = 'week'
          middleware(mockRoute)(req, res, nextSpy)
        })
        it('should contain pagination on req', function () {
          expect(req).to.have.property('pagination')
        })
        it('should set today link', function () {
          expect(req.pagination.todayUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2020-10-10',
            }
          )
        })
        it('should set next link', function () {
          expect(req.pagination.nextUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2019-10-17',
            }
          )
        })
        it('should set previous link', function () {
          expect(req.pagination.prevUrl).to.equal(mockRoute)
          expect(urlHelpers.compileFromRoute).to.be.calledWithExactly(
            mockRoute,
            req,
            {
              date: '2019-10-03',
            }
          )
        })
        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
