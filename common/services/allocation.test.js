const apiClient = require('../lib/api-client')()

const allocationService = require('./allocation')

const mockAllocations = [
  {
    id: '12345',
    status: 'requested',
    moves: [
      {
        person: {
          name: 'Tom Jones',
        },
      },
    ],
  },
  {
    id: '67890',
    status: 'cancelled',
    moves: [
      {
        person: {
          name: 'Steve Bloggs',
        },
      },
    ],
  },
]

describe('Allocation service', function() {
  describe('cancel', function() {
    let outcome
    beforeEach(async function() {
      sinon.stub(apiClient, 'post').resolves({
        data: {
          events: [],
        },
      })
      sinon.spy(apiClient, 'one')
      sinon.spy(apiClient, 'all')
      outcome = await allocationService.cancel('123')
    })
    it('calls the service to post an event', function() {
      expect(apiClient.post).to.have.been.calledOnceWithExactly({
        event_name: 'cancel',
        timestamp: sinon.match.string,
      })
    })
    it('returns the data', function() {
      expect(outcome).to.deep.equal({
        events: [],
      })
    })
  })

  describe('format', function() {
    let output
    beforeEach(function() {
      output = allocationService.format({
        moves_count: '3',
        from_location: '9d0805d2-1bcc-4837-a8c5-025c3d8288b3',
        complex_cases: [
          {
            key: 'hold_separately',
            title: 'Segregated prisoners',
            allocation_complex_case_id: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
            answer: true,
          },
        ],
        complete_in_full: 'false',
      })
    })
    it('formats the boolean fields expressed as strings', function() {
      expect(output.complete_in_full).to.be.a('boolean')
      expect(output.complete_in_full).to.be.false
    })
    it('formats the relationships as expected', function() {
      expect(output.from_location).to.deep.equal({
        id: '9d0805d2-1bcc-4837-a8c5-025c3d8288b3',
      })
    })
    it('passes through other values unchanged', function() {
      expect(output.moves_count).to.equal('3')
    })
  })

  describe('#getAll()', function() {
    const mockResponse = {
      data: mockAllocations,
      links: {},
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    const mockMultiPageResponse = {
      data: mockAllocations,
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
    let moves

    beforeEach(function() {
      sinon.stub(apiClient, 'findAll')
    })

    context('with only one page', function() {
      beforeEach(function() {
        apiClient.findAll.resolves(mockResponse)
      })

      context('by default', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll()
        })

        it('should call the API client once', function() {
          expect(apiClient.findAll).to.be.calledOnce
        })

        it('should call the API client with default options', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'allocation',
            {
              page: 1,
              per_page: 100,
            }
          )
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockAllocations)
        })
      })

      context('with filter', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll({
            filter: mockFilter,
          })
        })

        it('should call the API client with filter', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'allocation',
            {
              ...mockFilter,
              page: 1,
              per_page: 100,
            }
          )
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockAllocations)
        })
      })

      context('with aggregation', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll({
            filter: mockFilter,
            isAggregation: true,
          })
        })

        it('should call the API client with only one per page', function() {
          expect(apiClient.findAll).to.be.calledOnceWithExactly('allocation', {
            ...mockFilter,
            page: 1,
            per_page: 1,
          })
        })

        it('should return a count', function() {
          expect(moves).to.equal(10)
        })
      })
    })

    context('with multiple pages', function() {
      beforeEach(function() {
        apiClient.findAll
          .onFirstCall()
          .resolves(mockMultiPageResponse)
          .onSecondCall()
          .resolves(mockResponse)
      })

      context('by default', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll()
        })

        it('should call the API client twice', function() {
          expect(apiClient.findAll).to.be.calledTwice
        })

        it('should call API client with default options on first call', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'allocation',
            {
              page: 1,
              per_page: 100,
            }
          )
        })

        it('should call API client with second page on second call', function() {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'allocation',
            {
              page: 2,
              per_page: 100,
            }
          )
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal([...mockAllocations, ...mockAllocations])
        })
      })

      context('with filter', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll({
            filter: mockFilter,
          })
        })

        it('should call API client with filter on first call', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly(
            'allocation',
            {
              ...mockFilter,
              page: 1,
              per_page: 100,
            }
          )
        })

        it('should call API client with filter on second call', function() {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly(
            'allocation',
            {
              ...mockFilter,
              page: 2,
              per_page: 100,
            }
          )
        })
      })

      context('with aggregation', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll({
            filter: mockFilter,
            isAggregation: true,
          })
        })

        it('should call the API client with only one per page', function() {
          expect(apiClient.findAll).to.be.calledOnceWithExactly('allocation', {
            ...mockFilter,
            page: 1,
            per_page: 1,
          })
        })

        it('should return a count', function() {
          expect(moves).to.equal(10)
        })
      })
    })
  })

  describe('#getByDateLocationAndStatus()', function() {
    let results

    beforeEach(async function() {
      sinon.stub(allocationService, 'getAll').resolves(mockAllocations)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        results = await allocationService.getByDateLocationAndStatus()
      })

      it('should call getAll with default filter', function() {
        expect(allocationService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          filter: {},
        })
      })

      it('should return results', function() {
        expect(results).to.deep.equal(mockAllocations)
      })
    })

    describe('arguments', function() {
      const mockMoveDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'
      const mockStatus = 'cancelled'

      context('with all arguments', function() {
        beforeEach(async function() {
          results = await allocationService.getByDateLocationAndStatus({
            status: mockStatus,
            moveDate: mockMoveDateRange,
            fromLocationId: mockFromLocationId,
            toLocationId: mockToLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            filter: {
              'filter[date_from]': mockMoveDateRange[0],
              'filter[date_to]': mockMoveDateRange[1],
              'filter[status]': mockStatus,
              'filter[from_locations]': mockFromLocationId,
              'filter[to_locations]': mockToLocationId,
            },
          })
        })

        it('should return results', function() {
          expect(results).to.deep.equal(mockAllocations)
        })
      })

      context('with some arguments', function() {
        beforeEach(async function() {
          results = await allocationService.getByDateLocationAndStatus({
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            filter: {
              'filter[from_locations]': mockFromLocationId,
            },
          })
        })

        it('should return results', function() {
          expect(results).to.deep.equal(mockAllocations)
        })
      })

      context('with aggregation', function() {
        beforeEach(async function() {
          results = await allocationService.getByDateLocationAndStatus({
            isAggregation: true,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: true,
            filter: {
              'filter[from_locations]': mockFromLocationId,
            },
          })
        })

        it('should return results', function() {
          expect(results).to.deep.equal(mockAllocations)
        })
      })
    })
  })

  describe('#getById', function() {
    let output
    const mockResponse = {
      id: '8567f1a5-2201-4bc2-b655-f6526401303a',
      type: 'allocations',
    }
    beforeEach(async function() {
      sinon.stub(apiClient, 'find').resolves({
        data: mockResponse,
      })
      output = await allocationService.getById(
        '8567f1a5-2201-4bc2-b655-f6526401303a'
      )
    })
    it('calls the api service', function() {
      expect(apiClient.find).to.have.been.calledOnceWith(
        'allocation',
        '8567f1a5-2201-4bc2-b655-f6526401303a'
      )
    })
    it('returns the data from the api service', function() {
      expect(output).to.deep.equal(mockResponse)
    })
  })

  describe('#create', function() {
    let output
    const mockResponse = {
      id: '8567f1a5-2201-4bc2-b655-f6526401303a',
      type: 'allocations',
    }
    beforeEach(async function() {
      sinon.stub(apiClient, 'create').resolves({
        data: {
          success: true,
        },
      })
      sinon.stub(allocationService, 'format').returns({
        formattedData: {},
      })
      output = await allocationService.create(mockResponse)
    })
    it('formattes the data', function() {
      expect(allocationService.format).to.have.been.calledWithExactly(
        mockResponse
      )
    })
    it('sends the data to the api', function() {
      expect(apiClient.create).to.have.been.calledWithExactly('allocation', {
        formattedData: {},
      })
    })
    it('returns the response', function() {
      expect(output).to.deep.equal({
        success: true,
      })
    })
  })
})
