const apiClient = require('../lib/api-client')()

const MoveService = require('./move')
const moveService = new MoveService({ apiClient })
const SingleRequestService = require('./single-request')
const singleRequestService = new SingleRequestService({
  apiClient,
  services: { move: moveService },
})

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
    date_from: '2020-08-25',
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

    beforeEach(function () {
      sinon.stub(moveService, 'get').resolves(mockMoves)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        moves = await singleRequestService.getAll()
      })

      it('should call moves.getAll with default filter', function () {
        expect(moveService.get).to.be.calledOnceWithExactly({
          isAggregation: false,
          include: [
            'from_location',
            'to_location',
            'profile.person',
            'prison_transfer_reason',
          ],
          filter: {
            status: undefined,
            has_relationship_to_allocation: 'false',
            from_location_id: '',
            to_location_id: '',
            date_from: undefined,
            date_to: undefined,
            date_of_birth_from: undefined,
            date_of_birth_to: undefined,
            created_at_from: undefined,
            created_at_to: undefined,
            move_type: 'prison_transfer',
          },
          sort: {
            by: 'created_at',
            direction: 'desc',
          },
          page: undefined,
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    describe('arguments', function () {
      const mockMoveDateRange = ['2019-10-10', '2019-10-11']
      const mockCreatedDateRange = ['2020-10-10', '2020-10-11']
      const mockFromLocationId = [
        'b695d0f0-af8e-4b97-891e-92020d6820b9',
        '8fadb516-f10a-45b1-91b7-a256196829f9',
      ]
      const mockToLocationId = [
        'b195d0f0-df8e-4b97-891e-92020d6820b9',
        '8fadb516-f10a-45b1-91b7-a256196829f9',
      ]
      const mockDOBFrom = '2000-01-01'
      const mockDOBTo = '2010-01-01'

      context('with all arguments', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            status: 'pending',
            moveDate: mockMoveDateRange,
            createdAtDate: mockCreatedDateRange,
            fromLocationId: mockFromLocationId,
            toLocationId: mockToLocationId,
            dateOfBirthFrom: mockDOBFrom,
            dateOfBirthTo: mockDOBTo,
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.get.args[0][0]).to.deep.include({
            filter: {
              status: 'proposed',
              has_relationship_to_allocation: 'false',
              date_from: mockMoveDateRange[0],
              date_to: mockMoveDateRange[1],
              date_of_birth_from: mockDOBFrom,
              date_of_birth_to: mockDOBTo,
              created_at_from: mockCreatedDateRange[0],
              created_at_to: mockCreatedDateRange[1],
              from_location_id: mockFromLocationId.join(','),
              to_location_id: mockToLocationId.join(','),
              move_type: 'prison_transfer',
            },
          })
        })
      })

      context('with sort', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            sortBy: 'date_from',
            sortDirection: 'dir_asc',
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.get.args[0][0]).to.deep.include({
            sort: {
              by: 'date_from',
              direction: 'dir_asc',
            },
          })
        })
      })

      context('with include', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            include: ['foo', 'bar'],
          })
        })

        it('should call moves.getAll with defined include', function () {
          expect(moveService.get.args[0][0]).to.deep.include({
            include: ['foo', 'bar'],
          })
        })
      })

      context('with page', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            page: 3,
          })
        })

        it('should call moves.getAll with defined include', function () {
          expect(moveService.get.args[0][0]).to.deep.include({
            page: 3,
          })
        })
      })

      context('with aggregation', function () {
        beforeEach(async function () {
          moves = await singleRequestService.getAll({
            isAggregation: true,
          })
        })

        it('should call moves.getAll with correct args', function () {
          expect(moveService.get.args[0][0]).to.deep.include({
            isAggregation: true,
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
            expect(moveService.get.args[0][0].filter).to.deep.include({
              status: undefined,
            })
          })
        })

        context('with pending status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'pending',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.get.args[0][0].filter).to.deep.include({
              status: 'proposed',
            })
          })
        })

        context('with approved status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'approved',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.get.args[0][0].filter).to.deep.include({
              status: 'requested,accepted,booked,in_transit,completed',
            })
          })
        })

        context('with rejected status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'rejected',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.get.args[0][0].filter).to.deep.include({
              status: 'cancelled',
              cancellation_reason: 'rejected',
            })
          })
        })

        context('with cancelled status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'cancelled',
            })
          })

          it('should call moves.getAll with correct statuses', function () {
            expect(moveService.get.args[0][0].filter).to.deep.include({
              status: 'cancelled',
              cancellation_reason:
                'made_in_error,supplier_declined_to_move,cancelled_by_pmu,other',
            })
          })
        })

        context('with any other status', function () {
          beforeEach(async function () {
            moves = await singleRequestService.getAll({
              status: 'other',
            })
          })

          it('should call moves.getAll with correct filter', function () {
            expect(moveService.get.args[0][0].filter).to.deep.include({
              status: 'other',
            })
          })
        })
      })
    })
  })

  describe('#getDownload()', function () {
    let moves

    beforeEach(function () {
      sinon.stub(moveService, 'getDownload').resolves('#download')
    })

    context('with arguments', function () {
      beforeEach(async function () {
        moves = await singleRequestService.getDownload(
          {},
          {
            foo: 'bar',
          }
        )
      })

      it('should call getAll with existing args and include', function () {
        expect(moveService.getDownload).to.be.calledOnceWithExactly(
          {},
          {
            foo: 'bar',
          }
        )
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal('#download')
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

      beforeEach(function () {
        sinon.stub(apiClient, 'all').returns(apiClient)
        sinon.stub(apiClient, 'one').returns(apiClient)
        sinon.stub(apiClient, 'post').resolves(mockResponse)
      })

      context('without data args', function () {
        beforeEach(async function () {
          move = await singleRequestService.approve(mockId)
        })

        it('should call update method with data', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly('move', mockId)
          expect(apiClient.all).to.be.calledOnceWithExactly('approve')
          expect(apiClient.post).to.be.calledOnceWithExactly({
            date: undefined,
            timestamp: sinon.match.string,
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
          expect(apiClient.one).to.be.calledOnceWithExactly('move', mockId)
          expect(apiClient.all).to.be.calledOnceWithExactly('approve')
          expect(apiClient.post).to.be.calledOnceWithExactly({
            date: '2020-10-10',
            timestamp: sinon.match.string,
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

      beforeEach(function () {
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
