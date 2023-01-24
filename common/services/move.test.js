const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const formatISOStub = sinon.stub().returns('#timestamp')

const restClient = sinon.stub()
restClient.post = sinon.stub()

const MoveService = proxyquire('./move', {
  'date-fns': {
    formatISO: formatISOStub,
  },
  '../lib/api-client/rest-client': restClient,
  '../helpers/move/can-cancel-move': sinon.stub().returns(true),
  '../helpers/move/can-edit-move': sinon.stub().returns(true),
})

const moveService = new MoveService({
  apiClient,
  canAccess: () => true,
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
  describe('default include', function () {
    it('should contain default include', function () {
      expect(moveService.defaultInclude()).to.deep.equal([
        'allocation',
        'court_hearings',
        'from_location',
        'from_location.suppliers',
        'prison_transfer_reason',
        'profile',
        'profile.documents',
        'profile.person',
        'profile.person.ethnicity',
        'profile.person.gender',
        'profile.person_escort_record',
        'profile.person_escort_record.flags',
        'profile.person_escort_record.framework',
        'profile.person_escort_record.prefill_source',
        'profile.person_escort_record.responses',
        'profile.person_escort_record.responses.nomis_mappings',
        'profile.person_escort_record.responses.question',
        'profile.person_escort_record.responses.question.descendants.**',
        'profile.youth_risk_assessment',
        'profile.youth_risk_assessment.flags',
        'profile.youth_risk_assessment.framework',
        'profile.youth_risk_assessment.prefill_source',
        'profile.youth_risk_assessment.responses',
        'profile.youth_risk_assessment.responses.nomis_mappings',
        'profile.youth_risk_assessment.responses.question',
        'profile.youth_risk_assessment.responses.question.descendants.**',
        'supplier',
        'to_location',
      ])
    })
  })

  describe('#format()', function () {
    const mockToLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    const mockFromLocationId = 'f6e1f57c-7d07-41d2-afee-1662f5103e2d'
    const mockPersonId = '0e180146-d911-49d8-a62e-63ea5cec7ba5'
    const mockSupplierId = 'a595d0f0-11e4-3218-6d06-a5cba3ec75ea'
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
          supplier: mockSupplierId,
        })
      })

      it('should format to_location as relationship object', function () {
        expect(formatted.to_location).to.deep.equal({
          id: mockToLocationId,
        })
      })

      it('should format from_location as relationship object', function () {
        expect(formatted.from_location).to.deep.equal({
          id: mockFromLocationId,
        })
      })

      it('should format person as relationship object', function () {
        expect(formatted.person).to.deep.equal({
          id: mockPersonId,
        })
      })

      it('should format prison_transfer_reason as relationship object', function () {
        expect(formatted.prison_transfer_reason).to.deep.equal({
          id: mockPrisonTransferReasonId,
        })
      })

      it('should format supplier as relationship object', function () {
        expect(formatted.supplier).to.deep.equal({
          id: mockSupplierId,
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
          supplier: {
            id: mockSupplierId,
          },
          empty_string: '',
          false: false,
          undefined,
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
          supplier: {
            id: mockSupplierId,
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

    context('with youth-like moves', function () {
      it('should downgrade the move type', function () {
        const formatted = moveService.format({
          move_type: 'secure_childrens_home',
        })
        expect(formatted.move_type).to.equal('prison_transfer')
      })
    })
  })

  describe('#get()', function () {
    const mockResponse = {
      data: mockMoves,
      links: {},
      meta: {
        pagination: {
          total_objects: 10,
        },
      },
    }
    let moves

    beforeEach(function () {
      sinon.stub(moveService, 'removeInvalid').returnsArg(0)
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'post')
    })

    beforeEach(function () {
      apiClient.post.resolves(mockResponse)
    })

    context('by default', function () {
      beforeEach(async function () {
        moves = await moveService.get()
      })

      it('should call the API client with default options', function () {
        expect(apiClient.all.firstCall).to.be.calledWithExactly('move')
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

      it('should return response', function () {
        expect(moves).to.deep.equal(mockResponse)
      })
    })

    describe('filter', function () {
      const mockFilter = {
        foo: 'bar',
        'fizz[buzz]': 'bang',
      }
      beforeEach(async function () {
        moves = await moveService.get({
          filter: mockFilter,
        })
      })

      it('should call with filter as payload', function () {
        expect(apiClient.post.args[0][0]).to.deep.equal({
          filter: mockFilter,
        })
      })
    })

    describe('params', function () {
      beforeEach(async function () {
        moves = await moveService.get({
          include: ['moves'],
          page: 3,
          perPage: 50,
          sort: {
            by: 'name',
            direction: 'asc',
          },
        })
      })

      it('should use correct values for query', function () {
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
        moves = await moveService.get({
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

    context('when specifying include parameter', function () {
      beforeEach(async function () {
        apiClient.post.resolves(mockResponse)
        moves = await moveService.get({
          include: ['foo', 'bar'],
        })
      })

      it('should pass include param to the API client', function () {
        expect(apiClient.post.args[0][1]).to.be.deep.include({
          include: ['foo', 'bar'],
        })
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
    const mockParams = {
      meta: 'vehicle_registration,expected_time_of_arrival,expected_collection_time',
    }
    let moves

    beforeEach(function () {
      sinon.stub(moveService, 'removeInvalid').returnsArg(0)
      sinon.stub(apiClient, 'all').returnsThis()
      sinon.stub(apiClient, 'post')
    })

    context('with only one page', function () {
      beforeEach(function () {
        apiClient.post.resolves(mockResponse)
      })

      context('by default', function () {
        beforeEach(async function () {
          moves = await moveService.getAll()
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
          expect(apiClient.post.args[0][0]).to.deep.equal({
            filter: mockFilter,
          })
        })
      })

      context('with params', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
            params: mockParams,
          })
        })

        it('should call the API client with params', function () {
          expect(apiClient.post.args[0][1]).to.deep.include(mockParams)
        })
      })

      context('with aggregation', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
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
          expect(moves).to.equal(10)
        })
      })

      context('with sort', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
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
          moves = await moveService.getAll({
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
          moves = await moveService.getAll()
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
          expect(moves).to.deep.equal([...mockMoves, ...mockMoves])
        })
      })

      context('with filter and params', function () {
        beforeEach(async function () {
          moves = await moveService.getAll({
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
          moves = await moveService.getAll({
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
          moves = await moveService.getAll({
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
        moves = await moveService.getAll()
      })

      it('should call the API client once', function () {
        expect(apiClient.post).to.be.calledOnce
      })

      it('should return no moves', function () {
        expect(moves).to.deep.equal([])
      })
    })
  })

  describe('#getActive()', function () {
    let moves

    beforeEach(function () {
      sinon.stub(moveService, 'getAll').resolves(mockMoves)
    })

    context('without arguments', function () {
      beforeEach(async function () {
        moves = await moveService.getActive()
      })

      it('should call getAll with active statuses', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: false,
          include: [
            'from_location',
            'important_events',
            'profile',
            'profile.person',
            'profile.person.gender',
            'profile.person_escort_record.flags',
            'profile.youth_risk_assessment',
            'to_location',
          ],
          params: {
            meta: 'vehicle_registration,expected_time_of_arrival,expected_collection_time',
          },
          filter: {
            status: undefined,
            date_from: undefined,
            date_to: undefined,
            from_location_id: '',
            to_location_id: '',
            supplier_id: undefined,
          },
        })
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal(mockMoves)
      })
    })

    context('with arguments', function () {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockFromLocationId = [
        'b695d0f0-af8e-4b97-891e-92020d6820b9',
        '8fadb516-f10a-45b1-91b7-a256196829f9',
      ]
      const mockToLocationId = [
        'b195d0f0-df8e-4b97-891e-92020d6820b9',
        '8fadb516-f10a-45b1-91b7-a256196829f9',
      ]
      const mockSupplierId = 'a595d0f0-11e4-3218-6d06-a5cba3ec75ea'

      beforeEach(async function () {
        moves = await moveService.getActive({
          dateRange: mockDateRange,
          fromLocationId: mockFromLocationId,
          toLocationId: mockToLocationId,
          supplierId: mockSupplierId,
          isAggregation: true,
        })
      })

      it('should call getAll with correct args', function () {
        expect(moveService.getAll).to.be.calledOnceWithExactly({
          isAggregation: true,
          include: [
            'from_location',
            'important_events',
            'profile',
            'profile.person',
            'profile.person.gender',
            'profile.person_escort_record.flags',
            'profile.youth_risk_assessment',
            'to_location',
          ],
          filter: {
            status: undefined,
            date_from: mockDateRange[0],
            date_to: mockDateRange[1],
            from_location_id: mockFromLocationId.join(','),
            to_location_id: mockToLocationId.join(','),
            supplier_id: mockSupplierId,
          },
          params: {
            meta: 'vehicle_registration,expected_time_of_arrival,expected_collection_time',
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
          moves = await moveService.getActive()
        })

        it('should call moves.getAll without status', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: undefined,
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with active status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'active',
          })
        })

        it('should call moves.getAll with correct statuses', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'requested,accepted,booked,in_transit,completed',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with incomplete status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'incomplete',
          })
        })

        it('should call moves.getAll with correct statuses', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'requested,accepted,booked',
            ready_for_transit: 'false',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with awaiting_collection status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'awaiting_collection',
          })
        })

        it('should call moves.getAll with correct statuses', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'requested,accepted,booked',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with ready_for_transit status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'ready_for_transit',
          })
        })

        it('should call moves.getAll with correct statuses', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'requested,accepted,booked',
            ready_for_transit: 'true',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with left_custody status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'left_custody',
          })
        })

        it('should call moves.getAll with correct statuses', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'in_transit,completed',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with cancelled status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'cancelled',
          })
        })

        it('should call moves.getAll with correct statuses', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'cancelled',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })

      context('with any other status', function () {
        beforeEach(async function () {
          moves = await moveService.getActive({
            status: 'other',
          })
        })

        it('should call moves.getAll with correct filter', function () {
          expect(moveService.getAll.args[0][0].filter).to.deep.include({
            status: 'other',
          })
        })

        it('should return moves', function () {
          expect(moves).to.deep.equal(mockMoves)
        })
      })
    })
  })

  describe('#getDownload()', function () {
    let moves

    beforeEach(function () {
      restClient.post.resetHistory()
      restClient.post.resolves('#download')
    })

    context('without arguments', function () {
      beforeEach(async function () {
        moves = await moveService.getDownload({})
      })

      it('should call getAll with all statuses', function () {
        expect(restClient.post).to.be.calledOnceWithExactly(
          {},
          '/moves/csv',
          {
            filter: {
              status:
                'requested,accepted,booked,in_transit,completed,cancelled',
            },
          },
          { format: 'text/csv' }
        )
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal('#download')
      })
    })

    context('with arguments', function () {
      const mockDateRange = ['2019-10-10', '2019-10-11']
      const mockCreatedRange = ['2019-10-01', '2019-10-21']
      const mockFromLocationId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
      const mockToLocationId = 'b195d0f0-df8e-4b97-891e-92020d6820b9'

      beforeEach(async function () {
        moves = await moveService.getDownload(
          {},
          {
            dateRange: mockDateRange,
            createdAtDate: mockCreatedRange,
            fromLocationId: mockFromLocationId,
            toLocationId: mockToLocationId,
          }
        )
      })

      it('should call getAll with all statuses', function () {
        expect(restClient.post).to.be.calledOnceWithExactly(
          {},
          '/moves/csv',
          {
            filter: {
              status:
                'requested,accepted,booked,in_transit,completed,cancelled',
              date_from: mockDateRange[0],
              date_to: mockDateRange[1],
              created_at_from: mockCreatedRange[0],
              created_at_to: mockCreatedRange[1],
              from_location_id: mockFromLocationId,
              to_location_id: mockToLocationId,
            },
          },
          {
            format: 'text/csv',
          }
        )
      })

      it('should return moves', function () {
        expect(moves).to.deep.equal('#download')
      })
    })
  })

  describe('#_getById()', function () {
    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService._getById()).to.be.rejectedWith(
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

      beforeEach(function () {
        sinon.stub(apiClient, 'find').resolves(mockResponse)
      })

      context('when called without include parameter', function () {
        beforeEach(async function () {
          move = await moveService._getById(mockId)
        })
        it('should call find method with data', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly('move', mockId, {})
        })

        it('should return move', function () {
          expect(move).to.deep.equal({
            ...mockResponse.data,
            _canCancel: true,
            _canEdit: true,
            _canEditPer: true,
            _isPerLocked: false,
          })
        })
      })

      context('when called with include parameter', function () {
        beforeEach(async function () {
          move = await moveService._getById(mockId, {
            include: ['boo', 'far'],
          })
        })
        it('should pass include paramter to api client', function () {
          expect(apiClient.find).to.be.calledOnceWithExactly('move', mockId, {
            include: ['boo', 'far'],
          })
        })
      })
    })
  })

  describe('#getById()', function () {
    const mockId = 'b695d0f0-af8e-4b97-891e-92020d6820b9'
    let move

    beforeEach(function () {
      sinon.stub(moveService, '_getById').resolves(mockMove)
    })

    context('#getById()', function () {
      beforeEach(async function () {
        move = await moveService.getById(mockId)
      })
      it('should call find method with data', function () {
        expect(moveService._getById).to.be.calledOnceWithExactly(mockId, {
          include: [
            ...moveService.defaultInclude(),
            'important_events',
            'profile.category',
          ],
        })
      })
      it('should return move', function () {
        expect(move).to.deep.equal(mockMove)
      })
    })

    context('#getByIdWithEvents()', function () {
      beforeEach(async function () {
        move = await moveService.getByIdWithEvents(mockId)
      })

      it('should call find method with data', function () {
        expect(moveService._getById).to.be.calledOnceWithExactly(mockId, {
          include: [
            ...moveService.defaultInclude(),
            'timeline_events',
            'timeline_events.eventable',
            'timeline_events.location',
            'timeline_events.court_location',
            'timeline_events.from_location',
            'timeline_events.to_location',
            'journeys.to_location',
            'journeys.from_location',
          ],
        })
      })

      it('should return move', function () {
        expect(move).to.deep.equal(mockMove)
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

    beforeEach(function () {
      sinon.stub(apiClient, 'create').resolves(mockResponse)
      sinon.stub(moveService, 'format').returnsArg(0)
    })

    context('without include', function () {
      beforeEach(async function () {
        move = await moveService.create(mockData)
      })

      it('should call create method with data', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly('move', mockData, {
          include: undefined,
        })
      })

      it('should format data', function () {
        expect(moveService.format).to.be.calledOnceWithExactly(mockData)
      })

      it('should return move', function () {
        expect(move).to.deep.equal(mockResponse.data)
      })
    })

    context('with include', function () {
      beforeEach(async function () {
        move = await moveService.create(mockData, { include: ['foo', 'bar'] })
      })

      it('should call create method with data', function () {
        expect(apiClient.create).to.be.calledOnceWithExactly('move', mockData, {
          include: ['foo', 'bar'],
        })
      })

      it('should format data', function () {
        expect(moveService.format).to.be.calledOnceWithExactly(mockData)
      })

      it('should return move', function () {
        expect(move).to.deep.equal(mockResponse.data)
      })
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
        },
      }
      let move

      beforeEach(function () {
        sinon.stub(apiClient, 'post').resolves(mockResponse)
        sinon.spy(apiClient, 'one')
        sinon.spy(apiClient, 'all')
      })

      context('with correct data supplied', function () {
        beforeEach(async function () {
          move = await moveService.cancel(mockId, {
            reason: 'other',
            comment: 'Reason for cancelling',
          })
        })

        it('should call the service to post a cancel', function () {
          expect(apiClient.post).to.be.calledOnceWithExactly({
            cancellation_reason: 'other',
            cancellation_reason_comment: 'Reason for cancelling',
            timestamp: sinon.match.string,
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

      beforeEach(function () {
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

  describe('#accept()', function () {
    const mockId = '#moveId'
    const mockResponse = {
      data: mockMove,
    }

    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.accept()).to.be.rejectedWith(
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

        await moveService.accept(mockId)
      })
      afterEach(function () {
        clock.restore()
      })

      it('should add the timestamp', function () {
        expect(formatISOStub).to.be.calledOnceWithExactly(currentDate)
      })

      it('should call accept method with data', function () {
        expect(apiClient.one).to.be.calledOnceWithExactly('move', '#moveId')
        expect(apiClient.all).to.be.calledOnceWithExactly('accept')
        expect(apiClient.post).to.be.calledOnceWithExactly({
          timestamp: '#timestamp',
        })
      })
    })
  })

  describe('#complete()', function () {
    const mockId = '#moveId'
    const mockResponse = {
      data: mockMove,
    }

    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.complete()).to.be.rejectedWith(
          'No move ID supplied'
        )
      })
    })

    context('with move ID', function () {
      const currentDate = new Date(2020, 1, 1, 0, 0)
      let clock

      beforeEach(function () {
        clock = sinon.useFakeTimers({
          now: currentDate,
        })
        formatISOStub.resetHistory()
        sinon.stub(apiClient, 'post').resolves(mockResponse)
        sinon.spy(apiClient, 'all')
        sinon.spy(apiClient, 'one')
      })

      afterEach(function () {
        clock.restore()
      })

      context('without data', function () {
        beforeEach(async function () {
          await moveService.complete(mockId)
        })

        it('should add the timestamp', function () {
          expect(formatISOStub).to.be.calledOnceWithExactly(currentDate)
        })

        it('should call complete method with timestamp', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly('move', '#moveId')
          expect(apiClient.all).to.be.calledOnceWithExactly('complete')
          expect(apiClient.post).to.be.calledOnceWithExactly({
            timestamp: '#timestamp',
          })
        })
      })

      context('with data', function () {
        beforeEach(async function () {
          await moveService.complete(mockId, {
            notes: 'Lorem ipsum',
          })
        })

        it('should add the timestamp', function () {
          expect(formatISOStub).to.be.calledOnceWithExactly(currentDate)
        })

        it('should call complete method with data', function () {
          expect(apiClient.one).to.be.calledOnceWithExactly('move', '#moveId')
          expect(apiClient.all).to.be.calledOnceWithExactly('complete')
          expect(apiClient.post).to.be.calledOnceWithExactly({
            timestamp: '#timestamp',
            notes: 'Lorem ipsum',
          })
        })
      })
    })
  })

  describe('#start()', function () {
    const mockId = '#moveId'
    const mockResponse = {
      data: mockMove,
    }

    context('without move ID', function () {
      it('should reject with error', function () {
        return expect(moveService.start()).to.be.rejectedWith(
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

        await moveService.start(mockId)
      })
      afterEach(function () {
        clock.restore()
      })

      it('should add the timestamp', function () {
        expect(formatISOStub).to.be.calledOnceWithExactly(currentDate)
      })

      it('should call start method', function () {
        expect(apiClient.one).to.be.calledOnceWithExactly('move', '#moveId')
        expect(apiClient.all).to.be.calledOnceWithExactly('start')
        expect(apiClient.post).to.be.calledOnceWithExactly({
          timestamp: '#timestamp',
        })
      })
    })
  })
})
