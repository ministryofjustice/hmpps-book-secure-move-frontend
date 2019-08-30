const moveService = require('./move')
const personService = require('./person')
const apiClient = require('../lib/api-client')()

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

    context('when relationship field is string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: mockToLocationId,
          from_location: mockFromLocationId,
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

      it('should not affect non relationship fields', function() {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('when relationship field is not a string', function() {
      let formatted

      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: {
            id: mockToLocationId,
          },
          from_location: {
            id: mockFromLocationId,
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

      it('should not affect non relationship fields', function() {
        expect(formatted.date).to.equal('2010-10-10')
      })
    })

    context('with falsey values', function() {
      let formatted

      beforeEach(async function() {
        formatted = await moveService.format({
          date: '2010-10-10',
          to_location: {
            id: mockToLocationId,
          },
          from_location: mockFromLocationId,
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
          empty_array: [],
        })
      })
    })
  })

  describe('#getLocations()', function() {
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
          moves = await moveService.getMoves()
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
          moves = await moveService.getMoves({
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
          moves = await moveService.getMoves()
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
          moves = await moveService.getMoves({
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

  describe('#getRequestedMovesByDateAndLocation()', function() {
    const mockResponse = []
    let moves

    beforeEach(async function() {
      sinon.stub(moveService, 'getMoves').resolves(mockResponse)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        moves = await moveService.getRequestedMovesByDateAndLocation()
      })

      it('should call getMoves methods', function() {
        expect(moveService.getMoves).to.be.calledOnce
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockResponse)
      })

      describe('filters', function() {
        let filters

        beforeEach(function() {
          filters = moveService.getMoves.args[0][0].filter
        })

        it('should set status filter to "requested"', function() {
          expect(filters).to.contain.property('filter[status]')
          expect(filters['filter[status]']).to.equal('requested')
        })

        it('should set date_from filter to undefined', function() {
          expect(filters).to.contain.property('filter[date_from]')
          expect(filters['filter[date_from]']).to.equal(undefined)
        })

        it('should set date_to filter to undefined', function() {
          expect(filters).to.contain.property('filter[date_to]')
          expect(filters['filter[date_to]']).to.equal(undefined)
        })

        it('should set from_location_id filter to undefined', function() {
          expect(filters).to.contain.property('filter[from_location_id]')
          expect(filters['filter[from_location_id]']).to.equal(undefined)
        })
      })
    })

    context('with arguments', function() {
      const mockMoveDate = '2019-10-10'
      const mockLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'

      beforeEach(async function() {
        moves = await moveService.getRequestedMovesByDateAndLocation(
          mockMoveDate,
          mockLocationId
        )
      })

      it('should call getMoves methods', function() {
        expect(moveService.getMoves).to.be.calledOnce
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockResponse)
      })

      describe('filters', function() {
        let filters

        beforeEach(function() {
          filters = moveService.getMoves.args[0][0].filter
        })

        it('should set status filter to "requested"', function() {
          expect(filters).to.contain.property('filter[status]')
          expect(filters['filter[status]']).to.equal('requested')
        })

        it('should set date_from filter to move date', function() {
          expect(filters).to.contain.property('filter[date_from]')
          expect(filters['filter[date_from]']).to.equal(mockMoveDate)
        })

        it('should set date_to filter to move date', function() {
          expect(filters).to.contain.property('filter[date_to]')
          expect(filters['filter[date_to]']).to.equal(mockMoveDate)
        })

        it('should set from_location_id filter to location ID', function() {
          expect(filters).to.contain.property('filter[from_location_id]')
          expect(filters['filter[from_location_id]']).to.equal(mockLocationId)
        })
      })
    })
  })

  describe('#getMoveById()', function() {
    context('without move ID', function() {
      it('should reject with error', function() {
        return expect(moveService.getMoveById()).to.be.rejectedWith(
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

        move = await moveService.getMoveById(mockId)
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
})
