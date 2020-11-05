const middleware = require('./set-results.daily-summary')

describe('Population middleware', function () {
  describe('#setResultsDailySummary()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      next = sinon.stub()
      res = {}
      req = {
        body: {
          population: {},
        },
        params: {
          locationId: 'BAADF00D',
          date: '2020-08-01',
        },
      }
    })

    it('should set resultsAsDailySummary when freeSpaces exists', async function () {
      req.body.population.freeSpaces = {
        key: 'value',
      }
      await middleware(req, res, next)

      expect(req.resultsAsDailySummary).to.deep.equal({
        key: 'value',
      })
    })

    it('should set resultsAsDailySummary as undefined when feeSpaces does not exist', async function () {
      req.body.population = undefined

      await middleware(req, res, next)

      expect(req.resultsAsDailySummary).to.be.undefined
    })
  })
})
