const i18n = require('../../../config/i18n').default
const componentService = require('../../services/component')

const presenter = require('./assessment-to-start-banner')

describe('Presenters', function () {
  describe('Message banner presenters', function () {
    describe('#assessmentToStartBanner', function () {
      let output

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        sinon.stub(componentService, 'getComponent').returnsArg(0)
      })

      context('without args', function () {
        it('should return default object', function () {
          output = presenter()
          expect(output).to.deep.equal({
            allowDismiss: false,
            classes: 'app-message--instruction govuk-!-padding-right-0',
            title: {
              text: 'messages::assessment.pending.heading',
            },
            content: {
              html: '\n    <p>\n      messages::assessment.pending.content\n    </p>\n  ',
            },
          })
        })
      })

      context('with args', function () {
        const mockArgs = {
          baseUrl: '/base-url',
          context: 'person_escort_record',
        }

        context('without create access', function () {
          beforeEach(function () {
            output = presenter(mockArgs)
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: 'messages::assessment.pending.heading',
              },
              content: {
                html: '\n    <p>\n      messages::assessment.pending.content\n    </p>\n  ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'messages::assessment.pending.heading',
              {
                context: 'person_escort_record',
              }
            )
            expect(i18n.t).to.be.calledWithExactly(
              'messages::assessment.pending.content',
              {
                context: 'person_escort_record',
              }
            )
          })

          it('should not call button component', function () {
            expect(componentService.getComponent).not.to.be.called
          })
        })

        context('with create access', function () {
          const canAccessStub = sinon.stub().returns(true)

          beforeEach(function () {
            output = presenter({
              ...mockArgs,
              canAccess: canAccessStub,
            })
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: 'messages::assessment.pending.heading',
              },
              content: {
                html: '\n    <p>\n      messages::assessment.pending.content\n    </p>\n  \n      govukButton\n    ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'messages::assessment.pending.heading',
              {
                context: 'person_escort_record',
              }
            )
            expect(i18n.t).to.be.calledWithExactly(
              'messages::assessment.pending.content',
              {
                context: 'person_escort_record',
              }
            )
            expect(i18n.t).to.be.calledWithExactly(
              'actions::start_assessment',
              {
                context: 'person_escort_record',
              }
            )
          })

          it('should call button component', function () {
            expect(componentService.getComponent).to.be.calledWithExactly(
              'govukButton',
              {
                href: '/base-url/new',
                text: 'actions::start_assessment',
              }
            )
          })

          it('should check permissions', function () {
            expect(canAccessStub).to.be.calledWithExactly(
              'person_escort_record:create'
            )
          })
        })
      })
    })
  })
})
