const { subDays, addDays } = require('date-fns')
const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const moveToMetaListComponent = require('./move-to-meta-list-component')

const mockMove = {
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

describe('Presenters', function() {
  describe('#moveToMetaListComponent()', function() {
    beforeEach(function() {
      timezoneMock.register('UTC')
      sinon.stub(i18n, 't').returns('__translated__')
    })

    afterEach(function() {
      timezoneMock.unregister()
    })

    context('when provided with a mock move object', function() {
      let transformedResponse

      beforeEach(function() {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function() {
        it('should contain items list', function() {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(7)
        })

        it('should contain from location as first item', function() {
          const item = transformedResponse.items[0]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.from_location.title },
          })
        })

        it('should contain to location as second item', function() {
          const item = transformedResponse.items[1]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: mockMove.to_location.title,
            },
            action: undefined,
          })
        })

        it('should contain date as third item', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Sunday 9 Jun 2019' },
            action: undefined,
          })
        })

        it('should contain empty date from as forth item', function() {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should contain empty date to as fifth item', function() {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should contain time due as sixth item', function() {
          const item = transformedResponse.items[5]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '2pm' },
          })
        })

        it('should contain time due as seventh item', function() {
          const item = transformedResponse.items[6]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })
      })

      describe('translations', function() {
        it('should translate from location label', function() {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::from_location.short_label'
          )
        })

        it('should translate to location label', function() {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.short_label'
          )
        })

        it('should translate date label', function() {
          expect(i18n.t).to.be.calledWithExactly('fields::date_type.label')
        })

        it('should translate date from label', function() {
          expect(i18n.t).to.be.calledWithExactly('fields::date_from.label')
        })

        it('should translate date to label', function() {
          expect(i18n.t).to.be.calledWithExactly('fields::date_to.label')
        })

        it('should translate time due label', function() {
          expect(i18n.t).to.be.calledWithExactly('fields::time_due.label')
        })

        it('should translate prison transfer type label', function() {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::prison_transfer_type.label'
          )
        })

        it('should translate correct number of times', function() {
          expect(i18n.t).to.be.callCount(7)
        })
      })
    })

    context('when date is today', function() {
      let transformedResponse

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(new Date(mockMove.date).getTime())

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        this.clock.restore()
      })

      describe('response', function() {
        it('should contain today in date value', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Sunday 9 Jun 2019 (Today)' },
            action: undefined,
          })
        })
      })
    })

    context('when date is yesterday', function() {
      let transformedResponse

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(
          subDays(new Date(mockMove.date), 1).getTime()
        )

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        this.clock.restore()
      })

      describe('response', function() {
        it('should contain tomorrow in date value', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Sunday 9 Jun 2019 (Tomorrow)' },
            action: undefined,
          })
        })
      })
    })

    context('when date is tomorrow', function() {
      let transformedResponse

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(
          addDays(new Date(mockMove.date), 1).getTime()
        )

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        this.clock.restore()
      })

      describe('response', function() {
        it('should contain yesterday in date value', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Sunday 9 Jun 2019 (Yesterday)' },
            action: undefined,
          })
        })
      })
    })

    context('with only `date from`', function() {
      const presentDate = '2010-04-14'
      const mockMove = {
        date_from: '2020-05-01',
      }
      let transformedResponse

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(new Date(presentDate).getTime())
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        this.clock.restore()
      })

      describe('response', function() {
        it('should render `date from` row', function() {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date_from },
          })
        })

        it('should not render `date to` row', function() {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should not render `date` row', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
            action: undefined,
          })
        })

        it('should format date from', function() {
          expect(filters.formatDateWithDay).to.be.calledWithExactly(
            mockMove.date_from
          )
        })

        it('should format correct number of date', function() {
          expect(filters.formatDateWithDay.callCount).to.equal(1)
        })
      })
    })

    context('with both `date from` and `date to`', function() {
      const presentDate = '2010-04-14'
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-10',
      }
      let transformedResponse

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(new Date(presentDate).getTime())
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        this.clock.restore()
      })

      describe('response', function() {
        it('should render `date from` row', function() {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date_from },
          })
        })

        it('should render `date to` row', function() {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date_to },
          })
        })

        it('should not render `date` row', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
            action: undefined,
          })
        })

        it('should format date from', function() {
          expect(filters.formatDateWithDay).to.be.calledWithExactly(
            mockMove.date_from
          )
        })

        it('should format date to', function() {
          expect(filters.formatDateWithDay).to.be.calledWithExactly(
            mockMove.date_to
          )
        })

        it('should format correct number of date', function() {
          expect(filters.formatDateWithDay.callCount).to.equal(2)
        })
      })
    })

    context('with all dates', function() {
      const presentDate = '2010-04-14'
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-10',
        date: '2020-06-01',
      }
      let transformedResponse

      beforeEach(function() {
        this.clock = sinon.useFakeTimers(new Date(presentDate).getTime())
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        this.clock.restore()
      })

      describe('response', function() {
        it('should not render `date from` row', function() {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should not render `date to` row', function() {
          const item = transformedResponse.items[4]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: undefined },
          })
        })

        it('should render `date` row', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: mockMove.date },
            action: undefined,
          })
        })

        it('should format date', function() {
          expect(filters.formatDateWithDay).to.be.calledWithExactly(
            mockMove.date
          )
        })

        it('should format correct number of date', function() {
          expect(filters.formatDateWithDay.callCount).to.equal(1)
        })
      })
    })

    context('when provided with an action', function() {
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

      it('should add actions to move and date items', function() {
        transformedResponse = moveToMetaListComponent(mockMove, {
          move: moveAction,
          date: dateAction,
        })
        const { items } = transformedResponse
        expect(items[0].action).to.be.undefined
        expect(items[1].action).to.deep.equal(expectedMoveAction)
        expect(items[2].action).to.deep.equal(expectedDateAction)
      })

      it('should add actions to move and date items', function() {
        transformedResponse = moveToMetaListComponent(mockMove, {
          date: dateAction,
        })
        const { items } = transformedResponse
        expect(items[1].action).to.be.undefined
        expect(items[2].action).to.deep.equal(expectedDateAction)
      })
    })

    context('with additional information', function() {
      const mockAdditionalInformation =
        'Some additional information about this move'
      let transformedResponse

      context('with prison recall move type', function() {
        beforeEach(function() {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'prison_recall',
            additional_information: mockAdditionalInformation,
          })
        })

        it('should add additional information to move type', function() {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `__translated__ — ${mockAdditionalInformation}`,
            },
            action: undefined,
          })
        })

        it('should not add additional information to transfer reason', function() {
          expect(transformedResponse.items[6]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: undefined,
            },
          })
        })

        it('should translate label', function() {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label'
          )
        })
      })

      context('with prison transfer move type', function() {
        const mockPrisonTransferReason = 'Parole'

        beforeEach(function() {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'prison_transfer',
            additional_information: mockAdditionalInformation,
            prison_transfer_reason: {
              title: mockPrisonTransferReason,
            },
          })
        })

        it('should not add additional information to move type', function() {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: mockMove.to_location.title,
            },
            action: undefined,
          })
        })

        it('should add additional information to transfer reason', function() {
          expect(transformedResponse.items[6]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: `${mockPrisonTransferReason} — ${mockAdditionalInformation}`,
            },
          })
        })
      })

      context('with other move type', function() {
        beforeEach(function() {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            additional_information: mockAdditionalInformation,
          })
        })

        it('should not add additional information to move type', function() {
          expect(transformedResponse.items[1]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: mockMove.to_location.title,
            },
            action: undefined,
          })
        })

        it('should not add additional information to transfer reason', function() {
          expect(transformedResponse.items[6]).to.deep.equal({
            key: { text: '__translated__' },
            value: {
              text: undefined,
            },
          })
        })
      })
    })
  })
})
