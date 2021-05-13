const proxyquire = require('proxyquire')
const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const getUpdateLinks = sinon.stub().returns({})

const moveToMetaListComponent = proxyquire('./move-to-meta-list-component', {
  '../helpers/move/get-update-links': getUpdateLinks,
})

const mockMove = {
  _hasLeftCustody: false,
  date: '2019-06-09',
  time_due: '2000-01-01T14:00:00Z',
  move_type: 'court_appearance',
  from_location: {
    title: 'HMP Leeds',
  },
  to_location: {
    title: 'Barrow in Furness County Court',
  },
}

const canAccess = sinon.stub()
const updateSteps = ['a', 'b']

describe('Presenters', function () {
  describe('#moveToMetaListComponent()', function () {
    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
      sinon.stub(i18n, 't').returns('__translated__')
      getUpdateLinks.resetHistory()
    })

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(
          mockMove,
          canAccess,
          updateSteps
        )
      })

      describe('response', function () {
        it('should get the actions', function () {
          expect(getUpdateLinks).to.be.calledOnceWithExactly(
            {
              _hasLeftCustody: false,
              id: mockMove.id,
              move_type: mockMove.move_type,
            },
            canAccess,
            updateSteps
          )
        })

        it('should contain items list', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(7)
        })

        it('should contain from location as first item', function () {
          const item = transformedResponse.items[0]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.from_location.title },
          })
        })

        it('should contain to location as second item', function () {
          const item = transformedResponse.items[1]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: mockMove.to_location.title,
            },
            action: undefined,
          })
        })

        it('should contain date as third item', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date },
            action: undefined,
          })
        })

        it('should call date filter correct number of times', function () {
          expect(filters.formatDateWithRelativeDay).to.have.callCount(1)
        })

        it('should contain empty date from as forth item', function () {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should contain empty date to as fifth item', function () {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should contain transfer type as sixth item', function () {
          const item = transformedResponse.items[5]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should contain agreement status as seventh item', function () {
          const item = transformedResponse.items[6]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })
      })

      describe('translations', function () {
        it('should translate from location label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::from_location.short_label'
          )
        })

        it('should translate to location label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.short_label'
          )
        })

        it('should translate date label', function () {
          expect(i18n.t).to.be.calledWithExactly('fields::date_type.label')
        })

        it('should translate date from label', function () {
          expect(i18n.t).to.be.calledWithExactly('fields::date_from.label')
        })

        it('should translate date to label', function () {
          expect(i18n.t).to.be.calledWithExactly('fields::date_to.label')
        })

        it('should translate prison transfer type label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::prison_transfer_type.label'
          )
        })

        it('should translate agreement status type label', function () {
          expect(i18n.t).to.be.calledWithExactly('fields::move_agreed.label')
        })

        it('should translate correct number of times', function () {
          expect(i18n.t).to.be.callCount(9)
        })
      })
    })

    context('with only `date from`', function () {
      const mockMove = {
        date_from: '2020-05-01',
      }
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function () {
        it('should render `date from` row', function () {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date_from },
          })
        })

        it('should not render `date to` row', function () {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should not render `date` row', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
            action: undefined,
          })
        })

        it('should format date from', function () {
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            mockMove.date_from
          )
        })
      })
    })

    context('with both `date from` and `date to`', function () {
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-10',
      }
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function () {
        it('should render `date from` row', function () {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date_from },
          })
        })

        it('should render `date to` row', function () {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date_to },
          })
        })

        it('should not render `date` row', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
            action: undefined,
          })
        })

        it('should format date from', function () {
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            mockMove.date_from
          )
        })

        it('should format date to', function () {
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            mockMove.date_to
          )
        })
      })
    })

    context('with all dates', function () {
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-10',
        date: '2020-06-01',
      }
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function () {
        it('should not render `date from` row', function () {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should not render `date to` row', function () {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should render `date` row', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date },
            action: undefined,
          })
        })

        it('should format date', function () {
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            mockMove.date
          )
        })
      })
    })

    context('when provided with an action', function () {
      let transformedResponse
      const moveAction = {
        href: '/move',
        html: 'Update move',
      }
      const dateAction = {
        href: '/date',
        html: 'Update date',
      }

      const expectedMoveAction = {
        ...moveAction,
        classes: 'app-meta-list__action--sidebar',
      }
      const expectedDateAction = {
        ...dateAction,
        classes: 'app-meta-list__action--sidebar',
      }

      it('should add actions to move and date items', function () {
        getUpdateLinks.returns({
          move: moveAction,
          date: dateAction,
        })
        transformedResponse = moveToMetaListComponent(
          mockMove,
          canAccess,
          updateSteps
        )
        const { items } = transformedResponse
        expect(items[0].action).to.be.undefined
        expect(items[1].action).to.deep.equal(expectedMoveAction)
        expect(items[2].action).to.deep.equal(expectedDateAction)
      })

      it('should add actions to move and date items', function () {
        getUpdateLinks.returns({
          date: dateAction,
        })
        transformedResponse = moveToMetaListComponent(
          mockMove,
          canAccess,
          updateSteps
        )
        const { items } = transformedResponse
        expect(items[1].action).to.be.undefined
        expect(items[2].action).to.deep.equal(expectedDateAction)
      })
    })

    context('with additional information', function () {
      const mockAdditionalInformation =
        'Some additional information about this move'
      let transformedResponse

      context('with prison recall move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'prison_recall',
            additional_information: mockAdditionalInformation,
          })
        })

        it('should add additional information to move type', function () {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `__translated__ — ${mockAdditionalInformation}`,
            },
            action: undefined,
          })
        })

        it('should not add additional information to transfer reason', function () {
          expect(transformedResponse.items[6]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: undefined,
            },
          })
        })

        it('should translate label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
        })
      })

      context('with video remand move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'video_remand',
            additional_information: mockAdditionalInformation,
          })
        })

        it('should add additional information to move type', function () {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `__translated__ — ${mockAdditionalInformation}`,
            },
            action: undefined,
          })
        })

        it('should not add additional information to transfer reason', function () {
          expect(transformedResponse.items[6]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: undefined,
            },
          })
        })

        it('should translate label', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.video_remand.label'
          )
        })
      })

      context('with prison transfer move type', function () {
        const mockPrisonTransferReason = 'Parole'

        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'prison_transfer',
            additional_information: mockAdditionalInformation,
            prison_transfer_reason: {
              title: mockPrisonTransferReason,
            },
          })
        })

        it('should not add additional information to move type', function () {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: mockMove.to_location.title,
            },
            action: undefined,
          })
        })

        it('should add additional information to transfer reason', function () {
          expect(transformedResponse.items[5]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `${mockPrisonTransferReason} — ${mockAdditionalInformation}`,
            },
          })
        })
      })

      context('with other move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            additional_information: mockAdditionalInformation,
          })
        })

        it('should not add additional information to move type', function () {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: mockMove.to_location.title,
            },
            action: undefined,
          })
        })

        it('should not add additional information to transfer reason', function () {
          expect(transformedResponse.items[5]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: undefined,
            },
          })
        })
      })
    })

    context('with agreement status', function () {
      let transformedResponse

      beforeEach(function () {
        i18n.t.returnsArg(0)
      })

      context('with `true` value', function () {
        context('without name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: true,
            })
          })

          it('should set move agreed item', function () {
            expect(transformedResponse.items[6]).to.deep.equal({
              key: { text: 'fields::move_agreed.label' },
              value: {
                text: 'moves::detail.agreement_status.agreed',
              },
            })
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: '',
                name: undefined,
              }
            )
          })
        })

        context('with name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: true,
              move_agreed_by: 'Jon Doe',
            })
          })

          it('should set move agreed item', function () {
            expect(transformedResponse.items[6]).to.deep.equal({
              key: { text: 'fields::move_agreed.label' },
              value: {
                text: 'moves::detail.agreement_status.agreed',
              },
            })
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: 'with_name',
                name: 'Jon Doe',
              }
            )
          })
        })
      })

      context('with `false` value', function () {
        context('without name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: false,
            })
          })

          it('should set move agreed item', function () {
            expect(transformedResponse.items[6]).to.deep.equal({
              key: { text: 'fields::move_agreed.label' },
              value: {
                text: 'moves::detail.agreement_status.not_agreed',
              },
            })
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: '',
                name: undefined,
              }
            )
          })
        })

        context('with name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: false,
              move_agreed_by: 'Jon Doe',
            })
          })

          it('should set move agreed item', function () {
            expect(transformedResponse.items[6]).to.deep.equal({
              key: { text: 'fields::move_agreed.label' },
              value: {
                text: 'moves::detail.agreement_status.not_agreed',
              },
            })
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: 'with_name',
                name: 'Jon Doe',
              }
            )
          })
        })
      })

      context('with status that matches `yes` from field', function () {
        context('without name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: 'true',
            })
          })

          it('should set move agreed item', function () {
            expect(transformedResponse.items[6]).to.deep.equal({
              key: { text: 'fields::move_agreed.label' },
              value: {
                text: 'moves::detail.agreement_status.agreed',
              },
            })
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: '',
                name: undefined,
              }
            )
          })
        })

        context('with name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: 'true',
              move_agreed_by: 'Jon Doe',
            })
          })

          it('should set move agreed item', function () {
            expect(transformedResponse.items[6]).to.deep.equal({
              key: { text: 'fields::move_agreed.label' },
              value: {
                text: 'moves::detail.agreement_status.agreed',
              },
            })
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: 'with_name',
                name: 'Jon Doe',
              }
            )
          })
        })
      })
    })
  })
})
