const { expect } = require('chai')

const presenters = require('../../../common/presenters')

const handler = require('./view')

describe('view allocation', function() {
  const allocationExample = {
    id: '06464fbd-b78a-4e47-b65c-8ab3c3867196',
    type: 'allocations',
    moves_count: 22,
    date: '2020-05-06',
    prisoner_category: 'c',
    sentence_length: 'long',
    complex_cases: [
      {
        title: 'Segregated prisoners',
        answer: true,
      },
      {
        title: 'Self harm / prisoners on ACCT',
        answer: true,
      },
      {
        title: 'Mental health issues',
        answer: false,
      },
      {
        title: 'Integrated Drug Treatment System',
        answer: false,
      },
    ],
    complete_in_full: false,
    other_criteria: 'no',
    created_at: '2020-05-01T10:44:00+01:00',
    updated_at: '2020-05-01T10:44:00+01:00',
    from_location: {
      title: 'BERWYN (HMP)',
      location_type: 'prison',
    },
    to_location: {
      title: 'GARTREE (HMP)',
      location_type: 'prison',
    },
    moves: [
      { id: '123' },
      {
        id: '456',
        person: {
          first_names: 'John',
          last_name: 'Doe',
        },
      },
      { id: '789' },
      {
        id: '011',
        person: {
          first_names: 'Phil',
          last_name: 'Jones',
        },
      },
    ],
  }
  let moveToCardComponentStub
  let mockReq
  let mockRes

  beforeEach(function() {
    moveToCardComponentStub = sinon.stub().returnsArg(0)
    sinon.stub(presenters, 'allocationToMetaListComponent').returns({})
    sinon.stub(presenters, 'allocationToSummaryListComponent').returns({})
    sinon
      .stub(presenters, 'moveToCardComponent')
      .callsFake(() => moveToCardComponentStub)

    mockReq = {
      t: sinon.stub().returnsArg(0),
    }
    mockRes = {
      render: sinon.stub(),
      locals: {
        allocation: { ...allocationExample },
      },
    }
  })

  context('with active allocation', function() {
    beforeEach(function() {
      handler(mockReq, mockRes)
    })

    describe('locals', function() {
      let locals

      beforeEach(function() {
        locals = mockRes.render.firstCall.lastArg
      })

      it('creates allocationDetails with result of the presenter', function() {
        expect(locals.allocationDetails).to.exist
        expect(
          presenters.allocationToMetaListComponent
        ).to.have.been.calledOnceWithExactly(mockRes.locals.allocation)
      })

      it('creates allocationSummary with result of the presenter', function() {
        expect(locals.allocationSummary).to.exist
        expect(
          presenters.allocationToSummaryListComponent
        ).to.have.been.calledOnceWithExactly(mockRes.locals.allocation)
      })

      it('does not create a message banner', function() {
        expect(locals.messageTitle).to.be.undefined
      })

      it('should create unassigned move ID', function() {
        expect(locals.unassignedMoveId).to.equal('123')
      })
    })

    it('calls render with the template', function() {
      expect(
        JSON.parse(JSON.stringify(mockRes.render.getCall(0).args))
      ).to.deep.equal([
        'allocation/views/view',
        {
          dashboardUrl: '/allocations',
          messageContent: 'allocations::statuses.description',
          unassignedMoveId: '123',
          allocationDetails: {},
          allocationSummary: {},
          allocationPeople: {
            emptySlots: 2,
            filledSlots: [
              {
                id: '456',
                person: { first_names: 'John', last_name: 'Doe' },
              },
              {
                id: '011',
                person: { first_names: 'Phil', last_name: 'Jones' },
              },
            ],
          },
        },
      ])
    })
  })

  context('with cancelled allocation', function() {
    let locals

    beforeEach(function() {
      mockRes.locals.allocation.status = 'cancelled'

      handler(mockReq, mockRes)
      locals = mockRes.render.firstCall.lastArg
    })

    it('does create a message banner title', function() {
      expect(locals.messageTitle).not.to.be.undefined
      expect(locals.messageTitle).to.equal('allocations::statuses.cancelled')
    })

    it('does create a message banner content', function() {
      expect(locals.messageContent).to.equal(
        'allocations::statuses.description'
      )
    })

    it('calls render with the template', function() {
      expect(mockRes.render).to.be.calledOnceWithExactly(
        'allocation/views/view',
        {
          dashboardUrl: '/allocations',
          messageTitle: 'allocations::statuses.cancelled',
          messageContent: 'allocations::statuses.description',
          unassignedMoveId: '123',
          allocationDetails: {},
          allocationSummary: {},
          allocationPeople: {
            emptySlots: 2,
            filledSlots: [
              {
                id: '456',
                person: { first_names: 'John', last_name: 'Doe' },
              },
              {
                id: '011',
                person: { first_names: 'Phil', last_name: 'Jones' },
              },
            ],
          },
        }
      )
    })
  })

  context('when all moves have been filled', function() {
    let locals

    beforeEach(function() {
      mockRes.locals.allocation.moves = [
        {
          id: '123',
          person: {
            first_names: 'James',
            last_name: 'Stevens',
          },
        },
        {
          id: '456',
          person: {
            first_names: 'Andrew',
            last_name: 'Collins',
          },
        },
        {
          id: '789',
          person: {
            first_names: 'John',
            last_name: 'Doe',
          },
        },
      ]

      handler(mockReq, mockRes)
      locals = mockRes.render.firstCall.lastArg
    })

    it('sould not create an unassigned move ID', function() {
      expect(locals.unassignedMoveId).to.be.undefined
    })
  })
})
