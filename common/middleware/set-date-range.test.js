const setDateRange = require('./set-date-range')
describe('Moves middleware', function() {
  describe('#setDateRange()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      req = {
        params: { date: '2019-10-10' },
      }
      res = {
        locals: {
          period: 'day',
        },
        redirect: sinon.stub(),
      }
      nextSpy = sinon.spy()
    })

    context('with valid move date', function() {
      beforeEach(function() {
        setDateRange(req, res, nextSpy)
      })

      it('should set move date to query value', function() {
        expect(res.locals).to.have.property('dateRange')
        expect(res.locals.dateRange).to.deep.equal(['2019-10-10', '2019-10-10'])
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with invalid move date', function() {
      beforeEach(function() {
        req = {
          baseUrl: '/req-base',
          params: { date: 'Invalid date' },
        }

        setDateRange(req, res, nextSpy)
      })

      it('should redirect to base url', function() {
        expect(res.redirect).to.be.calledOnceWithExactly('/req-base')
      })

      it('should not set move date', function() {
        expect(res.locals).not.to.have.property('dateRange')
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })
    })
  })
  describe('#setDateRange', function() {
    const date = '2020-01-02'

    beforeEach(function() {
      this.clock = sinon.useFakeTimers(new Date(date).getTime())
    })

    afterEach(function() {
      this.clock.restore()
    })
    it('it creates dateRange on the locals', function() {
      const locals = {}
      setDateRange(
        {
          params: {
            date,
          },
        },
        { locals },
        () => {}
      )
      expect(locals.dateRange).to.exist
    })
    it('it can return the week ', function() {
      const locals = {}
      setDateRange({ params: { date, period: 'week' } }, { locals }, () => {})
      expect(locals.dateRange).to.deep.equal(['2019-12-30', '2020-01-05'])
    })
    it('it can return the day ', function() {
      const locals = {
        period: 'day',
      }
      setDateRange(
        {
          params: {
            date,
          },
        },
        { locals },
        () => {}
      )
      expect(locals.dateRange).to.deep.equal(['2020-01-02', '2020-01-02'])
    })
  })
})
