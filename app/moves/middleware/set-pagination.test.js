const middleware = require('./set-pagination')

describe('Moves middleware', function() {
  describe('#setPagination()', function() {
    const mockDate = '2019-10-10'
    const mockView = 'requested'
    let req, res, nextSpy

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())
      res = {
        locals: {},
      }
      req = {
        baseUrl: '/moves',
        params: {
          date: mockDate,
          view: mockView,
        },
      }
      nextSpy = sinon.spy()
    })

    afterEach(function() {
      this.clock.restore()
    })

    context('without location ID', function() {
      context('with day', function() {
        beforeEach(function() {
          req.params.period = 'day'
          middleware(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            `/moves/day/2019-10-10/${mockView}`
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            `/moves/day/2019-10-11/${mockView}`
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            `/moves/day/2019-10-09/${mockView}`
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with week', function() {
        beforeEach(function() {
          req.params.period = 'week'
          middleware(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            `/moves/week/2019-10-10/${mockView}`
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            `/moves/week/2019-10-17/${mockView}`
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            `/moves/week/2019-10-03/${mockView}`
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    context('with location ID', function() {
      context('with day', function() {
        beforeEach(function() {
          req.params.locationId = '12345'
          req.params.period = 'day'
          middleware(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            `/moves/day/2019-10-10/12345/${mockView}`
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            `/moves/day/2019-10-11/12345/${mockView}`
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            `/moves/day/2019-10-09/12345/${mockView}`
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with week', function() {
        beforeEach(function() {
          req.params.locationId = '12345'
          req.params.period = 'week'
          middleware(req, res, nextSpy)
        })

        it('should contain pagination on locals', function() {
          expect(res.locals).to.have.property('pagination')
        })

        it('should set correct today link', function() {
          expect(res.locals.pagination.todayUrl).to.equal(
            `/moves/week/2019-10-10/12345/${mockView}`
          )
        })

        it('should set correct next link', function() {
          expect(res.locals.pagination.nextUrl).to.equal(
            `/moves/week/2019-10-17/12345/${mockView}`
          )
        })

        it('should set correct previous link', function() {
          expect(res.locals.pagination.prevUrl).to.equal(
            `/moves/week/2019-10-03/12345/${mockView}`
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
