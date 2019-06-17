const { subDays, addDays } = require('date-fns')

const moveToMetaListComponent = require('./move-to-meta-list-component')

const { data: mockMove } = require('../../test/fixtures/api-client/move.get.deserialized.json')

describe('Presenters', function () {
  describe('#moveToMetaListComponent()', function () {
    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(subDays(new Date(mockMove.date), 3).getTime())

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function () {
        this.clock.restore()
      })

      describe('response', function () {
        it('should contain items list', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(4)
        })

        it('should contain from location as first item', function () {
          const item = transformedResponse.items[0]

          expect(item).to.deep.equal({
            key: { text: 'From' },
            value: { text: mockMove.from_location.title },
          })
        })

        it('should contain to location as second item', function () {
          const item = transformedResponse.items[1]

          expect(item).to.deep.equal({
            key: { text: 'To' },
            value: { text: mockMove.to_location.title },
          })
        })

        it('should contain date as third item', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: 'Date' },
            value: { text: 'Sunday 9 Jun 2019' },
          })
        })

        it('should contain time due as forth item', function () {
          const item = transformedResponse.items[3]

          expect(item).to.deep.equal({
            key: { text: 'Time due' },
            value: { text: '2pm' },
          })
        })
      })
    })

    context('when date is today', function () {
      let transformedResponse

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date(mockMove.date).getTime())

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function () {
        this.clock.restore()
      })

      describe('response', function () {
        it('should contain today in date value', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: 'Date' },
            value: { text: 'Sunday 9 Jun 2019 (Today)' },
          })
        })
      })
    })

    context('when date is yesterday', function () {
      let transformedResponse

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(subDays(new Date(mockMove.date), 1).getTime())

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function () {
        this.clock.restore()
      })

      describe('response', function () {
        it('should contain tomorrow in date value', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: 'Date' },
            value: { text: 'Sunday 9 Jun 2019 (Tomorrow)' },
          })
        })
      })
    })

    context('when date is tomorrow', function () {
      let transformedResponse

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(addDays(new Date(mockMove.date), 1).getTime())

        transformedResponse = moveToMetaListComponent(mockMove)
      })

      afterEach(function () {
        this.clock.restore()
      })

      describe('response', function () {
        it('should contain yesterday in date value', function () {
          const item = transformedResponse.items[2]

          expect(item).to.deep.equal({
            key: { text: 'Date' },
            value: { text: 'Sunday 9 Jun 2019 (Yesterday)' },
          })
        })
      })
    })
  })
})
