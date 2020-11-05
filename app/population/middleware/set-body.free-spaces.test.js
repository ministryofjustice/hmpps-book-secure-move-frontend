const populationService = require('../../../common/services/population')

const middleware = require('./set-body.free-spaces')

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
        body: {
          population: {
            populationId: 'ABADCAFE',
          },
        },
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

      it('should set resultsAsPopulationTable on req', function () {
        expect(req.body).to.have.property('population')
        expect(req.body.population).to.have.property('freeSpaces')
        expect(req.body.population.freeSpaces).to.deep.equal({
          date: mockFreeSpaceData.date,
          operationalCapacity: mockFreeSpaceData.operational_capacity,
          usableCapacity: mockFreeSpaceData.usable_capacity,
          unlock: mockFreeSpaceData.unlock,
          bedwatch: mockFreeSpaceData.bedwatch,
          overnightsIn: mockFreeSpaceData.overnights_in,
          overnightsOut: mockFreeSpaceData.overnights_out,
          outOfAreaCourts: mockFreeSpaceData.out_of_area_courts,
          discharges: mockFreeSpaceData.discharges,
          freeSpaces: mockFreeSpaceData.free_spaces,
          updatedAt: mockFreeSpaceData.updated_at,
        })
      })

      it('should call next', function () {
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    context('without populationId', function () {
      beforeEach(async function () {
        req.body.population.populationId = undefined

        await middleware(req, res, next)
      })

      afterEach(function () {})

      it('should not call the data service', function () {
        expect(populationService.getById).not.to.have.been.called
      })

      it('should set freeSpaces with date only', function () {
        expect(req.body).to.have.property('population')
        expect(req.body.population).to.have.property('freeSpaces')
        expect(req.body.population.freeSpaces.date).to.equal('2020-08-01')
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
        expect(req.body.population).not.to.have.property('freeSpaces')
      })

      it('should call next with error', function () {
        expect(next).to.have.been.calledOnceWithExactly(mockError)
      })
    })
  })
})
