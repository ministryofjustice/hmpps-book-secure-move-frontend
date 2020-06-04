const apiClient = require('../lib/api-client')()
const personService = require('../services/person')

const allocationService = require('./allocation')

const mockAllocations = [
  {
    id: '12345',
    status: 'requested',
    moves: [
      {
        status: 'cancelled',
        person: {
          name: 'Tom Jones',
        },
      },
      {
        person: {
          name: 'James Stephens',
        },
      },
      {
        status: 'requested',
        person: {
          name: 'Hugh Jack',
        },
      },
      {
        status: 'cancelled',
        person: {
          name: 'Beth Hacket',
        },
      },
      {
        person: {
          name: 'Steve Adams',
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

  describe('#transform()', function() {
    let output

    beforeEach(function() {
      sinon.stub(personService, 'transform').returnsArg(0)
    })

    context('with no arguments', function() {
      beforeEach(function() {
        output = allocationService.transform()(mockAllocations[0])
      })

      it('should filter out cancelled moves', function() {
        expect(output.moves).to.have.length(3)
      })

      it('should call the person transform method on remaining moves', function() {
        expect(personService.transform.callCount).to.equal(3)
      })

      it('should return correct output', function() {
        expect(output).to.deep.equal({
          id: '12345',
          status: 'requested',
          moves: [
            {
              person: {
                name: 'James Stephens',
              },
            },
            {
              status: 'requested',
              person: {
                name: 'Hugh Jack',
              },
            },
            {
              person: {
                name: 'Steve Adams',
              },
            },
          ],
        })
      })
    })

    context('with excluding cancelled moves set to `false`', function() {
      beforeEach(function() {
        output = allocationService.transform({ includeCancelled: false })(
          mockAllocations[0]
        )
      })

      it('should filter out cancelled moves', function() {
        expect(output.moves).to.have.length(3)
      })

      it('should call the person transform method on remaining moves', function() {
        expect(personService.transform.callCount).to.equal(3)
      })

      it('should return correct output', function() {
        expect(output).to.deep.equal({
          id: '12345',
          status: 'requested',
          moves: [
            {
              person: {
                name: 'James Stephens',
              },
            },
            {
              status: 'requested',
              person: {
                name: 'Hugh Jack',
              },
            },
            {
              person: {
                name: 'Steve Adams',
              },
            },
          ],
        })
      })
    })

    context('with including cancelled moves set to `true`', function() {
      beforeEach(function() {
        output = allocationService.transform({ includeCancelled: true })(
          mockAllocations[0]
        )
      })

      it('should not filter out cancelled moves', function() {
        expect(output.moves).to.have.length(5)
      })

      it('should call the person transform method on all moves', function() {
        expect(personService.transform.callCount).to.equal(5)
      })

      it('should return correct output', function() {
        expect(output).to.deep.equal({
          id: '12345',
          status: 'requested',
          moves: [
            {
              status: 'cancelled',
              person: {
                name: 'Tom Jones',
              },
            },
            {
              person: {
                name: 'James Stephens',
              },
            },
            {
              status: 'requested',
              person: {
                name: 'Hugh Jack',
              },
            },
            {
              status: 'cancelled',
              person: {
                name: 'Beth Hacket',
              },
            },
            {
              person: {
                name: 'Steve Adams',
              },
            },
          ],
        })
      })
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
    let moves, transformStub

    beforeEach(function() {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(allocationService, 'transform').callsFake(() => transformStub)
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

        it('should transform each person object', function() {
          expect(transformStub.callCount).to.equal(mockAllocations.length)
        })

        it('should transform each person object not including cancelled', function() {
          expect(allocationService.transform).to.be.calledOnceWithExactly({
            includeCancelled: false,
          })
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

      context('with including cancelled moves', function() {
        beforeEach(async function() {
          moves = await allocationService.getAll({
            includeCancelled: true,
          })
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

        it('should transform each person object', function() {
          expect(transformStub.callCount).to.equal(mockAllocations.length)
        })

        it('should transform each person object and include cancelled', function() {
          expect(allocationService.transform).to.be.calledOnceWithExactly({
            includeCancelled: true,
          })
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockAllocations)
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

        it('should transform each person object', function() {
          expect(transformStub.callCount).to.equal(mockAllocations.length * 2)
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

  describe('#getByDateAndLocation()', function() {
    let results

    beforeEach(async function() {
      sinon.stub(allocationService, 'getAll').resolves(mockAllocations)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        results = await allocationService.getByDateAndLocation()
      })

      it('should call getAll with default filter', function() {
        expect(allocationService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          includeCancelled: false,
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

      context('with all arguments', function() {
        beforeEach(async function() {
          results = await allocationService.getByDateAndLocation({
            moveDate: mockMoveDateRange,
            fromLocationId: mockFromLocationId,
            toLocationId: mockToLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            includeCancelled: false,
            filter: {
              'filter[date_from]': mockMoveDateRange[0],
              'filter[date_to]': mockMoveDateRange[1],
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
          results = await allocationService.getByDateAndLocation({
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            includeCancelled: false,
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
          results = await allocationService.getByDateAndLocation({
            isAggregation: true,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: true,
            includeCancelled: false,
            filter: {
              'filter[from_locations]': mockFromLocationId,
            },
          })
        })

        it('should return results', function() {
          expect(results).to.deep.equal(mockAllocations)
        })
      })

      context('with including cancelled moves', function() {
        beforeEach(async function() {
          results = await allocationService.getByDateAndLocation({
            includeCancelled: true,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(allocationService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            includeCancelled: true,
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

  describe('#getActive', function() {
    beforeEach(function() {
      sinon.stub(allocationService, 'getByDateAndLocation')
    })

    context('with custom status', function() {
      beforeEach(function() {
        allocationService.getActive({
          additionalParams: {},
          status: 'custom',
        })
      })

      it('invokes getByDateAndLocation passing a proposed status', function() {
        expect(
          allocationService.getByDateAndLocation
        ).to.have.been.calledWithExactly({
          additionalParams: {},
          status: 'custom',
        })
      })
    })

    context('without custom status', function() {
      beforeEach(function() {
        allocationService.getActive({
          additionalParams: {},
        })
      })

      it('invokes getByDateAndLocation passing a proposed status', function() {
        expect(
          allocationService.getByDateAndLocation
        ).to.have.been.calledWithExactly({
          additionalParams: {},
          status: 'filled,unfilled',
        })
      })
    })
  })

  describe('#getCancelled', function() {
    beforeEach(function() {
      sinon.stub(allocationService, 'getByDateAndLocation')
      allocationService.getCancelled({
        additionalParams: {},
      })
    })

    it('invokes getByDateAndLocation passing a cancelled status', function() {
      expect(
        allocationService.getByDateAndLocation
      ).to.have.been.calledWithExactly({
        additionalParams: {},
        includeCancelled: true,
        status: 'cancelled',
      })
    })
  })

  describe('#getById', function() {
    let output, transformStub

    beforeEach(async function() {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(allocationService, 'transform').callsFake(() => transformStub)
      sinon.stub(apiClient, 'find').resolves({
        data: mockAllocations[0],
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

    it('should transform person object', function() {
      expect(transformStub.callCount).to.equal(1)
    })

    it('returns the data from the api service', function() {
      expect(output).to.deep.equal(mockAllocations[0])
    })
  })

  describe('#create', function() {
    let output, transformStub
    const mockData = {
      count: 5,
      category: 'C',
    }

    beforeEach(async function() {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(allocationService, 'transform').callsFake(() => transformStub)
      sinon.stub(apiClient, 'create').resolves({
        data: mockAllocations[0],
      })
      sinon.stub(allocationService, 'format').returns({
        formattedData: {},
      })
      output = await allocationService.create(mockData)
    })

    it('formats the data', function() {
      expect(allocationService.format).to.have.been.calledWithExactly(mockData)
    })

    it('sends the data to the api', function() {
      expect(apiClient.create).to.have.been.calledWithExactly('allocation', {
        formattedData: {},
      })
    })

    it('should transform person object', function() {
      expect(transformStub.callCount).to.equal(1)
    })

    it('returns the response', function() {
      expect(output).to.deep.equal(mockAllocations[0])
    })
  })
})
