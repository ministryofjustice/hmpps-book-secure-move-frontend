const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()
const personService = require('../services/person')
const profileService = require('../services/profile')

const formatISOStub = sinon.stub().returns('#timestamp')
const mockBatchSize = 30

const batchRequest = proxyquire('./batch-request', {
  '../../config': {
    LOCATIONS_BATCH_SIZE: mockBatchSize,
  },
})
const batchRequestStub = sinon.stub().callsFake(batchRequest)

const moveService = proxyquire('./move', {
  'date-fns': {
    formatISO: formatISOStub,
  },
  './batch-request': batchRequestStub,
})

const mockMove = {
  id: 'b695d0f0-af8e-4b97-891e-92020d6820b9',
  status: 'requested',
  profile: {
    person: {
      id: 'f6e1f57c-7d07-41d2-afee-1662f5103e2d',
      first_names: 'Steve Jones',
      last_name: 'Bloggs',
    },
  },
}
const mockMoves = [
  {
    id: '12345',
    status: 'requested',
    profile: {
      person: {
        name: 'Tom Jones',
      },
    },
  },
  {
    id: '67890',
    status: 'cancelled',
    profile: {
      person: {
        name: 'Steve Bloggs',
      },
    },
  },
]

describe('Move Service', function () {
  context('#transform', function () {
    const mockPerson = {
      id: '__person__',
    }
    const mockProfile = {
      id: '__profile__',
      person: mockPerson,
    }
    let move
    beforeEach(function () {
      sinon.stub(profileService, 'transform').callsFake(profile => {
        return {
          ...profile,
          person: profile.person,
        }
      })
      sinon.stub(personService, 'transform').callsFake(person => {
        return {
          ...person,
          foo: 'bar',
        }
      })
      move = moveService.transform({
        id: '__move__',
        profile: mockProfile,
        person: mockPerson,
      })
    })
    it('should transform the move profile', function () {
      expect(profileService.transform).to.be.calledOnceWithExactly(mockProfile)
    })
    it('should transform the move person', function () {
      expect(personService.transform).to.be.calledOnceWithExactly(mockPerson)
    })
    it('should add the person object as a direct property of the move', function () {
      expect(move.person).to.deep.equal({
        ...mockPerson,
        foo: 'bar',
      })
    })
  })
})

describe('Move Service', function () {
  beforeEach(function () {
    sinon.stub(moveService, 'transform').returnsArg(0)
  })

  describe('#format()', function () {
    const mockToLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockFromLocationId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'
    const mockPersonId = '0e180146-d911-49d8-a62e-63ea5cec7ba5'
    const mockPrisonTransferReasonId = '8387e205-97d1-4023-83c5-4f16f0c479d0'
    let formatted

    context('when relationship fields are a string', function () {
      beforeEach(function () {
        formatted = moveService.format({
          date: '2010-10-10',
          to_location: mockToLocationId,
          from_location: mockFromLocationId,
          person: mockPersonId,
          prison_transfer_reason: mockPrisonTransferReasonId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.to_location).to.deep.equal({
          id: mockToLocationId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.from_location).to.deep.equal({
          id: mockFromLocationId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.person).to.deep.equal({
          id: mockPersonId,
        })
      })

      it('should format as relationship object', function () {
        expect(formatted.prison_transfer_reason).to.deep.equal({
          id: mockPrisonTransferReasonId,
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('when relationship fields are not a string', function () {
      beforeEach(function () {
        formatted = moveService.format({
          date: '2010-10-10',
          to_location: {
            id: mockToLocationId,
          },
          from_location: {
            id: mockFromLocationId,
          },
          person: {
            id: mockPersonId,
          },
          prison_transfer_reason: {
            id: mockPrisonTransferReasonId,
          },
        })
      })

      it('should return its original value', function () {
        expect(formatted.to_location).to.deep.equal({
          id: mockToLocationId,
        })
      })

      it('should return its original value', function () {
        expect(formatted.from_location).to.deep.equal({
          id: mockFromLocationId,
        })
      })

      it('should return its original value', function () {
        expect(formatted.person).to.deep.equal({
          id: mockPersonId,
        })
      })

      it('should return its original value', function () {
        expect(formatted.prison_transfer_reason).to.deep.equal({
          id: mockPrisonTransferReasonId,
        })
      })

      it('should not affect non relationship fields', function () {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('with falsey values', function () {
      beforeEach(function () {
        formatted = moveService.format({
          date: '2010-10-10',
          to_location: {
            id: mockToLocationId,
          },
          from_location: mockFromLocationId,
          person: mockPersonId,
          prison_transfer_reason: {
            id: mockPrisonTransferReasonId,
          },
          empty_string: '',
          false: false,
          undefined: undefined,
          null: null,
          empty_array: [],
        })
      })

      it('should remove undefined values', function () {
        expect(formatted).to.deep.equal({
          date: '2010-10-10',
          to_location: {
            id: mockToLocationId,
          },
          from_location: {
            id: mockFromLocationId,
          },
          person: {
            id: mockPersonId,
          },
          prison_transfer_reason: {
            id: mockPrisonTransferReasonId,
          },
          empty_string: '',
          false: false,
          null: null,
          empty_array: [],
        })
      })
    })

    context('with strings that be booleans', function () {
      it('should treat `false` string as boolean', function () {
        const formatted = moveService.format({
          move_agreed: 'false',
        })
        expect(formatted.move_agreed).to.equal(false)
      })

      it('should treat `true` string as boolean', function () {
        const formatted = moveService.format({
          move_agreed: 'true',
        })
        expect(formatted.move_agreed).to.equal(true)
      })

      it('should treat `null` string as null', function () {
        const formatted = moveService.format({
          move_agreed: null,
        })
        expect(formatted.move_agreed).to.equal(null)
      })
    })
  })

  describe('#getAll()', function () {
    const mockResponse = {
      data: mockMoves,
      links: {},
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    const mockMultiPageResponse = {
      data: mockMoves,
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
    let moves

    beforeEach(function () {
      sinon.stub(apiClient, 'findAll')
    })

    context('when batching the request', function () {
      const props = { foo: 'bar' }
      beforeEach(async function () {
        apiClient.findAll.resolves(mockResponse)
        await moveService.getAll(props)
      })

      it('should invoke batching correctly', async function () {
        expect(batchRequestStub).to.be.calledOnce
        const batchArgs = batchRequestStub.firstCall.args
        expect(typeof batchArgs[0]).to.equal('function')
        expect(batchArgs[1]).to.deep.equal(props)
        expect(batchArgs[2]).to.deep.equal([
          'from_location_id',
          'to_location_id',
        ])
      })
    })

    context('with only one page', function () {
      beforeEach(function () {
        apiClient.findAll.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          moves = await moveService.getAll()
        })

        it('should call the API client once', function () {
          expect(apiClient.findAll).to.be.calledOnce
        })

        it('should call the API client with default options', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            page: 1,
            per_page: 100,
            include: undefined,
          })
        })

        it('should transform each person object', function () {
          expect(moveService.transform.callCount).to.equal(mockMoves.length)
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: mockFilter,
          })
        })

        it('should call the API client with filter', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            ...mockFilter,
            page: 1,
            per_page: 100,
            include: undefined,
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with from_location arguments as arrays', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: {
              'filter[from_location_id]': ['a', 'b'],
            },
          })
        })

        it('should call the API client with comma-delimited arguments', function () {
          expect(apiClient.findAll).to.be.calledOnceWithExactly('move', {
            'filter[from_location_id]': 'a,b',
            page: 1,
            per_page: 100,
            include: undefined,
          })
        })
      })

      context('with to_location arguments as arrays', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: {
              'filter[to_location_id]': ['a', 'b'],
            },
          })
        })

        it('should call the API client with comma-delimited arguments', function () {
          expect(apiClient.findAll).to.be.calledOnceWithExactly('move', {
            'filter[to_location_id]': 'a,b',
            page: 1,
            per_page: 100,
            include: undefined,
          })
        })
      })

      context('with aggregation', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: mockFilter,
            isAggregation: true,
          })
        })

        it('should call the API client with only one per page', function () {
          expect(apiClient.findAll).to.be.calledOnceWithExactly('move', {
            ...mockFilter,
            page: 1,
            per_page: 1,
            include: undefined,
          })
        })

        it('should return a count', function () {
          expect(moves).to.equal(10)
        })
      })
    })

    context('with multiple pages', function () {
      beforeEach(function () {
        apiClient.findAll
          .onFirstCall()
          .resolves(mockMultiPageResponse)
          .onSecondCall()
          .resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          moves = await moveService.getAll()
        })

        it('should call the API client twice', function () {
          expect(apiClient.findAll).to.be.calledTwice
        })

        it('should call API client with default options on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            page: 1,
            per_page: 100,
            include: undefined,
          })
        })

        it('should call API client with second page on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly('move', {
            page: 2,
            per_page: 100,
            include: undefined,
          })
        })

        it('should transform each person object', function () {
          expect(moveService.transform.callCount).to.equal(4)
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal([...mockMoves, ...mockMoves])
        })
      })

      context('with filter', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: mockFilter,
          })
        })

        it('should call API client with filter on first call', function () {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            ...mockFilter,
            page: 1,
            per_page: 100,
            include: undefined,
          })
        })

        it('should call API client with filter on second call', function () {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly('move', {
            ...mockFilter,
            page: 2,
            per_page: 100,
            include: undefined,
          })
        })
      })

      context('with aggregation', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: mockFilter,
            isAggregation: true,
          })
        })

        it('should call the API client with only one per page', function () {
          expect(apiClient.findAll).to.be.calledOnceWithExactly('move', {
            ...mockFilter,
            page: 1,
            per_page: 1,
            include: undefined,
          })
        })

        it('should return a count', function () {
          expect(moves).to.equal(10)
        })
      })

      context('with aggregation and batched requests', function () {
        const mockLocations = Array(mockBatchSize * 2)
          .fill()
          .map((v, i) => i)
        beforeEach(async function () {
          moves = await moveService.getAll({
            filter: {
              'filter[from_location_id]': mockLocations.join(','),
            },
            isAggregation: true,
          })
        })

        it('should return an combined count for all the batches', function () {
          expect(moves).to.equal(mockResponse.meta.pagination.total_objects * 2)
        })
      })
    })

    context('with next but no data', function () {
      beforeEach(async function () {
        apiClient.findAll.resolves(mockEmptyPageResponse)
        moves = await moveService.getAll()
      })

      it('should call the API client once', function () {
        expect(apiClient.findAll).to.be.calledOnce
      })

      it('should return no moves', function () {
        expect(moves).to.deep.equal([])
      })
    })

    const filters = ['filter[from_location_id]', 'filter[to_location_id]']
    filters.forEach(function (filter) {
      context(`when '${filter}' exceeds batch limit`, function () {
        const mockLocations = Array(150)
          .fill()
          .map((v, i) => i)
        const numberOfBatches = mockLocations.length / mockBatchSize

        beforeEach(async function () {
          apiClient.findAll.resolves(mockResponse)
          moves = await moveService.getAll({
            filter: {
              [filter]: mockLocations.join(','),
            },
          })
        })

        it('should split into correct amount of calls', function () {
          expect(apiClient.findAll).to.have.callCount(numberOfBatches)
        })

        for (let index = 0; index < numberOfBatches; index++) {
          it(`should call batch ${index + 1}`, function () {
            expect(apiClient.findAll).to.be.calledWithExactly('move', {
              [filter]: mockLocations
                .slice(
                  index * mockBatchSize,
                  index * mockBatchSize + mockBatchSize
                )
                .join(','),
              page: 1,
              per_page: 100,
              include: undefined,
            })
          })
        }
      })
    })

    context('when specifying include parameter', function () {
      beforeEach(async function () {
        apiClient.findAll.resolves(mockResponse)
        moves = await moveService.getAll({
          include: ['foo', 'bar'],
        })
      })

      it('should pass include parameter to the API client', function () {
        expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
          page: 1,
          per_page: 100,
          include: ['foo', 'bar'],
        })
      })
    })
  })

  describe('#getActive()', function () {
    let moves

    beforeEach(async function () {
      sinon.stub(moveService, 'getAll').resolves(mockMoves)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        moves = await moveService.getActive()
      })

      it('should call getAll with active statuses', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          filter: {
            'filter[status]': 'requested,accepted,booked,in_transit,completed',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': undefined,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    context('with arguments', function () {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function () {
        moves = await moveService.getActive({
          dateRange: mockDateRange,
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
        })
      })

      it('should call getAll with active statuses', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          filter: {
            'filter[status]': 'requested,accepted,booked,in_transit,completed',
            'filter[date_from]': mockDateRange[0],
            'filter[date_to]': mockDateRange[1],
            'filter[from_location_id]': mockFromLocationId,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    context('with aggregation', function () {
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function () {
        moves = await moveService.getActive({
          toLocationId: mockToLocationId,
          isAggregation: true,
        })
      })

      it('should call getAll with active statuses', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: true,
          filter: {
            'filter[status]': 'requested,accepted,booked,in_transit,completed',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockMoves)
      })
    })
  })

  describe('#getCancelled()', function () {
    const mockResponse = []
    let moves

    beforeEach(async function () {
      sinon.stub(moveService, 'getAll').resolves(mockResponse)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        moves = await moveService.getCancelled()
      })

      it('should call getAll methods', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          filter: {
            'filter[status]': 'cancelled',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': undefined,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    context('with arguments', function () {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'c195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function () {
        moves = await moveService.getCancelled({
          dateRange: mockDateRange,
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
        })
      })

      it('should call getAll methods', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          filter: {
            'filter[status]': 'cancelled',
            'filter[date_from]': mockDateRange[0],
            'filter[date_to]': mockDateRange[1],
            'filter[from_location_id]': mockFromLocationId,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    context('with aggregation', function () {
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function () {
        moves = await moveService.getCancelled({
          toLocationId: mockToLocationId,
          isAggregation: true,
        })
      })

      it('should call getAll with active statuses', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: true,
          filter: {
            'filter[status]': 'cancelled',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockResponse)
      })
    })
  })

  describe('#getById()', function () {
    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.getById()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: mockMove,
      }
      let move

      beforeEach(async function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)
      })

      context('when called without include parameter', function () {
        beforeEach(async function () {
          move = await moveService.getById(mockId)
        })
        it('should call find method with data', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly('move', mockId, {
            include: undefined,
          })
        })

        it('should call move transformer with response data', function () {
          expect(moveService.transform).to.be.calledOnceWithExactly(
            mockResponse.data
          )
        })

        it('should return move', function () {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })

      context('when called with include parameter', function () {
        beforeEach(async function () {
          move = await moveService.getById(mockId, {
            include: ['foo', 'bar'],
          })
        })
        it('should pass include paramter to api client', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly('move', mockId, {
            include: ['foo', 'bar'],
          })
        })
      })
    })
  })

  describe('#create()', function () {
    const mockData = {
      name: 'Steve Bloggs',
    }
    const mockResponse = {
      data: mockMove,
    }
    let move

    beforeEach(async function () {
      sinon.stub(apiClient, 'create').resolves(mockResponse)
      sinon.stub(moveService, 'format').returnsArg(0)

      move = await moveService.create(mockData)
    })

    it('should call create method with data', function () {
      expect(apiClient.create).to.be.calledOnceWithExactly('move', mockData)
    })

    it('should format data', function () {
      expect(moveService.format).to.be.calledOnceWithExactly(mockData)
    })

    it('should call move transformer with response data', function () {
      expect(moveService.transform).to.be.calledOnceWithExactly(
        mockResponse.data
      )
    })

    it('should return move', function () {
      expect(move).to.deep.equal(mockResponse.data)
    })
  })

  describe('#cancel()', function () {
    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.cancel()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: {
          ...mockMove,
          status: 'cancelled',
        },
      }
      let move

      beforeEach(async function () {
        sinon.stub(apiClient, 'update').resolves(mockResponse)
      })

      context('without data args', function () {
        beforeEach(async function () {
          move = await moveService.cancel(mockId)
        })

        it('should call update method with data', function () {
          expect(apiClient.update).to.be.calledOnceWithExactly('move', {
            id: mockId,
            status: 'cancelled',
            cancellation_reason: undefined,
            cancellation_reason_comment: undefined,
          })
        })

        it('should return move', function () {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })

      context('with data args', function () {
        beforeEach(async function () {
          move = await moveService.cancel(mockId, {
            reason: 'other',
            comment: 'Reason for cancelling',
          })
        })

        it('should call update method with data', function () {
          expect(apiClient.update).to.be.calledOnceWithExactly('move', {
            id: mockId,
            status: 'cancelled',
            cancellation_reason: 'other',
            cancellation_reason_comment: 'Reason for cancelling',
          })
        })

        it('should return move', function () {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })
    })
  })

  describe('#update()', function () {
    const mockResponse = {
      data: mockMove,
    }
    let move

    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.update({})).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      beforeEach(async function () {
        sinon.stub(apiClient, 'update').resolves(mockResponse)
        sinon.stub(moveService, 'format').returnsArg(0)

        move = await moveService.update(mockMove)
      })

      it('should call update method with data', function () {
        expect(apiClient.update).to.be.calledOnceWithExactly('move', mockMove)
      })

      it('should format data', function () {
        expect(moveService.format).to.be.calledOnceWithExactly(mockMove)
      })

      it('should call move transformer with response data', function () {
        expect(moveService.transform).to.be.calledOnceWithExactly(
          mockResponse.data
        )
      })

      it('should return move', function () {
        expect(move).to.deep.equal(mockResponse.data)
      })
    })
  })

  describe('#unassign()', function () {
    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.unassign()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: {
          ...mockMove,
          profile: null,
        },
      }

      beforeEach(async function () {
        sinon.stub(moveService, 'update').resolves(mockResponse)
      })

      context('without data args', function () {
        beforeEach(async function () {
          await moveService.unassign(mockId)
        })

        it('should call update method with data', function () {
          expect(moveService.update).to.be.calledOnceWithExactly({
            id: mockId,
            profile: {
              id: null,
            },
            move_agreed: null,
            move_agreed_by: null,
          })
        })
      })
    })
  })

  describe('#redirect()', function () {
    const mockRedirect = {
      id: '#moveId',
      to_location: {
        id: '#locationId',
      },
    }
    const mockResponse = {
      data: mockMove,
    }

    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.redirect({})).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const currentDate = new Date(2020, 1, 1, 0, 0)
      let clock
      beforeEach(async function () {
        clock = sinon.useFakeTimers({
          now: currentDate,
        })
        formatISOStub.resetHistory()
        sinon.stub(apiClient, 'post').resolves(mockResponse)
        sinon.spy(apiClient, 'all')
        sinon.spy(apiClient, 'one')

        await moveService.redirect(mockRedirect)
      })
      afterEach(function () {
        clock.restore()
      })

      it('should add the timestamp', function () {
        expect(formatISOStub).to.be.calledOnceWithExactly(currentDate)
      })

      it('should call redirect method with data', function () {
        expect(apiClient.one).to.be.calledOnceWithExactly('move', '#moveId')
        expect(apiClient.all).to.be.calledOnceWithExactly('redirect')
        expect(apiClient.post).to.be.calledOnceWithExactly({
          timestamp: '#timestamp',
          ...mockRedirect,
        })
      })
    })
  })
})
