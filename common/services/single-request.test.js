const apiClient = require('../lib/api-client')()

const moveService = require('./move')
const singleRequestService = require('./single-request')

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

describe('Single request service', function () {
  describe('#getAll()', function () {
    let moves

    beforeEach(async function () {
      sinon.stub(moveService, 'getAll').resolves(mockMoves)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        moves = await singleRequestService.getAll()
      })

      it('should call moves.getAll with default filter', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          include: [
            'from_location',
            'to_location',
            'profile.person',
            'prison_transfer_reason',
          ],
          filter: {
            'filter[has_relationship_to_allocation]': false,
            'filter[move_type]': 'prison_transfer',
            'sort[by]': 'created_at',
            'sort[direction]': 'desc',
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    describe('arguments', function () {
      const mockMoveDateRange = ['2019-10-10', '2019-10-11']
      const mockCreatedDateRange = ['2020-10-10', '2020-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      context('with all arguments', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            status: 'pending',
            moveDate: mockMoveDateRange,
            createdAtDate: mockCreatedDateRange,
            fromLocationId: mockFromLocationId,
            toLocationId: mockToLocationId,
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            include: [
              'from_location',
              'to_location',
              'profile.person',
              'prison_transfer_reason',
            ],
            filter: {
              'filter[status]': 'proposed',
              'filter[has_relationship_to_allocation]': false,
              'filter[date_from]': mockMoveDateRange[0],
              'filter[date_to]': mockMoveDateRange[1],
              'filter[created_at_from]': mockCreatedDateRange[0],
              'filter[created_at_to]': mockCreatedDateRange[1],
              'filter[from_location_id]': mockFromLocationId,
              'filter[to_location_id]': mockToLocationId,
              'filter[move_type]': 'prison_transfer',
              'sort[by]': 'created_at',
              'sort[direction]': 'desc',
            },
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with some arguments', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            createdAtDate: mockCreatedDateRange,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            include: [
              'from_location',
              'to_location',
              'profile.person',
              'prison_transfer_reason',
            ],
            filter: {
              'filter[has_relationship_to_allocation]': false,
              'filter[created_at_from]': mockCreatedDateRange[0],
              'filter[created_at_to]': mockCreatedDateRange[1],
              'filter[from_location_id]': mockFromLocationId,
              'filter[move_type]': 'prison_transfer',
              'sort[by]': 'created_at',
              'sort[direction]': 'desc',
            },
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with sort by', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            sortBy: 'date_from',
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            include: [
              'from_location',
              'to_location',
              'profile.person',
              'prison_transfer_reason',
            ],
            filter: {
              'filter[has_relationship_to_allocation]': false,
              'filter[move_type]': 'prison_transfer',
              'sort[by]': 'date_from',
              'sort[direction]': 'desc',
            },
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with sort direction', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            isAggregation: true,
            sortDirection: 'asc',
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: true,
            include: [
              'from_location',
              'to_location',
              'profile.person',
              'prison_transfer_reason',
            ],
            filter: {
              'filter[has_relationship_to_allocation]': false,
              'filter[move_type]': 'prison_transfer',
              'sort[by]': 'created_at',
              'sort[direction]': 'asc',
            },
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with aggregation', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            isAggregation: true,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: true,
            include: [
              'from_location',
              'to_location',
              'profile.person',
              'prison_transfer_reason',
            ],
            filter: {
              'filter[has_relationship_to_allocation]': false,
              'filter[from_location_id]': mockFromLocationId,
              'filter[move_type]': 'prison_transfer',
              'sort[by]': 'created_at',
              'sort[direction]': 'desc',
            },
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      describe('statuses', function () {
        context('with no status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll()
          })

          it('should call moves.getAll without status', function () {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              include: [
                'from_location',
                'to_location',
                'profile.person',
                'prison_transfer_reason',
              ],
              filter: {
                'filter[has_relationship_to_allocation]': false,
                'filter[move_type]': 'prison_transfer',
                'sort[by]': 'created_at',
                'sort[direction]': 'desc',
              },
            })
          })

          it('should return moves', function () {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with pending status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'pending',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              include: [
                'from_location',
                'to_location',
                'profile.person',
                'prison_transfer_reason',
              ],
              filter: {
                'filter[status]': 'proposed',
                'filter[has_relationship_to_allocation]': false,
                'filter[move_type]': 'prison_transfer',
                'sort[by]': 'created_at',
                'sort[direction]': 'desc',
              },
            })
          })

          it('should return moves', function () {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with approved status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'approved',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              include: [
                'from_location',
                'to_location',
                'profile.person',
                'prison_transfer_reason',
              ],
              filter: {
                'filter[status]':
                  'requested,accepted,booked,in_transit,completed',
                'filter[has_relationship_to_allocation]': false,
                'filter[move_type]': 'prison_transfer',
                'sort[by]': 'created_at',
                'sort[direction]': 'desc',
              },
            })
          })

          it('should return moves', function () {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with rejected status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'rejected',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              include: [
                'from_location',
                'to_location',
                'profile.person',
                'prison_transfer_reason',
              ],
              filter: {
                'filter[status]': 'cancelled',
                'filter[has_relationship_to_allocation]': false,
                'filter[cancellation_reason]': 'rejected',
                'filter[move_type]': 'prison_transfer',
                'sort[by]': 'created_at',
                'sort[direction]': 'desc',
              },
            })
          })

          it('should return moves', function () {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with any other status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'other',
            })
          })

          it('should call moves.getAll with correct filter', function () {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              include: [
                'from_location',
                'to_location',
                'profile.person',
                'prison_transfer_reason',
              ],
              filter: {
                'filter[status]': 'other',
                'filter[has_relationship_to_allocation]': false,
                'filter[move_type]': 'prison_transfer',
                'sort[by]': 'created_at',
                'sort[direction]': 'desc',
              },
            })
          })

          it('should return moves', function () {
            expect(moves).to.deep.equal(mockMoves)
          })
        })
      })
    })
  })

  describe('#approve()', function () {
    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(singleRequestService.approve()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: {
          ...mockMove,
          status: 'requested',
        },
      }
      let move

      beforeEach(async function () {
        sinon.stub(apiClient, 'update').resolves(mockResponse)
      })

      context('without data args', function () {
        beforeEach(async function () {
          move = await singleRequestService.approve(mockId)
        })

        it('should call update method with data', function () {
          expect(apiClient.update).to.be.calledOnceWithExactly('move', {
            id: mockId,
            date: undefined,
            status: 'requested',
          })
        })

        it('should return move', function () {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })

      context('with data args', function () {
        beforeEach(async function () {
          move = await singleRequestService.approve(mockId, {
            date: '2020-10-10',
          })
        })

        it('should call update method with data', function () {
          expect(apiClient.update).to.be.calledOnceWithExactly('move', {
            id: mockId,
            date: '2020-10-10',
            status: 'requested',
          })
        })

        it('should return move', function () {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })
    })
  })

  describe('#reject()', function () {
    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(singleRequestService.reject()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockResponse = {
        data: {
          ...mockMove,
        },
      }
      let move

      beforeEach(async function () {
        sinon.stub(apiClient, 'all').returns(apiClient)
        sinon.stub(apiClient, 'one').returns(apiClient)
        sinon.stub(apiClient, 'post').resolves(mockResponse)
      })

      context('without comment', function () {
        beforeEach(async function () {
          move = await singleRequestService.reject(mockId, {
            review_decision: 'reject',
            rejection_reason: 'no_space',
            cancellation_reason_comment: undefined,
            rebook: 'true',
          })
        })

        it('should call update method with data', function () {
          expect(apiClient.post).to.be.calledOnceWithExactly({
            rejection_reason: 'no_space',
            cancellation_reason_comment: undefined,
            rebook: true,
            timestamp: sinon.match.string,
          })
        })

        it('should return move', function () {
          expect(move).to.deep.equal(mockResponse.data)
        })
      })

      context('with comment', function () {
        beforeEach(async function () {
          move = await singleRequestService.reject(mockId, {
            review_decision: 'reject',
            rejection_reason: 'no_transport',
            cancellation_reason_comment: 'No van available',
            rebook: 'false',
          })
        })

        it('should call update method with data', function () {
          expect(apiClient.post).to.be.calledOnceWithExactly({
            rejection_reason: 'no_transport',
            cancellation_reason_comment: 'No van available',
            rebook: false,
            timestamp: sinon.match.string,
          })
        })
      })
    })
  })
})
