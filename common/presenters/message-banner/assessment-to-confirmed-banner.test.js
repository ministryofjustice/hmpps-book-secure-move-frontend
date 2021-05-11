const i18n = require('../../../config/i18n')
const filters = require('../../../config/nunjucks/filters')

const presenter = require('./assessment-to-confirmed-banner')

describe('Presenters', function () {
  describe('Message banner presenters', function () {
    describe('#assessmentToConfirmedBanner', function () {
      let output

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        sinon.stub(filters, 'formatDateWithTimeAndDay').returnsArg(0)
      })

      context('without args', function () {
        it('should return empty object', function () {
          output = presenter()
          expect(output).to.deep.equal({})
        })
      })

      context('with args', function () {
        const mockArgs = {
          assessment: {
            status: 'completed',
            confirmed_at: '2020-10-10',
          },
          baseUrl: '/base-url',
          canAccess: sinon.stub().returns(true),
          context: 'person_escort_record',
        }

        beforeEach(function () {
          output = presenter(mockArgs)
        })

        it('should return message component', function () {
          expect(output).to.deep.equal({
            allowDismiss: false,
            classes: 'app-message--instruction govuk-!-padding-right-0',
            title: {
              text: 'messages::assessment.completed.heading',
            },
            content: {
              html: '\n    <p>\n      messages::assessment.completed.content\n    </p>\n  \n      <p>\n        <a href="/base-url/print" class="app-icon app-icon--print">\n          actions::print_assessment\n        </a>\n      </p>\n    ',
            },
          })
        })

        it('should translate with correct context', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'messages::assessment.completed.heading',
            {
              context: 'person_escort_record',
            }
          )
          expect(i18n.t).to.be.calledWithExactly(
            'messages::assessment.completed.content',
            {
              context: 'person_escort_record',
              date: mockArgs.assessment.confirmed_at,
            }
          )
          expect(i18n.t).to.be.calledWithExactly('actions::print_assessment', {
            context: 'person_escort_record',
          })
        })

        it('should format date', function () {
          expect(filters.formatDateWithTimeAndDay).to.be.calledWithExactly(
            mockArgs.assessment.confirmed_at
          )
        })
      })

      context('without print permission', function () {
        const mockArgs = {
          assessment: {
            status: 'completed',
            confirmed_at: '2020-10-10',
          },
          baseUrl: '/base-url',
          canAccess: sinon
            .stub()
            .returns(true)
            .withArgs('person_escort_record:print')
            .returns(false),
          context: 'person_escort_record',
        }

        beforeEach(function () {
          output = presenter(mockArgs)
        })

        it('should return message component without print button', function () {
          expect(output).to.deep.equal({
            allowDismiss: false,
            classes: 'app-message--instruction govuk-!-padding-right-0',
            title: {
              text: 'messages::assessment.completed.heading',
            },
            content: {
              html: '\n    <p>\n      messages::assessment.completed.content\n    </p>\n  ',
            },
          })
        })
      })
    })
  })
})
