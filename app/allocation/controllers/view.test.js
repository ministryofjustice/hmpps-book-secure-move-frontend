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
      {},
      {},
      {
        person: {
          first_names: 'John',
          last_name: 'Doe',
        },
      },
    ],
  }

  context('Active allocation', function() {
    let locals
    let render
    let output
    let moveToCardComponentStub
    beforeEach(function() {
      moveToCardComponentStub = sinon.stub().returnsArg(0)
      sinon.stub(presenters, 'allocationToMetaListComponent').returns({})
      sinon.stub(presenters, 'allocationToSummaryListComponent').returns({})
      sinon
        .stub(presenters, 'moveToCardComponent')
        .callsFake(() => moveToCardComponentStub)
      render = sinon.stub()
      locals = { allocation: { ...allocationExample } }
      handler(
        {
          t: sinon.stub().returnsArg(0),
        },
        {
          locals,
          render,
        }
      )
      output = render.firstCall.lastArg
    })

    it('creates allocationDetails on locals with the result of the correct presenter', function() {
      expect(output.allocationDetails).to.exist
      expect(
        presenters.allocationToMetaListComponent
      ).to.have.been.calledOnceWithExactly(locals.allocation)
    })

    it('creates allocationSummary on locals with the result of the correct presenter', function() {
      expect(output.allocationSummary).to.exist
      expect(
        presenters.allocationToSummaryListComponent
      ).to.have.been.calledOnceWithExactly(locals.allocation)
    })

    it('does not create a message banner if the status is not cancelled', function() {
      expect(output.messageTitle).to.be.undefined
    })

    it('calls render with the template', function() {
      expect(render).to.have.been.calledWithExactly('allocation/views/view', {
        allocationDetails: {},
        allocationSummary: {},
        allocationPeople: {
          emptySlots: 2,
          filledSlots: [
            {
              person: {
                first_names: 'John',
                last_name: 'Doe',
              },
            },
          ],
        },
        messageContent: 'allocations::statuses.description',
        messageTitle: undefined,
        dashboardUrl: '/allocations',
      })
    })
  })

  context('Cancelled allocation', function() {
    let locals
    let render
    let output
    beforeEach(function() {
      sinon.stub(presenters, 'allocationToMetaListComponent').returns({})
      sinon.stub(presenters, 'allocationToSummaryListComponent').returns({})
      render = sinon.stub()
      locals = { allocation: { ...allocationExample } }
      locals.allocation.status = 'cancelled'
      handler(
        {
          t: sinon.stub().returnsArg(0),
        },
        {
          locals,
          render,
        }
      )
      output = render.firstCall.lastArg
    })
    it('does create a message banner title if the status is cancelled', function() {
      expect(output.messageTitle).not.to.be.undefined
      expect(output.messageTitle).to.equal('allocations::statuses.cancelled')
    })
    it('does create a message banner content if the status is cancelled', function() {
      expect(output.messageContent).to.equal(
        'allocations::statuses.description'
      )
    })
  })
})
