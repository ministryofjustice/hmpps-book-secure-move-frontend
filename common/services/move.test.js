const apiClient = require('../lib/api-client')()

const moveService = require('./move')
const personService = require('./person')

const mockMove = {
  id: 'b695d0f0-af8e-4b97-891e-92020d6820b9',
  status: 'requested',
  person: {
    id: 'f6e1f57c-7d07-41d2-afee-1662f5103e2d',
    first_names: 'Steve Jones',
    last_name: 'Bloggs',
  },
}
const mockMoves = [
  {
    id: '12345',
    status: 'requested',
    person: {
      name: 'Tom Jones',
    },
  },
  {
    id: '67890',
    status: 'cancelled',
    person: {
      name: 'Steve Bloggs',
    },
  },
]

describe('Move Service', function() {
  beforeEach(function() {
    sinon.stub(personService, 'transform').returnsArg(0)
  })

  describe('#format()', function() {
    const mockToLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockFromLocationId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'
    const mockPersonId = '0e180146-d911-49d8-a62e-63ea5cec7ba5'
    const mockPrisonTransferReasonId = '8387e205-97d1-4023-83c5-4f16f0c479d0'
    let formatted

    context('when relationship fields are a string', function() {
      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: mockToLocationId,
          from_location: mockFromLocationId,
          person: mockPersonId,
          prison_transfer_reason: mockPrisonTransferReasonId,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.to_location).to.deep.equal({
          id: mockToLocationId,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.from_location).to.deep.equal({
          id: mockFromLocationId,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.person).to.deep.equal({
          id: mockPersonId,
        })
      })

      it('should format as relationship object', function() {
        expect(formatted.prison_transfer_reason).to.deep.equal({
          id: mockPrisonTransferReasonId,
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('when relationship fields are not a string', function() {
      beforeEach(async function() {
        formatted = await moveService.format({
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

      it('should return its original value', function() {
        expect(formatted.to_location).to.deep.equal({
          id: mockToLocationId,
        })
      })

      it('should return its original value', function() {
        expect(formatted.from_location).to.deep.equal({
          id: mockFromLocationId,
        })
      })

      it('should return its original value', function() {
        expect(formatted.person).to.deep.equal({
          id: mockPersonId,
        })
      })

      it('should return its original value', function() {
        expect(formatted.prison_transfer_reason).to.deep.equal({
          id: mockPrisonTransferReasonId,
        })
      })

      it('should not affect non relationship fields', function() {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('with falsey values', function() {
      beforeEach(async function() {
        formatted = await moveService.format({
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
          empty_array: [],
        })
      })

      it('should remove falsey values', function() {
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
          empty_array: [],
        })
      })
    })
  })

  describe('#getAll()', function() {
    const mockResponse = {
      data: mockMoves,
      links: {},
    }
    const mockMultiPageResponse = {
      data: mockMoves,
      links: {
        next: 'http://next-page.com',
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
          moves = await moveService.getAll()
        })

        it('should call the API client once', function() {
          expect(apiClient.findAll).to.be.calledOnce
        })

        it('should call the API client with default options', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            page: 1,
            per_page: 100,
          })
        })

        it('should transform each person object', function() {
          expect(personService.transform.callCount).to.equal(mockMoves.length)
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with filter', function() {
        beforeEach(async function() {
          moves = await moveService.getAll({
            filter: mockFilter,
          })
        })

        it('should call the API client with filter', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            ...mockFilter,
            page: 1,
            per_page: 100,
          })
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
          moves = await moveService.getAll()
        })

        it('should call the API client twice', function() {
          expect(apiClient.findAll).to.be.calledTwice
        })

        it('should call API client with default options on first call', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            page: 1,
            per_page: 100,
          })
        })

        it('should call API client with second page on second call', function() {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly('move', {
            page: 2,
            per_page: 100,
          })
        })

        it('should transform each person object', function() {
          expect(personService.transform.callCount).to.equal(4)
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal([...mockMoves, ...mockMoves])
        })
      })

      context('with filter', function() {
        beforeEach(async function() {
          moves = await moveService.getAll({
            filter: mockFilter,
          })
        })

        it('should call API client with filter on first call', function() {
          expect(apiClient.findAll.firstCall).to.be.calledWithExactly('move', {
            ...mockFilter,
            page: 1,
            per_page: 100,
          })
        })

        it('should call API client with filter on second call', function() {
          expect(apiClient.findAll.secondCall).to.be.calledWithExactly('move', {
            ...mockFilter,
            page: 2,
            per_page: 100,
          })
        })
      })
    })
  })

  describe('#getRequested()', function() {
    const mockResponse = []
    let moves

    beforeEach(async function() {
      sinon.stub(moveService, 'getAll').resolves(mockResponse)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        moves = await moveService.getRequested()
      })

      it('should call getAll methods', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': 'requested',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': undefined,
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    context('with arguments', function() {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function() {
        moves = await moveService.getRequested({
          dateRange: mockDateRange,
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
        })
      })

      it('should call getAll with correct filter', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': 'requested',
            'filter[date_from]': mockDateRange[0],
            'filter[date_to]': mockDateRange[1],
            'filter[from_location_id]': mockFromLocationId,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockResponse)
      })
    })
  })

  describe('#getActive()', function() {
    let moves

    beforeEach(async function() {
      sinon.stub(moveService, 'getAll').resolves(mockMoves)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        moves = await moveService.getActive()
      })

      it('should call getAll with active statuses', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': 'requested,accepted,completed',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': undefined,
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    context('with arguments', function() {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function() {
        moves = await moveService.getActive({
          dateRange: mockDateRange,
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
        })
      })

      it('should call getAll with active statuses', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': 'requested,accepted,completed',
            'filter[date_from]': mockDateRange[0],
            'filter[date_to]': mockDateRange[1],
            'filter[from_location_id]': mockFromLocationId,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockMoves)
      })
    })
  })

  describe('#getCancelled()', function() {
    const mockResponse = []
    let moves

    beforeEach(async function() {
      sinon.stub(moveService, 'getAll').resolves(mockResponse)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        moves = await moveService.getCancelled()
      })

      it('should call getAll methods', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': 'cancelled',
            'filter[date_from]': undefined,
            'filter[date_to]': undefined,
            'filter[from_location_id]': undefined,
            'filter[to_location_id]': undefined,
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    context('with arguments', function() {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'c195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function() {
        moves = await moveService.getCancelled({
          dateRange: mockDateRange,
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
        })
      })

      it('should call getAll methods', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': 'cancelled',
            'filter[date_from]': mockDateRange[0],
            'filter[date_to]': mockDateRange[1],
            'filter[from_location_id]': mockFromLocationId,
            'filter[to_location_id]': mockToLocationId,
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockResponse)
      })
    })
  })

  describe('#getMovesByDateRangeAndStatus', function() {
    let moves
    const mockDateRange = ['2019-10-10', '2019-10-17']
    const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockStatus = 'booked'
    beforeEach(async function() {
      sinon.stub(moveService, 'getAll').resolves(['moves'])
    })
    context('with arguments', async function() {
      beforeEach(async function() {
        moves = await moveService.getMovesByDateRangeAndStatus({
          dateRange: mockDateRange,
          status: mockStatus,
          fromLocationId: mockFromLocationId,
        })
      })
      it('calls getAll', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': mockStatus,
            'filter[created_at_from]': mockDateRange[0],
            'filter[created_at_to]': mockDateRange[1],
            'filter[from_location_id]': mockFromLocationId,
          },
        })
      })
      it('returns moves', function() {
        expect(moves).to.deep.equal(['moves'])
      })
    })
    context('without arguments', function() {
      beforeEach(async function() {
        moves = await moveService.getMovesByDateRangeAndStatus()
      })
      it('calls getAll', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          filter: {
            'filter[status]': undefined,
            'filter[created_at_from]': undefined,
            'filter[created_at_to]': undefined,
            'filter[from_location_id]': undefined,
          },
        })
      })
      it('returns moves', function() {
        expect(moves).to.deep.equal(['moves'])
      })
    })
  })

  describe('#getMovesCount', function() {
    let count
    const mockDateRange = ['2019-10-10', '2019-10-17']
    const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockStatus = 'proposed'

    beforeEach(async function() {
      sinon.stub(apiClient, 'findAll').resolves({
        meta: {
          pagination: {
            total_objects: 10,
          },
        },
      })
    })
    context('with arguments', async function() {
      beforeEach(async function() {
        count = await moveService.getMovesCount({
          dateRange: mockDateRange,
          status: mockStatus,
          locationId: mockFromLocationId,
        })
      })
      it('calls the api service', function() {
        expect(apiClient.findAll).to.be.calledOnceWithExactly('move', {
          page: 1,
          per_page: 1,
          'filter[status]': mockStatus,
          'filter[created_at_from]': mockDateRange[0],
          'filter[created_at_to]': mockDateRange[1],
          'filter[from_location_id]': mockFromLocationId,
        })
      })
      it('returns the count', function() {
        expect(count).to.equal(10)
      })
    })
    context('without arguments', function() {
      beforeEach(async function() {
        count = await moveService.getMovesCount()
      })
      it('calls getAll', function() {
        expect(apiClient.findAll).to.be.calledOnceWithExactly('move', {
          page: 1,
          per_page: 1,
          'filter[status]': undefined,
          'filter[created_at_from]': undefined,
          'filter[created_at_to]': undefined,
          'filter[from_location_id]': undefined,
        })
      })
      it('returns moves', function() {
        expect(count).to.deep.equal(10)
      })
    })
  })

  describe('#getById()', function() {
    context('without move ID', function() {
      it('should reject with error', function() {
        return expect(moveService.getById()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function() {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: mockMove,
      }
      let move

      beforeEach(async function() {
        sinon.stub(apiClient, 'find').resolves(mockResponse)

        move = await moveService.getById(mockId)
      })

      it('should call update method with data', function() {
        expect(apiClient.find).to.be.calledOnceWithExactly('move', mockId)
      })

      it('should call person transformer with response data', function() {
        expect(personService.transform).to.be.calledOnceWithExactly(
          mockResponse.data.person
        )
      })

      it('should return move', function() {
        expect(move).to.deep.equal(mockResponse.data)
      })
    })
  })

  describe('#create()', function() {
    const mockData = {
      name: 'Steve Bloggs',
    }
    const mockResponse = {
      data: mockMove,
    }
    let move

    beforeEach(async function() {
      sinon.stub(apiClient, 'create').resolves(mockResponse)
      sinon.stub(moveService, 'format').returnsArg(0)

      move = await moveService.create(mockData)
    })

    it('should call create method with data', function() {
      expect(apiClient.create).to.be.calledOnceWithExactly('move', mockData)
    })

    it('should format data', function() {
      expect(moveService.format).to.be.calledOnceWithExactly(mockData)
    })

    it('should call person transformer with response data', function() {
      expect(personService.transform).to.be.calledOnceWithExactly(
        mockResponse.data.person
      )
    })

    it('should return move', function() {
      expect(move).to.deep.equal(mockResponse.data)
    })
  })

  describe('#cancel()', function() {
    context('without move ID', function() {
      it('should reject with error', function() {
        return expect(moveService.cancel()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function() {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: {
          ...mockMove,
          status: 'cancelled',
        },
      }
      let move

      beforeEach(async function() {
        sinon.stub(apiClient, 'update').resolves(mockResponse)
      })

      context('without data args', function() {
        beforeEach(async function() {
          move = await moveService.cancel(mockId)
        })

        it('should call update method with data', function() {
          expect(apiClient.update).to.be.calledOnceWithExactly('move', {
            id: mockId,
            status: 'cancelled',
            cancellation_reason: undefined,
            cancellation_reason_comment: undefined,
          })
        })

        it('should return move', function() {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })

      context('with data args', function() {
        beforeEach(async function() {
          move = await moveService.cancel(mockId, {
            reason: 'other',
            comment: 'Reason for cancelling',
          })
        })

        it('should call update method with data', function() {
          expect(apiClient.update).to.be.calledOnceWithExactly('move', {
            id: mockId,
            status: 'cancelled',
            cancellation_reason: 'other',
            cancellation_reason_comment: 'Reason for cancelling',
          })
        })

        it('should return move', function() {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })
    })
  })

  describe('#update()', function() {
    const mockResponse = {
      data: mockMove,
    }
    let move

    context('without move ID', function() {
      it('should reject with error', function() {
        return expect(moveService.update({})).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function() {
      beforeEach(async function() {
        sinon.stub(apiClient, 'update').resolves(mockResponse)
        sinon.stub(moveService, 'format').returnsArg(0)

        move = await moveService.update(mockMove)
      })

      it('should call update method with data', function() {
        expect(apiClient.update).to.be.calledOnceWithExactly('move', mockMove)
      })

      it('should format data', function() {
        expect(moveService.format).to.be.calledOnceWithExactly(mockMove)
      })

      it('should call person transformer with response data', function() {
        expect(personService.transform).to.be.calledOnceWithExactly(
          mockResponse.data.person
        )
      })

      it('should return move', function() {
        expect(move).to.deep.equal(mockResponse.data)
      })
    })
  })
})
