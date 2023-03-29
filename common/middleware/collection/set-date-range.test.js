const dateHelpers = require('../../helpers/date')

const setDateRange = require('./set-date-range')

describe('Moves middleware', function () {
  describe('#setDateRange()', function () {
    let req, res, nextSpy

    beforeEach(function () {
      sinon.stub(dateHelpers, 'getDateRange').callsFake(date => [date, date])
      req = {
        params: {
          period: 'day',
        },
        session: {},
      }
      res = {
        locals: {},
        redirect: sinon.stub(),
      }
      nextSpy = sinon.spy()
    })

    context('with valid move date', function () {
      beforeEach(function () {
        setDateRange(req, res, nextSpy, '2019-10-10')
      })

      it('should set move date on req', function () {
        expect(req.params).to.have.property('dateRange')
        expect(req.params.dateRange).to.deep.equal(['2019-10-10', '2019-10-10'])
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('with invalid move date', function () {
      beforeEach(function () {
        dateHelpers.getDateRange.returns([undefined, undefined])
        req = {
          baseUrl: '/req-base',
          params: { date: 'Invalid date' },
          session: {},
        }

        setDateRange(req, res, nextSpy, 'Invalid date')
      })

      it('should not set req.params', function () {
        expect(req.params).not.to.have.property('dateRange')
      })

      it('should call next with 404 error', function () {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Invalid date')
        expect(error.statusCode).to.equal(404)
      })
    })
  })
})
