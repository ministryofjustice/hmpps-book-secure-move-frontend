const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const timetableToTableComponent = require('./timetable-to-table-component')

describe('Presenters', function () {
  describe('#timetableToTableComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(filters, 'formatTime').returnsArg(0)
    })

    context('with empty timetable', function () {
      beforeEach(function () {
        transformedResponse = timetableToTableComponent()
      })

      it('should translate head', function () {
        expect(i18n.t).to.be.calledWithExactly('time')
        expect(i18n.t).to.be.calledWithExactly('type')
        expect(i18n.t).to.be.calledWithExactly('reason')
        expect(i18n.t).to.be.calledWithExactly('location')
      })

      it('should translate correct number of times', function () {
        expect(i18n.t.callCount).to.equal(4)
      })

      it('should not format time', function () {
        expect(filters.formatTime).not.to.be.called
      })

      it('should return a table with no rows', function () {
        expect(transformedResponse).to.deep.equal({
          head: [
            { text: 'time' },
            { text: 'type' },
            { text: 'reason' },
            { text: 'location' },
          ],
          rows: [],
          classes: 'govuk-!-margin-bottom-2',
        })
      })
    })

    context('with timetable', function () {
      const mockTimetable = [
        {
          id: '12345',
          start_time: '2020-10-10T11:00Z',
          nomis_type: 'Prison act.',
          reason: 'Because',
          location: {
            title: 'HMP Bedford',
          },
        },
        {
          id: '67890',
          start_time: '2020-10-10T15:00Z',
          nomis_type: 'Prison act.',
          reason: 'Bricklaying course',
          location: {
            title: 'HMP Bedford',
          },
        },
        {
          id: '09876',
          start_time: '2020-10-10T08:00Z',
          nomis_type: 'Court date',
          reason: 'Sentence',
          location: {
            title: 'Luton Crown Court',
          },
        },
      ]

      context('with multiple items', function () {
        beforeEach(function () {
          transformedResponse = timetableToTableComponent(mockTimetable)
        })

        it('should translate head', function () {
          expect(i18n.t).to.be.calledWithExactly('time')
          expect(i18n.t).to.be.calledWithExactly('type')
          expect(i18n.t).to.be.calledWithExactly('reason')
          expect(i18n.t).to.be.calledWithExactly('location')
        })

        it('should translate correct number of times', function () {
          expect(i18n.t.callCount).to.equal(4)
        })

        it('should format time', function () {
          expect(filters.formatTime).to.be.calledWithExactly(
            mockTimetable[0].start_time
          )
          expect(filters.formatTime).to.be.calledWithExactly(
            mockTimetable[1].start_time
          )
          expect(filters.formatTime).to.be.calledWithExactly(
            mockTimetable[2].start_time
          )
          expect(filters.formatTime.callCount).to.equal(mockTimetable.length)
        })

        it('should return a table with no rows', function () {
          expect(transformedResponse).to.deep.equal({
            head: [
              { text: 'time' },
              { text: 'type' },
              { text: 'reason' },
              { text: 'location' },
            ],
            rows: [
              [
                { text: mockTimetable[2].start_time },
                { text: mockTimetable[2].nomis_type },
                { text: mockTimetable[2].reason },
                { text: mockTimetable[2].location.title },
              ],
              [
                { text: mockTimetable[0].start_time },
                { text: mockTimetable[0].nomis_type },
                { text: mockTimetable[0].reason },
                { text: mockTimetable[0].location.title },
              ],
              [
                { text: mockTimetable[1].start_time },
                { text: mockTimetable[1].nomis_type },
                { text: mockTimetable[1].reason },
                { text: mockTimetable[1].location.title },
              ],
            ],
            classes: 'govuk-!-margin-bottom-2',
          })
        })
      })

      context('with empty values', function () {
        beforeEach(function () {
          transformedResponse = timetableToTableComponent([
            {
              id: '12345',
              start_time: null,
              nomis_type: null,
              reason: null,
            },
          ])
        })

        it('should not format time', function () {
          expect(filters.formatTime).not.to.be.called
        })

        it('should return fallbacks', function () {
          expect(transformedResponse.rows).to.deep.equal([
            [{ text: '' }, { text: '' }, { text: '' }, { text: '' }],
          ])
        })
      })

      context('with varied times', function () {
        const mockTimetableWithTimes = [
          {
            start_time: '2020-10-10T15:00Z',
          },
          {
            start_time: '2020-10-10T08:30Z',
          },
          {
            start_time: '2020-10-10T08:00Z',
          },
          {
            start_time: '2020-10-10T16:00Z',
          },
          {
            start_time: '2020-01-10T16:00Z',
          },
          {
            start_time: '2020-10-10T06:00Z',
          },
          {
            start_time: '2020-10-10T22:30Z',
          },
          {
            start_time: '2020-05-10T22:30Z',
          },
        ]

        beforeEach(function () {
          transformedResponse = timetableToTableComponent(
            mockTimetableWithTimes
          )
        })

        it('should sort items by time', function () {
          expect(transformedResponse.rows).to.deep.equal([
            [
              { text: mockTimetableWithTimes[4].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[7].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[5].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[2].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[1].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[0].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[3].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
            [
              { text: mockTimetableWithTimes[6].start_time },
              { text: '' },
              { text: '' },
              { text: '' },
            ],
          ])
        })
      })
    })
  })
})
