const moveService = require('./move')
const singleRequestService = require('./single-request')

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

describe('Single request service', function() {
  describe('#getAll()', function() {
    let moves

    beforeEach(async function() {
      sinon.stub(moveService, 'getAll').resolves(mockMoves)
    })

    context('without arguments', function() {
      beforeEach(async function() {
        moves = await singleRequestService.getAll()
      })

      it('should call moves.getAll with default filter', function() {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          filter: {
            'filter[move_type]': 'prison_transfer',
          },
        })
      })

      it('should return moves', function() {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    describe('arguments', function() {
      const mockMoveDateRange = ['2019-10-10', '2019-10-11']
      const mockCreatedDateRange = ['2020-10-10', '2020-10-11']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      context('with all arguments', function() {
        beforeEach(async function() {
          moves = await singleRequestService.getAll({
            status: 'pending',
            moveDate: mockMoveDateRange,
            createdAtDate: mockCreatedDateRange,
            fromLocationId: mockFromLocationId,
            toLocationId: mockToLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            filter: {
              'filter[status]': 'proposed',
              'filter[date_from]': mockMoveDateRange[0],
              'filter[date_to]': mockMoveDateRange[1],
              'filter[created_at_from]': mockCreatedDateRange[0],
              'filter[created_at_to]': mockCreatedDateRange[1],
              'filter[from_location_id]': mockFromLocationId,
              'filter[to_location_id]': mockToLocationId,
              'filter[move_type]': 'prison_transfer',
            },
          })
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with some arguments', function() {
        beforeEach(async function() {
          moves = await singleRequestService.getAll({
            createdAtDate: mockCreatedDateRange,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: false,
            filter: {
              'filter[created_at_from]': mockCreatedDateRange[0],
              'filter[created_at_to]': mockCreatedDateRange[1],
              'filter[from_location_id]': mockFromLocationId,
              'filter[move_type]': 'prison_transfer',
            },
          })
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with aggregation', function() {
        beforeEach(async function() {
          moves = await singleRequestService.getAll({
            isAggregation: true,
            fromLocationId: mockFromLocationId,
          })
        })

        it('should call moves.getAll with correct args', function() {
          expect(moveService.getAll).to.be.calledOnceWithExactly({
            isAggregation: true,
            filter: {
              'filter[from_location_id]': mockFromLocationId,
              'filter[move_type]': 'prison_transfer',
            },
          })
        })

        it('should return moves', function() {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      describe('statuses', function() {
        context('with no status', function() {
          beforeEach(async function() {
            moves = await singleRequestService.getAll()
          })

          it('should call moves.getAll without status', function() {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              filter: {
                'filter[move_type]': 'prison_transfer',
              },
            })
          })

          it('should return moves', function() {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with pending status', function() {
          beforeEach(async function() {
            moves = await singleRequestService.getAll({
              status: 'pending',
            })
          })

          it('should call moves.getAll with correct statuses', function() {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              filter: {
                'filter[status]': 'proposed',
                'filter[move_type]': 'prison_transfer',
              },
            })
          })

          it('should return moves', function() {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with accepted status', function() {
          beforeEach(async function() {
            moves = await singleRequestService.getAll({
              status: 'accepted',
            })
          })

          it('should call moves.getAll with correct statuses', function() {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              filter: {
                'filter[status]': 'requested,accepted,completed',
                'filter[move_type]': 'prison_transfer',
              },
            })
          })

          it('should return moves', function() {
            expect(moves).to.deep.equal(mockMoves)
          })
        })

        context('with rejected status', function() {
          beforeEach(async function() {
            moves = await singleRequestService.getAll({
              status: 'rejected',
            })
          })

          it('should call moves.getAll with correct statuses', function() {
            expect(moveService.getAll).to.be.calledOnceWithExactly({
              isAggregation: false,
              filter: {
                'filter[status]': 'cancelled',
                'filter[cancellation_reason]': 'rejected',
                'filter[move_type]': 'prison_transfer',
              },
            })
          })

          it('should return moves', function() {
            expect(moves).to.deep.equal(mockMoves)
          })
        })
      })
    })
  })
})
