const apiClient = require('../lib/api-client')()

const restClient = sinon.stub()
restClient.post = sinon.stub()

const JourneyService = require('./journey')

const journeyService = new JourneyService({ apiClient: apiClient })

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

  describe('#getAll()', function () {
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
    const mockEmptyPageResponse = {
      data: [],
      links: {
        next: 'http://next-page.com',
      },
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    const mockFilter = {
      filterOne: 'foo',
    }
    const mockParams = {
      meta:
        'vehicle_registration,expected_time_of_arrival,expected_collection_time',
    }
    let journeys

    beforeEach(function () {
      sinon.stub(journeyService, 'removeInvalid').returnsArg(0)
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'post')
    })

    context('with only one page', function () {
      beforeEach(function () {
        apiClient.post.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({ moveId: mockId })
        })

        it('should call the API client correctly', function () {
          expect(apiClient.all.firstCall).to.be.calledWithExactly('move')
          expect(apiClient.all.secondCall).to.be.calledWithExactly('filtered')
          expect(apiClient.post).to.be.calledOnce
        })

        it('should call the API client with default options', function () {
          expect(apiClient.post).to.be.calledOnceWithExactly(
            { filter: {} },
            {
              page: 1,
              per_page: 100,
              include: undefined,
              'sort[by]': undefined,
              'sort[direction]': undefined,
            }
          )
        })

        it('should return moves', function () {
          expect(journeys).to.deep.equal(mockJourneys)
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            filter: mockFilter,
          })
        })

        it('should call the API client with filter', function () {
          expect(apiClient.post.args[0][0]).to.deep.equal({
            filter: mockFilter,
          })
        })
      })

      context('with params', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            params: mockParams,
          })
        })

        it('should call the API client with params', function () {
          expect(apiClient.post.args[0][1]).to.deep.include(mockParams)
        })
      })

      context('with aggregation', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            isAggregation: true,
          })
        })

        it('should call the API client with only one per page', function () {
          expect(apiClient.post.args[0][1]).to.deep.include({
            page: 1,
            per_page: 1,
            include: [],
          })
        })

        it('should return a count', function () {
          expect(journeys).to.equal(10)
        })
      })

      context('with sort', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            sort: {
              by: 'name',
              direction: 'asc',
            },
          })
        })

        it('should call the API client with sort params', function () {
          expect(apiClient.post.args[0][1]).to.deep.include({
            'sort[by]': 'name',
            'sort[direction]': 'asc',
          })
        })
      })

      context('with include', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            include: ['moves', 'people'],
          })
        })

        it('should call the API client with include', function () {
          expect(apiClient.post.args[0][1]).to.deep.include({
            include: ['moves', 'people'],
          })
        })
      })
    })

    context('with multiple pages', function () {
      beforeEach(function () {
        apiClient.post
          .onFirstCall()
          .resolves(mockMultiPageResponse)
          .onSecondCall()
          .resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({ moveId: mockId })
        })

        it('should call the API client correct number of times', function () {
          expect(apiClient.all.callCount).to.equal(4)
          expect(apiClient.post).to.be.calledTwice
        })

        it('should call API client with default options on first call', function () {
          expect(apiClient.post.firstCall).to.be.calledWithExactly(
            { filter: {} },
            {
              page: 1,
              per_page: 100,
              include: undefined,
              'sort[by]': undefined,
              'sort[direction]': undefined,
            }
          )
        })

        it('should call API client with second page on second call', function () {
          expect(apiClient.post.secondCall).to.be.calledWithExactly(
            { filter: {} },
            {
              page: 2,
              per_page: 100,
              include: undefined,
              'sort[by]': undefined,
              'sort[direction]': undefined,
            }
          )
        })

        it('should return moves', function () {
          expect(journeys).to.deep.equal([...mockJourneys, ...mockJourneys])
        })
      })

      context('with filter and params', function () {
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            filter: mockFilter,
            params: mockParams,
          })
        })

        it('should pass filter and params to first call', function () {
          expect(apiClient.post.args[0][0]).to.deep.include({
            filter: mockFilter,
          })
          expect(apiClient.post.args[0][1]).to.deep.include(mockParams)
        })

        it('should pass filter and params to second call', function () {
          expect(apiClient.post.args[1][0]).to.deep.include({
            filter: mockFilter,
          })
          expect(apiClient.post.args[1][1]).to.deep.include(mockParams)
        })
      })

      context('with sort', function () {
        const mockSort = {
          by: 'name',
          direction: 'desc',
        }
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            sort: mockSort,
          })
        })

        it('should pass sort to first call', function () {
          expect(apiClient.post.args[0][1]).to.deep.include({
            'sort[by]': mockSort.by,
            'sort[direction]': mockSort.direction,
          })
        })

        it('should pass sort to second call', function () {
          expect(apiClient.post.args[1][1]).to.deep.include({
            'sort[by]': mockSort.by,
            'sort[direction]': mockSort.direction,
          })
        })
      })

      context('with include', function () {
        const mockInclude = ['foo', 'bar']
        beforeEach(async function () {
          journeys = await journeyService.getAll({
            moveId: mockId,
            include: mockInclude,
          })
        })

        it('should pass sort to first call', function () {
          expect(apiClient.post.args[0][1]).to.deep.include({
            include: mockInclude,
          })
        })

        it('should pass sort to second call', function () {
          expect(apiClient.post.args[1][1]).to.deep.include({
            include: mockInclude,
          })
        })
      })
    })

    context('with next but no data', function () {
      beforeEach(async function () {
        apiClient.post.resolves(mockEmptyPageResponse)
        journeys = await journeyService.getAll({ moveId: mockId })
      })

      it('should call the API client once', function () {
        expect(apiClient.post).to.be.calledOnce
      })

      it('should return no moves', function () {
        expect(journeys).to.deep.equal([])
      })
    })
  })

  describe('#_getById()', function () {
    let journeys

    context('without Journey ID', function () {
      it('should reject with error', function () {
        return expect(journeyService._getById()).to.be.rejectedWith(
          'No journey ID supplied'
        )
      })
    })

    context('with Journey ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: mockJourneys,
      }

      beforeEach(async function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)
      })

      context('when called without include parameter', function () {
        beforeEach(async function () {
          journeys = await journeyService._getById(mockId)
        })
        it('should call find method with data', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly(
            'journey',
            mockId,
            {}
          )
        })

        it('should return move', function () {
          expect(journeys).to.deep.equal(mockResponse.data)
        })
      })

      context('when called with include parameter', function () {
        beforeEach(async function () {
          journeys = await journeyService._getById(mockId, {
            include: ['boo', 'far'],
          })
        })
        it('should pass include paramter to api client', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly(
            'journey',
            mockId,
            {
              include: ['boo', 'far'],
            }
          )
        })
      })
    })
  })
})
