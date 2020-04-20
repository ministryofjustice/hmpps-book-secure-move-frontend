const { subDays, addDays } = require('date-fns')
const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n')

const moveToMetaListComponent = require('./move-to-meta-list-component')

const mockMove = {
  date: '2019-06-09',
  time_due: '2000-01-01T14:00:00Z',
  move_type: 'court_appearance',
  additional_information: 'Some additional information about this move',
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
      sinon.stub(i18n, 't').returns('__translated__')
    })

    context('when provided with a mock move object', function() {
      let transformedResponse

      beforeEach(function() {
        timezoneMock.register('UTC')
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function() {
        timezoneMock.unregister()
      })

      describe('response', function() {
        it('should contain items list', function() {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(4)
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
              text: `${mockMove.to_location.title} — ${mockMove.additional_information}`,
            },
          })
        })

        it('should contain date as third item', function() {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Sunday 9 Jun 2019' },
          })
        })

        it('should contain time due as forth item', function() {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '2pm' },
          })
        })
      })

      describe('translations', function() {
        it('should translate from location label', function() {
          expect(i18n.t.firstCall).to.be.calledWithExactly(
            'fields::from_location.short_label'
          )
        })

        it('should translate to location label', function() {
          expect(i18n.t.secondCall).to.be.calledWithExactly(
            'fields::move_type.short_label'
          )
        })

        it('should translate date label', function() {
          expect(i18n.t.thirdCall).to.be.calledWithExactly(
            'fields::date_type.label'
          )
        })

        it('should translate time due label', function() {
          expect(i18n.t.getCall(3)).to.be.calledWithExactly(
            'fields::time_due.label'
          )
        })

        it('should translate correct number of times', function() {
          expect(i18n.t).to.be.callCount(4)
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
          })
        })
      })
    })
    context('when date is a range', function() {
      const presentDate = '2020-04-14'
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-05',
      }
      before(function() {
        this.clock = sinon.useFakeTimers(
          subDays(new Date(presentDate), 1).getTime()
        )
      })
      after(function() {
        this.clock.restore()
      })
      describe('response', function() {
        it("doesn't return anything when no date is passed", function() {
          const transformedResponse = moveToMetaListComponent({})
          const item = transformedResponse.items[2]
          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: null },
          })
        })
        it('returns the from date if there is no "to" date', function() {
          const move = { ...mockMove }
          delete move.date_to
          const transformedResponse = moveToMetaListComponent(move)
          const item = transformedResponse.items[2]
          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '__translated__ Friday 1 May 2020' },
          })
        })
        it('returns the range if both dates are present', function() {
          const move = { ...mockMove }
          const transformedResponse = moveToMetaListComponent(move)
          const item = transformedResponse.items[2]
          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: '1 to 5 May 2020' },
          })
        })
        it('returns the date if date and range are both present', function() {
          const move = { ...mockMove }
          move.date = '2021-01-01'
          const transformedResponse = moveToMetaListComponent(move)
          const item = transformedResponse.items[2]
          expect(item).to.deep.equal({
            key: { text: '__translated__' },
            value: { text: 'Friday 1 Jan 2021' },
          })
        })
      })
    })
  })
})
