const presenters = require('../../../common/presenters')

const controller = require('./view')

describe('Allocation controllers', function () {
  describe('view allocation', function () {
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
          profile: {
            person: {
              first_names: 'John',
              last_name: 'Doe',
              _fullname: 'John Doe',
            },
          },
        },
        { id: '789' },
        {
          id: '011',
          profile: {
            person: {
              first_names: 'Phil',
              last_name: 'Jones',
              _fullname: 'Phil Jones',
            },
          },
        },
      ],
    }
    let moveToCardComponentStub
    let mockReq
    let mockRes

    beforeEach(function () {
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
        canAccess: sinon.stub().returns(false),
        allocation: { ...allocationExample },
        location: {
          location_type: 'prison',
        },
      }
      mockRes = {
        render: sinon.stub(),
        locals: {},
      }
    })

    context(
      'the creation of the link to remove a move from an allocation',
      function () {
        beforeEach(function () {
          mockReq.canAccess.callsFake(arg => arg === 'allocation:cancel')
          moveToCardComponentStub = sinon.stub()
        })

        it('does not create removeMoveHref if the move has a person', function () {
          controller(mockReq, mockRes)
          const { moves } = mockRes.render.firstCall.lastArg
          expect(moves[2].removeMoveHref).to.be.undefined
          expect(moves[3].removeMoveHref).to.be.undefined
        })

        it('does not create removeMoveHref if the user has no permission to cancel allocations', function () {
          mockReq.canAccess.callsFake(() => false)
          controller(mockReq, mockRes)
          const { moves } = mockRes.render.firstCall.lastArg

          for (const move of moves) {
            expect(move.removeMoveHref).to.be.undefined
          }
        })

        it('does not create removeMoveHref if there is just one move left', function () {
          mockReq.allocation.moves = [{ id: 1 }]
          controller(mockReq, mockRes)
          const { moves } = mockRes.render.firstCall.lastArg
          expect(moves[0].removeMoveHref).to.be.undefined
        })

        it('does otherwise create removeMoveHref', function () {
          mockReq.canAccess.callsFake(arg => arg === 'allocation:cancel')
          controller(mockReq, mockRes)
          const { moves } = mockRes.render.firstCall.lastArg
          expect(moves[0].removeMoveHref).to.equal(
            '/allocation/06464fbd-b78a-4e47-b65c-8ab3c3867196/789/remove'
          )
          expect(moves[1].removeMoveHref).to.equal(
            '/allocation/06464fbd-b78a-4e47-b65c-8ab3c3867196/123/remove'
          )
        })
      }
    )

    context('with active allocation', function () {
      beforeEach(function () {
        controller(mockReq, mockRes)
      })

      describe('locals', function () {
        let locals

        beforeEach(function () {
          locals = mockRes.render.firstCall.lastArg
        })

        it('creates `criteria` with result of the presenter', function () {
          expect(locals.criteria).to.equal('allocationToSummaryListComponent')
          expect(
            presenters.allocationToSummaryListComponent
          ).to.have.been.calledOnceWithExactly(mockReq.allocation)
        })

        it('creates `summary` with result of the presenter', function () {
          expect(locals.summary).to.equal('allocationToMetaListComponent')
          expect(
            presenters.allocationToMetaListComponent
          ).to.have.been.calledOnceWithExactly(mockReq.allocation)
        })

        it('does not create a message banner', function () {
          expect(locals.messageTitle).to.be.undefined
        })

        it('should order moves without person first', function () {
          const ordered = locals.moves.map(move => move.id)
          expect(ordered).to.deep.equal(['789', '123', '011', '456'])
        })

        it('should include moves without a person', function () {
          expect(locals.moves).to.have.length(4)
        })

        it('should include moves without a person', function () {
          expect(locals.allocation).to.deep.equal(allocationExample)
        })

        it('should contain correct number of locals', function () {
          expect(Object.keys(locals)).to.have.length(10)
        })
      })

      it('calls render with the template', function () {
        expect(mockRes.render).to.have.been.calledOnce
        expect(mockRes.render.args[0][0]).to.equal('allocation/views/view')
      })
    })

    context('with cancelled allocation', function () {
      let locals

      beforeEach(function () {
        mockReq.allocation.status = 'cancelled'

        controller(mockReq, mockRes)
        locals = mockRes.render.firstCall.lastArg
      })

      it('does create a message banner title', function () {
        expect(locals.messageTitle).not.to.be.undefined
        expect(locals.messageTitle).to.equal('statuses::cancelled')
      })

      it('should translate message banner title', function () {
        expect(mockReq.t).to.be.calledWithExactly('statuses::cancelled', {
          context: 'allocation',
        })
      })

      it('does create a message banner content', function () {
        expect(locals.messageContent).to.equal(
          'statuses::description_allocation'
        )
      })

      it('should translate message banner content', function () {
        expect(mockReq.t).to.be.calledWithExactly('statuses::cancelled', {
          context: 'allocation',
        })
      })
    })

    context('when user has permission to assign', function () {
      let locals

      beforeEach(function () {
        mockReq.canAccess.returns(true)
        controller(mockReq, mockRes)
        locals = mockRes.render.firstCall.lastArg
      })

      it('should filter out moves without a person', function () {
        expect(locals.moves).to.deep.equal([
          {
            id: '011',
            profile: {
              person: {
                first_names: 'Phil',
                last_name: 'Jones',
                _fullname: 'Phil Jones',
              },
            },
            removeMoveHref: undefined,
            card: {
              _canEdit: true,
              id: '011',
              profile: {
                person: {
                  first_names: 'Phil',
                  last_name: 'Jones',
                  _fullname: 'Phil Jones',
                },
              },
            },
          },
          {
            id: '456',
            profile: {
              person: {
                first_names: 'John',
                last_name: 'Doe',
                _fullname: 'John Doe',
              },
            },
            removeMoveHref: undefined,
            card: {
              _canEdit: true,
              id: '456',
              profile: {
                person: {
                  first_names: 'John',
                  last_name: 'Doe',
                  _fullname: 'John Doe',
                },
              },
            },
          },
        ])
      })
    })
  })
})
