const middleware = require('./set-filter.population')

describe('Population middleware', function () {
  describe('#setfilterPopulation()', function () {
    let next
    let req
    let res

    beforeEach(async function () {
      next = sinon.spy()
      req = {}
      res = {}
    })

    context('with no locations', function () {
      it('calls next', async function () {
        await middleware([])(req, res, next)

        expect(next).to.have.been.calledWithExactly()
      })
    })

    context('with locations', function () {
      beforeEach(async function () {
        req.locations = ['ABADCAFE', 'CAFEFEED']

        await middleware([])(req, res, next)
      })

      it('should set req.filter', function () {
        expect(req.filter).to.deep.equal({
          'filter[location_id]': 'ABADCAFE,CAFEFEED',
        })
      })

      it('should set req.filterPopulation', function () {
        expect(req.filterPopulation).to.deep.equal({
          'filter[location_id]': 'ABADCAFE,CAFEFEED',
        })
      })

      it('calls next', function () {
        expect(next).to.have.been.calledWithExactly()
      })
    })
  })
})
