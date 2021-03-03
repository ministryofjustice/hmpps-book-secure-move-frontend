const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const journeysToSummaryListComponent = require('./journeys-to-meta-list-component')

describe('Presenters', function () {
  let mockJourneys
  beforeEach(function () {
    mockJourneys = [
      {
        state: 'cancelled',
        timestamp: '2020-01-01T14:00:00Z',
        move_type: '',
        from_location: {
          id: 'FACEFEED',
          title: 'HMP Leeds',
        },
        to_location: {
          id: 'ABADCAFE',
          title: 'HMP Bedford',
        },
      },
      {
        state: 'proposed',
        timestamp: '2020-01-02T14:00:00Z',
        move_type: '',
        from_location: {
          id: 'FACEFEED',
          title: 'HMP Leeds',
        },
        to_location: {
          id: 'ABADCAFE',
          title: 'HMP Bedford',
        },
      },
    ]
  })
  describe('#journeysToSummaryListComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
      sinon.stub(filters, 'formatTime').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
    })

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided no journeys', function () {
      beforeEach(function () {
        transformedResponse = journeysToSummaryListComponent()
      })

      it('should return empty rows', function () {
        expect(transformedResponse).to.deep.equal({
          classes: 'app-meta-list',
          items: [],
        })
      })
    })

    context('when provided with multiple journeys with locations', function () {
      beforeEach(function () {
        transformedResponse = journeysToSummaryListComponent(mockJourneys)
      })

      describe('response', function () {
        it('should contain correct rows', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items).to.have.lengthOf(10)
        })
      })
    })
  })
})
