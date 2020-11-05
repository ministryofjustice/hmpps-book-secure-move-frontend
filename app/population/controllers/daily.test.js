const controller = require('./daily')

describe('Population controllers', function () {
  describe('#dashboard()', function () {
    let mockReq, mockRes

    beforeEach(function () {
      mockReq = {
        context: 'population',
        resultsAsDailySummary: {
          date: '2020-08-01',
          freeSpaces: 1,
        },
        params: {
          period: 'week',
        },
      }
      mockRes = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(function () {
        controller(mockReq, mockRes)
      })

      it('should render template', function () {
        const template = mockRes.render.args[0][0]

        expect(mockRes.render.calledOnce).to.be.true
        expect(template).to.equal('population/view/daily')
      })

      describe('params', function () {
        let params

        beforeEach(function () {
          params = mockRes.render.args[0][1]
        })

        it('should pass correct number of params to template', function () {
          expect(Object.keys(params)).to.have.length(3)
        })

        it('should set context', function () {
          expect(params).to.have.property('context')
          expect(params.context).to.deep.equal(mockReq.context)
        })

        it('should set pageTitle', function () {
          expect(params).to.have.property('pageTitle')
          expect(params.pageTitle).to.deep.equal('dashboard::page_title')
        })

        it('should set resultsAsDailySummary', function () {
          expect(params).to.have.property('resultsAsDailySummary')
          expect(params.resultsAsDailySummary).to.deep.equal(
            mockReq.resultsAsDailySummary
          )
        })
      })
    })
  })
})
