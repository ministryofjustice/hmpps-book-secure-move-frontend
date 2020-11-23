const presenters = require('../../../common/presenters')

const controller = require('./daily')

describe('Population controllers', function () {
  describe('#dashboard()', function () {
    let mockReq, mockRes

    beforeEach(function () {
      mockReq = {
        params: {
          date: '2020-07-29',
          locationId: 'C0DEC0DE',
        },
        population: {
          date: '2020-08-01',
          free_spaces: 0,
          updated_at: '2020-07-29',
        },
        transfers: {
          transfersIn: 1,
          transfersOut: 9,
        },
      }

      mockRes = {
        render: sinon.spy(),
      }

      sinon.stub(presenters, 'populationToGrid').returns({
        details: {},
      })
    })

    afterEach(function () {
      presenters.populationToGrid.restore()
    })

    context('by default', function () {
      beforeEach(function () {
        controller(mockReq, mockRes)
      })

      it('should render template', function () {
        const template = mockRes.render.args[0][0]

        expect(mockRes.render.calledOnce).to.be.true
        expect(template).to.equal('population/views/daily')
      })

      describe('render params', function () {
        let params

        beforeEach(function () {
          params = mockRes.render.args[0][1]
        })

        it('should pass correct number of params to template', function () {
          expect(Object.keys(params)).to.have.length(4)
        })

        it('should set date', function () {
          expect(params).to.have.property('date')
          expect(params.date).to.deep.equal(mockReq.params.date)
        })

        it('should set locationId', function () {
          expect(params).to.have.property('locationId')
          expect(params.locationId).to.deep.equal(mockReq.params.locationId)
        })

        it('should set spaces', function () {
          expect(params).to.have.property('spaces')
          expect(params.spaces).to.have.all.keys(
            'details',
            'totalSpace',
            'availableSpace',
            'unavailableSpace'
          )
          expect(params.spaces.details.updated_at).to.equal('2020-07-29')
        })

        it('should set transfers', function () {
          expect(params).to.have.property('transfers')
          expect(params.transfers).to.deep.equal({
            transfersIn: 1,
            transfersOut: 9,
          })
        })
      })
    })
  })
})
