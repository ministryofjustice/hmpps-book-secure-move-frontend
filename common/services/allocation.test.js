const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const formatISOStub = sinon.stub().returns('#timestamp')

const AllocationService = proxyquire('./allocation', {
  'date-fns': {
    formatISO: formatISOStub,
  },
})
const allocationService = new AllocationService({ apiClient })

const mockAllocations = [
  {
    id: '12345',
    status: 'requested',
    meta: {
      moves: {
        total: 10,
        filled: 9,
        unfilled: 1,
      },
    },
    moves: [
      {
        status: 'cancelled',
        profile: {
          person: {
            name: 'Tom Jones',
          },
        },
      },
      {
        profile: {
          person: {
            name: 'James Stephens',
          },
        },
      },
      {
        status: 'requested',
        profile: {
          person: {
            name: 'Hugh Jack',
          },
        },
      },
      {
        status: 'cancelled',
        profile: {
          person: {
            name: 'Beth Hacket',
          },
        },
      },
      {
        profile: {
          person: {
            name: 'Steve Adams',
          },
        },
      },
    ],
  },
  {
    id: '67890',
    status: 'cancelled',
    moves: [
      {
        profile: {
          person: {
            name: 'Steve Bloggs',
          },
        },
      },
    ],
  },
]

describe('Allocation service', function () {
  describe('cancel', function () {
    context('with correct data supplied', function () {
      let outcome
      beforeEach(async function () {
        sinon.stub(apiClient, 'post').resolves({
          data: mockAllocations[0],
        })
        sinon.spy(apiClient, 'one')
        sinon.spy(apiClient, 'all')
        outcome = await allocationService.cancel(123, {
          reason: 'other',
          comment: 'Flood at receiving establishment',
        })
      })

      it('calls the service to post a cancel', function () {
        expect(apiClient.post).to.have.been.calledOnceWithExactly({
          cancellation_reason: 'other',
          cancellation_reason_comment: 'Flood at receiving establishment',
          timestamp: sinon.match.string,
        })
      })
      it('returns the data', function () {
        expect(outcome).to.deep.equal(mockAllocations[0])
      })
    })
    context('without id supplied', function () {
      it('should reject with error', function () {
        return expect(allocationService.cancel()).to.be.rejectedWith(
          'No allocation id supplied'
        )
      })
    })
  })

  describe('format', function () {
    let output
    beforeEach(function () {
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
    it('formats the boolean fields expressed as strings', function () {
      expect(output.complete_in_full).to.be.a('boolean')
      expect(output.complete_in_full).to.be.false
    })
    it('formats the relationships as expected', function () {
      expect(output.from_location).to.deep.equal({
        id: '9d0805d2-1bcc-4837-a8c5-025c3d8288b3',
      })
    })
    it('passes through other values unchanged', function () {
      expect(output.moves_count).to.equal('3')
    })
  })

  describe('#transform()', function () {
    let output

    // TODO: Remove when individual allocations return meta.moves info
    describe('single allocation', function () {
      context('when there is no meta object', function () {
        beforeEach(function () {
          const allocation = {
            ...mockAllocations[0],
            meta: undefined,
            moves: mockAllocations[0].moves.slice(),
          }
          output = AllocationService.transform()(allocation)
        })

        it('should return correct output', function () {
          expect(output).to.deep.equal({
            id: '12345',
            status: 'requested',
            totalSlots: 3,
            filledSlots: undefined,
            unfilledSlots: undefined,
            moves: [
              {
                profile: {
                  person: {
                    name: 'James Stephens',
                  },
                },
              },
              {
                status: 'requested',
                profile: {
                  person: {
                    name: 'Hugh Jack',
                  },
                },
              },
              {
                profile: {
                  person: {
                    name: 'Steve Adams',
                  },
                },
              },
            ],
          })
        })
      })

      context(
        'when allocation is cancelled and there is no meta object',
        function () {
          beforeEach(function () {
            const allocation = {
              ...mockAllocations[0],
              meta: undefined,
              status: 'cancelled',
              moves: mockAllocations[0].moves.slice(),
            }
            output = AllocationService.transform()(allocation)
          })

          it('should return correct output', function () {
            expect(output).to.deep.equal({
              id: '12345',
              status: 'cancelled',
              totalSlots: 5,
              filledSlots: undefined,
              unfilledSlots: undefined,
              moves: [
                {
                  profile: {
                    person: {
                      name: 'James Stephens',
                    },
                  },
                },
                {
                  status: 'requested',
                  profile: {
                    person: {
                      name: 'Hugh Jack',
                    },
                  },
                },
                {
                  profile: {
                    person: {
                      name: 'Steve Adams',
                    },
                  },
                },
              ],
            })
          })
        }
      )
    })
    // TODO: end

    context('with no arguments', function () {
      beforeEach(function () {
        output = AllocationService.transform()(mockAllocations[0])
      })

      it('should filter out cancelled moves', function () {
        expect(output.moves).to.have.length(3)
      })

      it('should return correct output', function () {
        expect(output).to.deep.equal({
          id: '12345',
          status: 'requested',
          totalSlots: 10,
          filledSlots: 9,
          unfilledSlots: 1,
          moves: [
            {
              profile: {
                person: {
                  name: 'James Stephens',
                },
              },
            },
            {
              status: 'requested',
              profile: {
                person: {
                  name: 'Hugh Jack',
                },
              },
            },
            {
              profile: {
                person: {
                  name: 'Steve Adams',
                },
              },
            },
          ],
        })
      })
    })

    context('with excluding cancelled moves set to `false`', function () {
      beforeEach(function () {
        output = AllocationService.transform({ includeCancelled: false })(
          mockAllocations[0]
        )
      })

      it('should filter out cancelled moves', function () {
        expect(output.moves).to.have.length(3)
      })

      it('should return correct output', function () {
        expect(output).to.deep.equal({
          id: '12345',
          status: 'requested',
          totalSlots: 10,
          filledSlots: 9,
          unfilledSlots: 1,
          moves: [
            {
              profile: {
                person: {
                  name: 'James Stephens',
                },
              },
            },
            {
              status: 'requested',
              profile: {
                person: {
                  name: 'Hugh Jack',
                },
              },
            },
            {
              profile: {
                person: {
                  name: 'Steve Adams',
                },
              },
            },
          ],
        })
      })
    })

    context('with including cancelled moves set to `true`', function () {
      beforeEach(function () {
        output = AllocationService.transform({ includeCancelled: true })(
          mockAllocations[0]
        )
      })

      it('should not filter out cancelled moves', function () {
        expect(output.moves).to.have.length(5)
      })

      it('should return correct output', function () {
        expect(output).to.deep.equal({
          id: '12345',
          status: 'requested',
          totalSlots: 10,
          filledSlots: 9,
          unfilledSlots: 1,
          moves: [
            {
              status: 'cancelled',
              profile: {
                person: {
                  name: 'Tom Jones',
                },
              },
            },
            {
              profile: {
                person: {
                  name: 'James Stephens',
                },
              },
            },
            {
              status: 'requested',
              profile: {
                person: {
                  name: 'Hugh Jack',
                },
              },
            },
            {
              status: 'cancelled',
              profile: {
                person: {
                  name: 'Beth Hacket',
                },
              },
            },
            {
              profile: {
                person: {
                  name: 'Steve Adams',
                },
              },
            },
          ],
        })
      })
    })

    context('with no moves', function () {
      beforeEach(function () {
        const allocation = {
          ...mockAllocations[0],
        }
        delete allocation.moves
        output = AllocationService.transform()(allocation)
      })

      it('should add an empty moves property', function () {
        expect(output.moves).to.have.length(0)
      })
    })

    context('with no meta moves info is present`', function () {
      beforeEach(function () {
        output = AllocationService.transform({ includeCancelled: false })({
          moves: [],
        })
      })

      it('should set the slots values to undefined', function () {
        expect(output).to.deep.equal({
          totalSlots: undefined,
          filledSlots: undefined,
          unfilledSlots: undefined,
          moves: [],
        })
      })
    })
  })

  describe('#get()', function () {
    const mockResponse = {
      data: mockAllocations,
      links: {},
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    let moves, transformStub

    beforeEach(function () {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(AllocationService.prototype, 'removeInvalid').returnsArg(0)
      sinon.stub(AllocationService, 'transform').callsFake(() => transformStub)
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'post')
    })

    beforeEach(function () {
      apiClient.post.resolves(mockResponse)
    })

    context('by default', function () {
      beforeEach(async function () {
        moves = await allocationService.get()
      })

      it('should call the API client with default options', function () {
        expect(apiClient.all.firstCall).to.be.calledWithExactly('allocation')
        expect(apiClient.all.secondCall).to.be.calledWithExactly('filtered')
        expect(apiClient.post).to.be.calledOnceWithExactly(
          { filter: {} },
          {
            include: undefined,
            page: 1,
            per_page: 20,
            'sort[by]': undefined,
            'sort[direction]': undefined,
          }
        )
      })

      it('should transform each person object', function () {
        expect(transformStub.callCount).to.equal(mockAllocations.length)
      })

      it('should transform each person object not including cancelled', function () {
        expect(AllocationService.transform).to.be.calledOnceWithExactly({
          includeCancelled: false,
        })
      })

      it('should return response', function () {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    describe('filter', function () {
      beforeEach(async function () {
        moves = await allocationService.get({
          filter: {
            foo: 'bar',
          },
        })
      })

      it('should use filter as payload', function () {
        expect(apiClient.post.args[0][0]).to.deep.equal({
          filter: {
            foo: 'bar',
          },
        })
      })
    })

    describe('params', function () {
      beforeEach(async function () {
        moves = await allocationService.get({
          include: ['moves'],
          page: 3,
          perPage: 50,
          sort: {
            by: 'name',
            direction: 'asc',
          },
        })
      })

      it('should use correct values for params', function () {
        expect(apiClient.post.args[0][1]).to.deep.equal({
          include: ['moves'],
          page: 3,
          per_page: 50,
          'sort[by]': 'name',
          'sort[direction]': 'asc',
        })
      })
    })

    context('with aggregation', function () {
      beforeEach(async function () {
        moves = await allocationService.get({
          isAggregation: true,
          page: 5,
          perPage: 50,
          include: ['moves'],
        })
      })

      it('should call the API client with only one per page', function () {
        expect(apiClient.post.args[0][1]).to.deep.include({
          include: [],
          page: 1,
          per_page: 1,
        })
      })

      it('should return a count', function () {
        expect(moves).to.equal(10)
      })
    })

    context('with including cancelled moves', function () {
      beforeEach(async function () {
        moves = await allocationService.get({
          includeCancelled: true,
        })
      })

      it('should transform each person object', function () {
        expect(transformStub.callCount).to.equal(mockAllocations.length)
      })

      it('should transform each person object and include cancelled', function () {
        expect(AllocationService.transform).to.be.calledOnceWithExactly({
          includeCancelled: true,
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    context('when specifying include parameter', function () {
      beforeEach(async function () {
        apiClient.post.resolves(mockResponse)
        moves = await allocationService.get({
          include: ['foo', 'bar'],
        })
      })

      it('should pass include parameter to the API client', function () {
        expect(apiClient.post.args[0][1]).to.be.deep.include({
          include: ['foo', 'bar'],
        })
      })
    })
  })

  describe('#getByDateAndLocation()', function () {
    const getAllInclude = ['from_location', 'to_location']
    let results

    beforeEach(function () {
      sinon.stub(allocationService, 'get').resolves(mockAllocations)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        results = await allocationService.getByDateAndLocation()
      })

      it('should call getAll with default filter', function () {
        expect(allocationService.get).to.be.calledOnceWithExactly({
          isAggregation: false,
          page: undefined,
          include: getAllInclude,
          includeCancelled: false,
          filter: {
            status: undefined,
            from_locations: '',
            to_locations: '',
            locations: '',
            date_from: undefined,
            date_to: undefined,
          },
          sort: {
            by: undefined,
            direction: undefined,
          },
        })
      })

      it('should return results', function () {
        expect(results).to.deep.equal(mockAllocations)
      })
    })

    describe('arguments', function () {
      const mockMoveDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      context('with all arguments', function () {
        beforeEach(async function () {
          results = await allocationService.getByDateAndLocation({
            moveDate: mockMoveDateRange,
            fromLocations: [mockFromLocationId],
            toLocations: [mockToLocationId],
            locations: [mockFromLocationId, mockToLocationId],
            status: 'active',
            isAggregation: true,
            page: 5,
            sortBy: 'name',
            sortDirection: 'asc',
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(allocationService.get).to.be.calledOnceWithExactly({
            isAggregation: true,
            include: getAllInclude,
            page: 5,
            includeCancelled: false,
            filter: {
              status: 'active',
              from_locations: mockFromLocationId,
              to_locations: mockToLocationId,
              locations: `${mockFromLocationId},${mockToLocationId}`,
              date_from: mockMoveDateRange[0],
              date_to: mockMoveDateRange[1],
            },
            sort: {
              by: 'name',
              direction: 'asc',
            },
          })
        })

        it('should return results', function () {
          expect(results).to.deep.equal(mockAllocations)
        })
      })

      context('when status includes cancelled', function () {
        beforeEach(async function () {
          results = await allocationService.getByDateAndLocation({
            status: 'cancelled',
            locations: [mockFromLocationId],
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(allocationService.get).to.be.calledOnceWithExactly({
            isAggregation: false,
            includeCancelled: true,
            page: undefined,
            include: getAllInclude,
            filter: {
              status: 'cancelled',
              from_locations: '',
              to_locations: '',
              locations: mockFromLocationId,
              date_from: undefined,
              date_to: undefined,
            },
            sort: {
              by: undefined,
              direction: undefined,
            },
          })
        })

        it('should return results', function () {
          expect(results).to.deep.equal(mockAllocations)
        })
      })
    })
  })

  describe('#getById', function () {
    let output, transformStub

    beforeEach(async function () {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(AllocationService, 'transform').callsFake(() => transformStub)
      sinon.stub(apiClient, 'find').resolves({
        data: mockAllocations[0],
      })

      output = await allocationService.getById(
        '8567f1a5-2201-4bc2-b655-f6526401303a'
      )
    })

    it('calls the api service', function () {
      expect(apiClient.find).to.have.been.calledOnceWithExactly(
        'allocation',
        '8567f1a5-2201-4bc2-b655-f6526401303a',
        {
          include: [
            'from_location',
            'moves',
            'moves.profile',
            'moves.profile.person',
            'moves.profile.person.ethnicity',
            'moves.profile.person.gender',
            'to_location',
          ],
        }
      )
    })

    it('should transform person object', function () {
      expect(transformStub.callCount).to.equal(1)
    })

    it('returns the data from the api service', function () {
      expect(output).to.deep.equal(mockAllocations[0])
    })
  })

  describe('#create', function () {
    let output, transformStub
    const mockData = {
      count: 5,
      category: 'C',
    }

    beforeEach(async function () {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(AllocationService, 'transform').callsFake(() => transformStub)
      sinon.stub(apiClient, 'create').resolves({
        data: mockAllocations[0],
      })
      sinon.stub(allocationService, 'format').returns({
        formattedData: {},
      })
      output = await allocationService.create(mockData)
    })

    it('formats the data', function () {
      expect(allocationService.format).to.have.been.calledWithExactly(mockData)
    })

    it('sends the data to the api', function () {
      expect(apiClient.create).to.have.been.calledWithExactly('allocation', {
        formattedData: {},
      })
    })

    it('should transform person object', function () {
      expect(transformStub.callCount).to.equal(1)
    })

    it('returns the response', function () {
      expect(output).to.deep.equal(mockAllocations[0])
    })
  })

  describe('#update', function () {
    let output, transformStub
    const mockData = {
      count: 5,
      category: 'C',
    }

    beforeEach(async function () {
      transformStub = sinon.stub().returnsArg(0)
      sinon.stub(AllocationService, 'transform').callsFake(() => transformStub)
      sinon.stub(apiClient, 'update').resolves({
        data: mockAllocations[0],
      })
      sinon.stub(allocationService, 'format').returns({
        formattedData: {},
      })
      output = await allocationService.update(mockData)
    })

    it('formats the data', function () {
      expect(allocationService.format).to.have.been.calledWithExactly(mockData)
    })

    it('sends the data to the api', function () {
      expect(apiClient.update).to.have.been.calledWithExactly('allocation', {
        formattedData: {},
      })
    })

    it('should transform person object', function () {
      expect(transformStub.callCount).to.equal(1)
    })

    it('returns the response', function () {
      expect(output).to.deep.equal(mockAllocations[0])
    })
  })
})
