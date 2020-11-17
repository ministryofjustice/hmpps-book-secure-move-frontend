const controller = require('./daily')

describe('Population controllers', function () {
  describe('#dashboard()', function () {
    let mockReq, mockRes

    beforeEach(function () {
      mockReq = {
        context: 'population',
        params: {
          period: 'week',
        },
        details: {
          date: '2020-08-01',
          free_spaces: 0,
          updated_at: '2020-07-29',
        },
        totalSpace: [
          { property: 'operational_capacity', value: 100 },
          { property: 'usable_capacity', value: 99 },
        ],
        unavailableSpace: [
          { property: 'unlock', value: 2 },
          { property: 'bedwatch', value: 3 },
          { property: 'overnights_in', value: 4 },
        ],
        availableSpace: [
          { property: 'overnights_out', value: 5 },
          { property: 'out_of_area_courts', value: 6 },
          { property: 'discharges', value: 7 },
        ],
        transfersIn: [
          {
            establishment: 'Consequentar',
            count: 3,
          },
        ],
        transfersOut: [
          {
            establishment: 'Adipiscing Elit',
            count: 1,
          },
        ],
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
          expect(Object.keys(params)).to.have.length(8)
        })

        it('should set context', function () {
          expect(params).to.have.property('context')
          expect(params.context).to.deep.equal(mockReq.context)
        })

        it('should set pageTitle', function () {
          expect(params).to.have.property('pageTitle')
          expect(params.pageTitle).to.deep.equal('dashboard::page_title')
        })

        it('should set details', function () {
          expect(params).to.have.property('details')
          expect(params.details).to.deep.equal(mockReq.details)
        })

        it('should set totalSpace', function () {
          expect(params).to.have.property('totalSpace')
          expect(params.totalSpace).to.deep.equal(mockReq.totalSpace)
        })

        it('should set availableSpace', function () {
          expect(params).to.have.property('availableSpace')
          expect(params.availableSpace).to.deep.equal(mockReq.availableSpace)
        })

        it('should set unavailableSpace', function () {
          expect(params).to.have.property('unavailableSpace')
          expect(params.unavailableSpace).to.deep.equal(
            mockReq.unavailableSpace
          )
        })

        it('should set transfersIn', function () {
          expect(params).to.have.property('transfersIn')
          expect(params.transfersIn).to.deep.equal(mockReq.transfersIn)
        })

        it('should set transfersOut', function () {
          expect(params).to.have.property('transfersOut')
          expect(params.transfersOut).to.deep.equal(mockReq.transfersOut)
        })
      })
    })
  })
})
