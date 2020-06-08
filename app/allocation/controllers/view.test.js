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
          fullname: 'John Doe',
        },
      },
      { id: '789' },
      {
        id: '011',
        person: {
          first_names: 'Phil',
          last_name: 'Jones',
          fullname: 'Phil Jones',
        },
      },
    ],
  }
  let moveToCardComponentStub
  let mockReq
  let mockRes

  beforeEach(function() {
    moveToCardComponentStub = sinon.stub().returnsArg(0)
    sinon
      .stub(presenters, 'allocationToMetaListComponent')
      .returns('allocationToMetaListComponent')
    sinon
      .stub(presenters, 'allocationToSummaryListComponent')
      .returns('allocationToSummaryListComponent')
    sinon
      .stub(presenters, 'moveToCardComponent')
      .callsFake(() => moveToCardComponentStub)

    mockReq = {
      t: sinon.stub().returnsArg(0),
      session: {
        user: { permissions: [] },
      },
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

      it('creates `criteria` with result of the presenter', function() {
        expect(locals.criteria).to.equal('allocationToSummaryListComponent')
        expect(
          presenters.allocationToSummaryListComponent
        ).to.have.been.calledOnceWithExactly(mockRes.locals.allocation)
      })

      it('creates `summary` with result of the presenter', function() {
        expect(locals.summary).to.equal('allocationToMetaListComponent')
        expect(
          presenters.allocationToMetaListComponent
        ).to.have.been.calledOnceWithExactly(mockRes.locals.allocation)
      })

      it('does not create a message banner', function() {
        expect(locals.messageTitle).to.be.undefined
      })

      it('should create unassigned move ID', function() {
        expect(locals.unassignedMoveId).to.equal('123')
      })

      it('should order moves without person first', function() {
        const ordered = locals.moves.map(move => move.id)
        expect(ordered).to.deep.equal(['789', '123', '011', '456'])
      })

      it('should include moves without a person', function() {
        expect(locals.moves).to.have.length(4)
      })

      it('should contain correct number of locals', function() {
        expect(Object.keys(locals)).to.have.length(10)
      })
    })

    it('calls render with the template', function() {
      expect(
        JSON.parse(JSON.stringify(mockRes.render.getCall(0).args))
      ).to.deep.equal([
        'allocation/views/view',
        {
          dashboardUrl: '/allocations',
          messageContent: 'statuses::description_allocation',
          unassignedMoveId: '123',
          totalCount: 4,
          remainingCount: 2,
          addedCount: 2,
          criteria: 'allocationToSummaryListComponent',
          summary: 'allocationToMetaListComponent',
          moves: [
            {
              id: '789',
              card: {
                id: '789',
              },
            },
            {
              id: '123',
              card: {
                id: '123',
              },
            },
            {
              id: '011',
              person: {
                first_names: 'Phil',
                last_name: 'Jones',
                fullname: 'Phil Jones',
              },
              card: {
                id: '011',
                person: {
                  first_names: 'Phil',
                  last_name: 'Jones',
                  fullname: 'Phil Jones',
                },
              },
            },
            {
              id: '456',
              person: {
                first_names: 'John',
                last_name: 'Doe',
                fullname: 'John Doe',
              },
              card: {
                id: '456',
                person: {
                  first_names: 'John',
                  last_name: 'Doe',
                  fullname: 'John Doe',
                },
              },
            },
          ],
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
      expect(locals.messageTitle).to.equal('statuses::cancelled')
    })

    it('should translate message banner title', function() {
      expect(mockReq.t).to.be.calledWithExactly('statuses::cancelled', {
        context: 'allocation',
      })
    })

    it('does create a message banner content', function() {
      expect(locals.messageContent).to.equal('statuses::description_allocation')
    })

    it('should translate message banner content', function() {
      expect(mockReq.t).to.be.calledWithExactly('statuses::cancelled', {
        context: 'allocation',
      })
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

    it('should not create an unassigned move ID', function() {
      expect(locals.unassignedMoveId).to.be.undefined
    })
  })

  context('when user has permission to assign', function() {
    let locals

    beforeEach(function() {
      mockReq.session.user.permissions = ['allocation:person:assign']

      handler(mockReq, mockRes)
      locals = mockRes.render.firstCall.lastArg
    })

    it('should filter out moves without a person', function() {
      expect(locals.moves).to.deep.equal([
        {
          id: '011',
          person: {
            first_names: 'Phil',
            last_name: 'Jones',
            fullname: 'Phil Jones',
          },
          card: {
            id: '011',
            person: {
              first_names: 'Phil',
              last_name: 'Jones',
              fullname: 'Phil Jones',
            },
          },
        },
        {
          id: '456',
          person: {
            first_names: 'John',
            last_name: 'Doe',
            fullname: 'John Doe',
          },
          card: {
            id: '456',
            person: {
              first_names: 'John',
              last_name: 'Doe',
              fullname: 'John Doe',
            },
          },
        },
      ])
    })
  })
})
