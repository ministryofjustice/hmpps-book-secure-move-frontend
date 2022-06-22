const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const courtHearingsToSummaryListComponent = require('./court-hearing-to-summary-list-component')

const mockHearing = {
  start_time: '2020-10-20T13:00:00+00:00',
  case_number: 'T18725',
  case_start_date: '2019-10-08T10:30:00+00:00',
  case_type: 'Adult',
  comments: 'Distinctio accusantium enim libero eligendi est.',
}

describe('Presenters', function () {
  describe('#courtHearingsToSummaryListComponent()', function () {
    const mockDateLong = '18 Jun 1960'
    const mockDateShort = '1960-06-18'
    const mockTime = '9am'

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(filters, 'formatDate').returns(mockDateLong)
      sinon.stub(filters, 'formatTime').returns(mockTime)
      filters.formatDate
        .withArgs(mockHearing.case_start_date, 'yyyy-MM-dd')
        .returns(mockDateShort)
    })

    context('with a mock person object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = courtHearingsToSummaryListComponent(mockHearing)
      })

      describe('response', function () {
        it('should contain classes property', function () {
          expect(transformedResponse).to.have.property('classes')
          expect(transformedResponse.classes).to.equal(
            'govuk-!-margin-bottom-2 govuk-!-font-size-16'
          )
        })

        it('should contain correct number of rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(4)
        })

        it('should contain hearing time', function () {
          const row = transformedResponse.rows[0]

          expect(row).to.deep.equal({
            key: { text: 'moves::detail.court_hearing.time_of_hearing' },
            value: {
              html: `<time datetime="${mockHearing.start_time}">${mockTime}</time>`,
            },
          })
        })

        it('should case number', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: 'moves::detail.court_hearing.case_number' },
            value: {
              html: `${mockHearing.case_number} (moves::detail.court_hearing.started_on)`,
            },
          })
        })

        it('should case type', function () {
          const row = transformedResponse.rows[2]

          expect(row).to.deep.equal({
            key: { text: 'moves::detail.court_hearing.case_type' },
            value: {
              text: mockHearing.case_type,
            },
          })
        })

        it('should contain comments', function () {
          const row = transformedResponse.rows[3]

          expect(row).to.deep.equal({
            key: { text: 'moves::detail.court_hearing.comments' },
            value: { text: mockHearing.comments },
          })
        })
      })

      describe('translation', function () {
        it('should send correct values to `started on` translation', function () {
          expect(i18n.t).to.be.calledWith(
            'moves::detail.court_hearing.started_on',
            {
              datetime: mockDateShort,
              datestring: mockDateLong,
            }
          )
        })
      })
    })

    context('with no input values', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = courtHearingsToSummaryListComponent()
      })

      describe('response', function () {
        it('should contain classes property', function () {
          expect(transformedResponse).to.have.property('classes')
          expect(transformedResponse.classes).to.equal(
            'govuk-!-margin-bottom-2 govuk-!-font-size-16'
          )
        })

        it('should contain correct number of rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(0)
        })
      })
    })

    context('with empty object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = courtHearingsToSummaryListComponent({})
      })

      describe('response', function () {
        it('should contain classes property', function () {
          expect(transformedResponse).to.have.property('classes')
          expect(transformedResponse.classes).to.equal(
            'govuk-!-margin-bottom-2 govuk-!-font-size-16'
          )
        })

        it('should contain correct number of rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(0)
        })
      })
    })

    context('with no case start date', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = courtHearingsToSummaryListComponent({
          start_time: '2020-10-20T13:00:00+00:00',
          case_number: 'T18725',
          case_type: 'Youth',
          comments: 'Distinctio accusantium enim libero eligendi est.',
        })
      })

      describe('response', function () {
        it('should return only case number', function () {
          const row = transformedResponse.rows[1]

          expect(row).to.deep.equal({
            key: { text: 'moves::detail.court_hearing.case_number' },
            value: { html: mockHearing.case_number },
          })
        })

        it('should contain correct number of rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(4)
        })
      })
    })

    context('with no case number but a case start date', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = courtHearingsToSummaryListComponent({
          start_time: '2020-10-20T13:00:00+00:00',
          case_start_date: '2019-10-08T10:30:00+00:00',
          comments: 'Distinctio accusantium enim libero eligendi est.',
        })
      })

      describe('response', function () {
        it('should contain correct number of rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(2)
        })

        it('should not contain case number row', function () {
          const row1 = transformedResponse.rows[0]
          const row2 = transformedResponse.rows[1]

          expect(row1.key.text).to.equal(
            'moves::detail.court_hearing.time_of_hearing'
          )
          expect(row2.key.text).to.equal('moves::detail.court_hearing.comments')
        })
      })
    })

    context('with no start time', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = courtHearingsToSummaryListComponent({
          case_number: 'T18725',
          comments: 'Distinctio accusantium enim libero eligendi est.',
        })
      })

      describe('response', function () {
        it('should contain correct number of rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(2)
        })

        it('should not contain hearing time row', function () {
          const row1 = transformedResponse.rows[0]
          const row2 = transformedResponse.rows[1]

          expect(row1.key.text).to.equal(
            'moves::detail.court_hearing.case_number'
          )
          expect(row2.key.text).to.equal('moves::detail.court_hearing.comments')
        })
      })
    })
  })
})
