const proxyquire = require('proxyquire')

const populationToGridStub = sinon.stub()
const transfersToGridStub = sinon.stub()

const controller = proxyquire('./daily', {
  '../../../common/presenters/population-to-grid': populationToGridStub,
  '../../../common/presenters/transfers-to-grid': transfersToGridStub,
})

describe('Population controllers', function () {
  describe('#dashboard()', function () {
    let mockReq, mockRes

    beforeEach(function () {
      mockReq = {
        params: {
          date: '2020-07-29',
        },
        population: {
          date: '2020-08-01',
          free_spaces: 0,
          updated_at: '2020-07-29',
        },
        transfers: {
          transfersIn: [],
          transfersOut: [],
        },
      }

      mockRes = {
        render: sinon.spy(),
      }

      populationToGridStub.returns({
        details: {
          date: '2020-07-29',
        },
      })

      transfersToGridStub.returns({
        transfersIn: [],
        transfersOut: [],
      })
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
          expect(Object.keys(params)).to.have.length(5)
        })

        it('should set context', function () {
          expect(params).to.have.property('context')
          expect(params.context).to.deep.equal('population')
        })

        it('should set pageTitle', function () {
          expect(params).to.have.property('pageTitle')
          expect(params.pageTitle).to.deep.equal('dashboard::page_title')
        })

        it('should set pageTitle', function () {
          expect(params).to.have.property('date')
          expect(params.date).to.deep.equal(mockReq.params.date)
        })

        it('should set spaces', function () {
          expect(params).to.have.property('spaces')
          expect(params.spaces).to.deep.equal({
            details: {
              date: '2020-07-29',
            },
          })
        })

        it('should set transfers', function () {
          expect(params).to.have.property('transfers')
          expect(params.transfers).to.deep.equal({
            transfersIn: [],
            transfersOut: [],
          })
        })
      })
    })
  })
})
