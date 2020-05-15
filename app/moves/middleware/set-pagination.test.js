const pathToRegexp = require('path-to-regexp')

const middleware = require('./set-pagination')

describe('Moves middleware', function() {
  describe('#setPagination()', function() {
    const mockToday = '2020-10-10'
    const mockDate = '2019-10-10'
    const mockRoute = '/moves/:date/:locationId?'
    const mockMatch = {
      params: {
        date: '2020-10-10',
        locationId: '12345',
        view: 'requested',
      },
    }

    let req, res, nextSpy, compileStub

    beforeEach(function() {
      compileStub = sinon.stub().callsFake(params => params.date)

      sinon.stub(pathToRegexp, 'match')
      sinon.stub(pathToRegexp, 'compile').callsFake(() => compileStub)
      this.clock = sinon.useFakeTimers(new Date(mockToday).getTime())
      res = {}
      req = {
        baseUrl: '/base-url',
        path: '/path',
        query: {},
        params: {
          date: mockDate,
        },
      }
      nextSpy = sinon.spy()
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('with route', function() {
      let matchStub

      beforeEach(function() {
        matchStub = sinon.stub().returns(false)
        pathToRegexp.match.callsFake(() => matchStub)

        middleware(mockRoute)(req, res, nextSpy)
      })

      it('should call match with route', function() {
        expect(pathToRegexp.match).to.have.been.calledOnceWithExactly(mockRoute)
      })

      it('should combine base url and path to find a match', function() {
        expect(matchStub).to.have.been.calledOnceWithExactly('/base-url/path')
      })
    })

    context('when no matching route is found', function() {
      beforeEach(function() {
        pathToRegexp.match.callsFake(() => sinon.stub().returns(false))

        middleware()(req, res, nextSpy)
      })

      it('should not set pagination on req', function() {
        expect(req).not.to.have.property('pagination')
      })

      it('should call next', function() {
        expect(nextSpy).to.have.been.calledOnceWithExactly()
      })
    })

    context('when matching route is found', function() {
      beforeEach(function() {
        pathToRegexp.match.callsFake(() => sinon.stub().returns(mockMatch))
      })

      context('by default', function() {
        beforeEach(function() {
          middleware(mockRoute)(req, res, nextSpy)
        })

        it('should contain pagination on req', function() {
          expect(req).to.have.property('pagination')
        })

        it('should set today link', function() {
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2020-10-10',
          })
          expect(req.pagination.todayUrl).to.equal('2020-10-10')
        })

        it('should set next link', function() {
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2019-10-11',
          })
          expect(req.pagination.nextUrl).to.equal('2019-10-11')
        })

        it('should set previous link', function() {
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2019-10-09',
          })
          expect(req.pagination.prevUrl).to.equal('2019-10-09')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with day', function() {
        beforeEach(function() {
          req.params.period = 'day'
          middleware(mockRoute)(req, res, nextSpy)
        })

        it('should contain pagination on req', function() {
          expect(req).to.have.property('pagination')
        })

        it('should set today link', function() {
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2020-10-10',
          })
          expect(req.pagination.todayUrl).to.equal('2020-10-10')
        })

        it('should set next link', function() {
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2019-10-11',
          })
          expect(req.pagination.nextUrl).to.equal('2019-10-11')
        })

        it('should set previous link', function() {
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2019-10-09',
          })
          expect(req.pagination.prevUrl).to.equal('2019-10-09')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with week', function() {
        beforeEach(function() {
          req.params.period = 'week'
          middleware(mockRoute)(req, res, nextSpy)
        })

        it('should contain pagination on req', function() {
          expect(req).to.have.property('pagination')
        })

        it('should set today link', function() {
          expect(req.pagination.todayUrl).to.equal('2020-10-10')
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2020-10-10',
          })
        })

        it('should set next link', function() {
          expect(req.pagination.nextUrl).to.equal('2019-10-17')
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2019-10-17',
          })
        })

        it('should set previous link', function() {
          expect(req.pagination.prevUrl).to.equal('2019-10-03')
          expect(compileStub).to.be.calledWithExactly({
            ...mockMatch.params,
            date: '2019-10-03',
          })
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    context('with query', function() {
      beforeEach(function() {
        pathToRegexp.match.callsFake(() => sinon.stub().returns(mockMatch))
        req.query = {
          status: 'approved',
          foo: 'bar',
        }
        middleware(mockRoute)(req, res, nextSpy)
      })

      it('should contain pagination on req', function() {
        expect(req).to.have.property('pagination')
      })

      it('should set today link', function() {
        expect(req.pagination.todayUrl).to.equal(
          '2020-10-10?status=approved&foo=bar'
        )
        expect(compileStub).to.be.calledWithExactly({
          ...mockMatch.params,
          date: '2020-10-10',
        })
      })

      it('should set next link', function() {
        expect(req.pagination.nextUrl).to.equal(
          '2019-10-11?status=approved&foo=bar'
        )
        expect(compileStub).to.be.calledWithExactly({
          ...mockMatch.params,
          date: '2019-10-11',
        })
      })

      it('should set previous link', function() {
        expect(req.pagination.prevUrl).to.equal(
          '2019-10-09?status=approved&foo=bar'
        )
        expect(compileStub).to.be.calledWithExactly({
          ...mockMatch.params,
          date: '2019-10-09',
        })
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
