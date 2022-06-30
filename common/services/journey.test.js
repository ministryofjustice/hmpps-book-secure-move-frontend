const apiClient = require('../lib/api-client')()

const restClient = sinon.stub()
restClient.post = sinon.stub()

const JourneyService = require('./journey')

const journeyService = new JourneyService({ apiClient })

const mockJourneys = [
  {
    id: '3be087ea-68fd-46e7-a6b7-e7c262fb4122',
    type: 'journeys',
    attributes: {
      state: 'completed',
      billable: true,
      vehicle: {
        id: '614',
        fake: true,
        registration: 'PHN-90',
      },
      timestamp: '2021-02-23T07:00:00+00:00',
    },
    relationships: {
      from_location: {
        data: {
          id: 'dbf13bff-0e22-45af-b813-547673c2f456',
          type: 'locations',
        },
      },
      to_location: {
        data: {
          id: '2e4d8b1c-166b-421a-a338-901463e26358',
          type: 'locations',
        },
      },
    },
  },
]

describe('Journey Service', function () {
  describe('default include', function () {
    it('should contain default include', function () {
      expect(journeyService.defaultInclude()).to.deep.equal([
        'from_location',
        'to_location',
      ])
    })
  })

  describe('#getByMoveId()', function () {
    const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockResponse = {
      data: mockJourneys,
      links: {},
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    const mockMultiPageResponse = {
      data: mockJourneys,
      links: {
        next: 'http://next-page.com',
      },
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    let journeys

    beforeEach(function () {
      sinon.stub(apiClient, 'one').returnsThis()
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'get')
    })

    context('without Move ID', function () {
      it('should reject with error', function () {
        return expect(journeyService.getByMoveId()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with Journey ID', function () {
      beforeEach(function () {
        apiClient.get.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          journeys = await journeyService.getByMoveId(mockId)
        })

        it('should call the API client correctly', function () {
          expect(apiClient.one.firstCall).to.be.calledWithExactly(
            'move',
            mockId
          )
          expect(apiClient.all.firstCall).to.be.calledWithExactly('journey')
          expect(apiClient.get).to.be.calledOnce
        })

        it('should call the API client with default options', function () {
          expect(apiClient.get).to.be.calledOnceWithExactly({
            include: ['from_location', 'to_location'],
            page: 1,
          })
        })

        it('should return moves', function () {
          expect(journeys).to.deep.equal(mockJourneys)
        })
      })

      context('with include', function () {
        beforeEach(async function () {
          journeys = await journeyService.getByMoveId(mockId, {
            include: ['moves', 'people'],
          })
        })

        it('should call the API client with custom include', function () {
          expect(apiClient.get.args[0][0]).to.deep.include({
            include: ['moves', 'people'],
            page: 1,
          })
        })
      })

      context('with multiple pages', function () {
        beforeEach(function () {
          apiClient.get
            .onFirstCall()
            .resolves(mockMultiPageResponse)
            .onSecondCall()
            .resolves(mockResponse)
        })

        context('by default', function () {
          beforeEach(async function () {
            journeys = await journeyService.getByMoveId(mockId)
          })

          it('should call the API client correct number of times', function () {
            expect(apiClient.all.callCount).to.equal(2)
            expect(apiClient.get).to.be.calledTwice
          })

          it('should call API client with default options on first call', function () {
            expect(apiClient.get.firstCall).to.be.calledWithExactly({
              include: ['from_location', 'to_location'],
              page: 1,
            })
          })

          it('should call API client with second page on second call', function () {
            expect(apiClient.get.secondCall).to.be.calledWithExactly({
              include: ['from_location', 'to_location'],
              page: 2,
            })
          })

          it('should return moves', function () {
            expect(journeys).to.deep.equal([...mockJourneys, ...mockJourneys])
          })
        })

        context('with include', function () {
          beforeEach(async function () {
            journeys = await journeyService.getByMoveId(mockId, {
              include: ['moves', 'people'],
            })
          })

          it('should call the API client with custom include', function () {
            expect(apiClient.get.args[0][0]).to.deep.include({
              include: ['moves', 'people'],
              page: 1,
            })
            expect(apiClient.get.args[1][0]).to.deep.include({
              include: ['moves', 'people'],
              page: 2,
            })
          })
        })
      })
    })
  })
})
