const populationService = require('../../../common/services/population')

const middleware = require('./set-results.daily-population')

const mockFreeSpaceData = {
  date: '2020-11-09',
  operational_capacity: 236,
  usable_capacity: 402,
  unlock: 383,
  bedwatch: 5,
  overnights_in: 7,
  overnights_out: 4,
  out_of_area_courts: 3,
  discharges: 1,
  free_spaces: 15,
  updated_by: 'Fr. Billy Zieme',
  created_at: '2020-10-20T15:36:08+01:00',
  updated_at: '2020-10-20T15:36:08+01:00',
}

describe('Population middleware', function () {
  describe('#setBodyFreeSpaces()', function () {
    let res
    let req
    let next

    beforeEach(function () {
      sinon.stub(populationService, 'getById')

      next = sinon.stub()
      res = {}
      req = {
        populationId: 'ABADCAFE',
        params: {
          date: '2020-08-01',
        },
      }
    })

    context('with populationId', function () {
      beforeEach(async function () {
        populationService.getById.resolves(mockFreeSpaceData)

        await middleware(req, res, next)
      })

      afterEach(function () {
        populationService.getById.restore()
      })

      it('should call the data service with request body', function () {
        expect(populationService.getById).to.have.been.calledOnceWith(
          'ABADCAFE'
        )
      })

      it('should set details on req', function () {
        expect(req).to.have.property('details')
        expect(req.details).to.deep.equal({
          date: mockFreeSpaceData.date,
          free_spaces: mockFreeSpaceData.free_spaces,
          updated_at: mockFreeSpaceData.updated_at,
        })
      })

      it('should set totalSpace on req', function () {
        expect(req).to.have.property('totalSpace')
        expect(req.totalSpace).to.deep.equal([
          {
            property: 'operational_capacity',
            value: mockFreeSpaceData.operational_capacity,
          },
          {
            property: 'usable_capacity',
            value: mockFreeSpaceData.usable_capacity,
          },
        ])
      })

      it('should set unavailableSpace on req', function () {
        expect(req).to.have.property('unavailableSpace')
        expect(req.unavailableSpace).to.deep.equal([
          {
            property: 'unlock',
            value: mockFreeSpaceData.unlock,
          },
          {
            property: 'bedwatch',
            value: mockFreeSpaceData.bedwatch,
          },
          {
            property: 'overnights_in',
            value: mockFreeSpaceData.overnights_in,
          },
        ])
      })

      it('should set availableSpace on req', function () {
        expect(req).to.have.property('availableSpace')
        expect(req.availableSpace).to.deep.equal([
          {
            property: 'overnights_out',
            value: mockFreeSpaceData.overnights_out,
          },
          {
            property: 'out_of_area_courts',
            value: mockFreeSpaceData.out_of_area_courts,
          },
          {
            property: 'discharges',
            value: mockFreeSpaceData.discharges,
          },
        ])
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('without populationId', function () {
      beforeEach(async function () {
        req.populationId = undefined

        await middleware(req, res, next)
      })

      afterEach(function () {})

      it('should not call the data service', function () {
        expect(populationService.getById).not.to.have.been.called
      })

      it('should set details with date only', function () {
        expect(req).to.have.property('details')
        expect(req.details.date).to.equal('2020-08-01')
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('when service rejects', function () {
      const mockError = new Error('Error!')

      beforeEach(async function () {
        populationService.getById.rejects(mockError)
        await middleware(req, res, next)
      })

      it('should not request properties', function () {
        expect(req.details).to.be.undefined
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
