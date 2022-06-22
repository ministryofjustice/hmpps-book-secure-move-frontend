const proxyquire = require('proxyquire')
const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const mapUpdateLinkStub = sinon.stub().returnsArg(0)

const moveToSummaryListComponent = proxyquire(
  './move-to-summary-list-component',
  {
    '../helpers/move/map-update-link': mapUpdateLinkStub,
  }
)

const mockMove = {
  id: 'abc',
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

const mockJourneys = [
  {
    date: '2019-06-09',
    from_location: {
      title: 'HMP Leeds',
    },
    to_location: {
      title: 'Barrow in Furness County Court',
    },
  },
]

describe('Presenters', function () {
  describe('#moveToSummaryListComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
      sinon.stub(filters, 'formatTime').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
    })

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided no move', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent()
      })

      it('should return empty rows', function () {
        expect(transformedResponse).to.deep.equal({
          classes: 'govuk-!-font-size-16',
          rows: [],
        })
      })
    })

    context('when provided with a mock move object', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent(mockMove, mockJourneys)
      })

      describe('response', function () {
        it('should contain correct rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(5)
        })

        it('should order items correctly', function () {
          const keys = transformedResponse.rows.map(row => row.key.text)
          expect(keys).to.deep.equal([
            'fields::from_location.label',
            'fields::to_location.label',
            'fields::date_custom.label',
            'fields::time_due.label',
            'assessment::handover_status.heading',
          ])
        })

        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            mockMove.to_location.title,
            mockMove.date,
            mockMove.time_due,
            undefined,
          ])
        })

        it('should contain correct row structure', function () {
          transformedResponse.rows.forEach(row => {
            expect(row).to.include.keys(['key', 'value'])
          })
        })
      })

      describe('translations', function () {
        it('should translate keys', function () {
          transformedResponse.rows.forEach(row => {
            expect(i18n.t).to.be.calledWithExactly(row.key.text)
          })
        })
      })

      describe('date', function () {
        it('should format date', function () {
          expect(filters.formatDateWithRelativeDay).to.be.calledWithExactly(
            mockMove.date
          )
        })

        it('should format time', function () {
          expect(filters.formatTime).to.be.calledWithExactly(mockMove.time_due)
        })
      })
    })

    context('with prison recall move type', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent(
          {
            ...mockMove,
            move_type: 'prison_recall',
            to_location: {
              title: 'Prison recall',
            },
          },
          mockJourneys
        )
      })

      describe('response', function () {
        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            'Prison recall',
            mockMove.date,
            mockMove.time_due,
            undefined,
          ])
        })
      })
    })

    context('with video remand move type', function () {
      beforeEach(function () {
        transformedResponse = moveToSummaryListComponent(
          {
            ...mockMove,
            move_type: 'video_remand',
            to_location: {
              title: 'Video remand',
            },
          },
          mockJourneys
        )
      })

      describe('response', function () {
        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)
          expect(keys).to.deep.equal([
            mockMove.from_location.title,
            'Video remand',
            mockMove.date,
            mockMove.time_due,
            undefined,
          ])
        })
      })
    })

    context('when provided with updateUrls', function () {
      let transformedResponse
      let mockUpdateUrls

      beforeEach(function () {
        mockUpdateUrls = {
          move: {
            href: '/move',
            html: 'Update move',
          },
          date: {
            href: '/date',
            html: 'Update date',
          },
        }

        transformedResponse = moveToSummaryListComponent(
          mockMove,
          mockJourneys,
          {
            updateUrls: mockUpdateUrls,
          }
        )
      })

      it('should map update links', function () {
        expect(mapUpdateLinkStub.callCount).to.equal(
          Object.keys(mockUpdateUrls).length
        )

        expect(mapUpdateLinkStub).to.have.been.calledWithExactly(
          mockUpdateUrls.move,
          'move'
        )
        expect(mapUpdateLinkStub).to.have.been.calledWithExactly(
          mockUpdateUrls.date,
          'date'
        )
      })

      it('should contain correct number of items', function () {
        expect(transformedResponse).to.have.property('rows')
        expect(transformedResponse.rows.length).to.equal(5)
      })

      it('should contain correct actions', function () {
        const actions = transformedResponse.rows.map(rows => rows.actions)
        expect(actions).deep.equal([
          undefined,
          {
            items: [mockUpdateUrls.move],
          },
          {
            items: [mockUpdateUrls.date],
          },
          undefined,
          undefined,
        ])
      })
    })

    context('with a youth risk assessment', function () {
      beforeEach(function () {
        const canAccess = sinon
          .stub()
          .withArgs('youth_risk_assessment.view')
          .returns(true)

        transformedResponse = moveToSummaryListComponent(
          {
            ...mockMove,
            profile: {
              youth_risk_assessment: {},
            },
          },
          mockJourneys,
          { canAccess }
        )
      })

      describe('response', function () {
        it('should contain a link to the PER', function () {
          const html =
            transformedResponse.rows[transformedResponse.rows.length - 2].value
              .html
          expect(html).to.equal(
            '<ul class="govuk-list govuk-!-font-size-16"><li><a class="govuk-link" href="/move/abc/youth-risk-assessment">youth_risk_assessment</a></li></ul>'
          )
        })

        it('should contain a link to the handover', function () {
          const html =
            transformedResponse.rows[transformedResponse.rows.length - 1].value
              .html
          expect(html).to.equal(
            '<ul class="govuk-list govuk-!-font-size-16"><li>assessment::handover_status.text_awaiting</li></ul>'
          )
        })
      })
    })

    context('with a person escort record', function () {
      beforeEach(function () {
        const canAccess = sinon
          .stub()
          .withArgs('person_escort_record.view')
          .returns(true)

        transformedResponse = moveToSummaryListComponent(
          {
            ...mockMove,
            profile: {
              person_escort_record: {},
            },
          },
          mockJourneys,
          { canAccess }
        )
      })

      describe('response', function () {
        it('should contain a link to the PER', function () {
          const html =
            transformedResponse.rows[transformedResponse.rows.length - 2].value
              .html
          expect(html).to.equal(
            '<ul class="govuk-list govuk-!-font-size-16"><li><a class="govuk-link" href="/move/abc/person-escort-record">person_escort_record</a></li></ul>'
          )
        })

        it('should contain a link to the handover', function () {
          const html =
            transformedResponse.rows[transformedResponse.rows.length - 1].value
              .html
          expect(html).to.equal(
            '<ul class="govuk-list govuk-!-font-size-16"><li>assessment::handover_status.text_awaiting</li></ul>'
          )
        })
      })
    })
  })
})
