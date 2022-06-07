const proxyquire = require('proxyquire')

const i18n = require('../../../config/i18n').default
const filters = require('../../../config/nunjucks/filters')
const componentService = require('../../services/component')

const frameworkToTaskListComponentStub = sinon.stub().returnsArg(0)

const presenter = proxyquire('./assessment-to-unconfirmed-banner', {
  '../framework-to-task-list-component': frameworkToTaskListComponentStub,
})

describe('Presenters', function () {
  describe('Message banner presenters', function () {
    describe('#assessmentToUnconfirmedBanner', function () {
      let output

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        sinon.stub(componentService, 'getComponent').returnsArg(0)
        sinon.stub(filters, 'formatDateWithTimeAndDay').returnsArg(0)
        frameworkToTaskListComponentStub.resetHistory()
      })

      context('without args', function () {
        it('should return undefined', function () {
          output = presenter()
          expect(output).to.be.undefined
        })
      })

      context('with args', function () {
        let mockArgs

        beforeEach(function () {
          mockArgs = {
            assessment: {
              status: 'in_progress',
              editable: true,
              _framework: {
                sections: [],
              },
              meta: {
                section_progress: [],
              },
            },
            baseUrl: '/base-url',
            canAccess: sinon.stub().returns(true),
            context: 'person_escort_record',
          }
        })

        context('with incomplete assessment', function () {
          beforeEach(function () {
            output = presenter(mockArgs)
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: `messages::assessment.${mockArgs.assessment.status}.heading`,
              },
              content: {
                html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly(
              `messages::assessment.${mockArgs.assessment.status}.heading`,
              {
                context: 'person_escort_record',
              }
            )
          })

          it('should call tasklist component', function () {
            expect(componentService.getComponent).to.be.calledWithExactly(
              'appTaskList',
              {
                baseUrl: '/base-url/',
                frameworkSections: [],
                sectionProgress: [],
              }
            )
          })
        })

        context('with completed assessment', function () {
          beforeEach(function () {
            mockArgs.assessment.status = 'completed'
          })

          context('without confirm access', function () {
            beforeEach(function () {
              mockArgs.canAccess
                .withArgs('person_escort_record:confirm')
                .returns(false)

              output = presenter({
                ...mockArgs,
              })
            })

            it('should return message component', function () {
              expect(output).to.deep.equal({
                allowDismiss: false,
                classes: 'app-message--instruction govuk-!-padding-right-0',
                title: {
                  text: `messages::assessment.${mockArgs.assessment.status}.heading`,
                },
                content: {
                  html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  \n      <p>\n        <a href="/base-url/print" class="app-icon app-icon--print">\n          actions::print_assessment\n        </a>\n      </p>\n    ',
                },
              })
            })

            it('should translate with correct context', function () {
              expect(i18n.t).to.be.calledWithExactly(
                `messages::assessment.${mockArgs.assessment.status}.heading`,
                {
                  context: 'person_escort_record',
                }
              )
            })

            it('should not call button component', function () {
              expect(componentService.getComponent).not.to.be.calledWith(
                'govukButton'
              )
            })
          })

          context('with confirm access', function () {
            let canAccessStub

            beforeEach(function () {
              canAccessStub = sinon.stub().returns(true)

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
                  text: `messages::assessment.${mockArgs.assessment.status}.heading`,
                },
                content: {
                  html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  \n        govukButton\n      \n      <p>\n        <a href="/base-url/print" class="app-icon app-icon--print">\n          actions::print_assessment\n        </a>\n      </p>\n    ',
                },
              })
            })

            it('should translate with correct context', function () {
              expect(i18n.t).to.be.calledWithExactly(
                `messages::assessment.${mockArgs.assessment.status}.heading`,
                {
                  context: 'person_escort_record',
                }
              )
              expect(i18n.t).to.be.calledWithExactly(
                'actions::provide_confirmation',
                {
                  context: 'person_escort_record',
                }
              )
            })

            it('should call button component', function () {
              expect(componentService.getComponent).to.be.calledWithExactly(
                'govukButton',
                {
                  href: '/base-url/confirm',
                  text: 'actions::provide_confirmation',
                }
              )
            })

            it('should check permissions', function () {
              expect(canAccessStub).to.be.calledWithExactly(
                'person_escort_record:confirm'
              )
            })
          })
        })

        context('with confirmed assessment', function () {
          let canAccessStub
          beforeEach(function () {
            canAccessStub = sinon.stub().returns(true)
            mockArgs.assessment.status = 'confirmed'
          })

          context('with `handover_occurred_at`', function () {
            beforeEach(function () {
              mockArgs.assessment.handover_occurred_at = '2020-10-10T14:00:00Z'
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
                  text: `messages::assessment.${mockArgs.assessment.status}.heading`,
                },
                content: {
                  html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  ',
                },
              })
            })

            it('should translate with correct context', function () {
              expect(i18n.t).to.be.calledWithExactly(
                `messages::assessment.${mockArgs.assessment.status}.heading`,
                {
                  context: 'person_escort_record',
                }
              )
              expect(i18n.t).not.to.be.calledWith(
                'actions::provide_confirmation'
              )
            })

            it('should not call button component', function () {
              expect(componentService.getComponent).not.to.be.calledWith(
                'govukButton'
              )
            })
          })

          context('without `handover_occurred_at`', function () {
            beforeEach(function () {
              mockArgs.assessment.handover_occurred_at = undefined
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
                  text: `messages::assessment.${mockArgs.assessment.status}.heading`,
                },
                content: {
                  html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  \n        govukButton\n      \n      <p>\n        <a href="/base-url/print" class="app-icon app-icon--print">\n          actions::print_assessment\n        </a>\n      </p>\n    ',
                },
              })
            })

            it('should translate with correct context', function () {
              expect(i18n.t).to.be.calledWithExactly(
                `messages::assessment.${mockArgs.assessment.status}.heading`,
                {
                  context: 'person_escort_record',
                }
              )
              expect(i18n.t).to.be.calledWithExactly(
                'actions::provide_confirmation',
                {
                  context: 'person_escort_record',
                }
              )
            })

            it('should call button component', function () {
              expect(componentService.getComponent).to.be.calledWithExactly(
                'govukButton',
                {
                  href: '/base-url/confirm',
                  text: 'actions::provide_confirmation',
                }
              )
            })

            it('should check permissions', function () {
              expect(canAccessStub).to.be.calledWithExactly(
                'person_escort_record:confirm'
              )
            })
          })
        })

        context('with uneditable assessment', function () {
          beforeEach(function () {
            mockArgs.assessment.editable = false
            output = presenter({
              ...mockArgs,
            })
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: `messages::assessment.${mockArgs.assessment.status}.heading`,
              },
              content: {
                html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly(
              `messages::assessment.${mockArgs.assessment.status}.heading`,
              {
                context: 'person_escort_record',
              }
            )
          })
        })

        context('with completed timestamp', function () {
          beforeEach(function () {
            mockArgs.assessment.completed_at = '2020-10-12T14:30:00Z'
            output = presenter(mockArgs)
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: `messages::assessment.${mockArgs.assessment.status}.heading`,
              },
              content: {
                html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  \n      <p class="govuk-!-font-size-16 govuk-!-margin-top-1">\n        completed_at\n      </p>\n    ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly('completed_at', {
              date: '2020-10-12T14:30:00Z',
            })
          })
        })

        context('with amended timestamp', function () {
          beforeEach(function () {
            mockArgs.assessment.amended_at = '2020-10-12T16:30:00Z'
            output = presenter(mockArgs)
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: `messages::assessment.${mockArgs.assessment.status}.heading`,
              },
              content: {
                html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  \n      <p class="govuk-!-font-size-16 govuk-!-margin-top-1">\n        amended_at\n      </p>\n    ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly('amended_at', {
              date: '2020-10-12T16:30:00Z',
            })
          })
        })

        context('with completed and amended timestamp', function () {
          beforeEach(function () {
            mockArgs.assessment.amended_at = '2020-10-12T16:30:00Z'
            mockArgs.assessment.completed_at = '2020-10-12T14:30:00Z'
            output = presenter(mockArgs)
          })

          it('should return message component', function () {
            expect(output).to.deep.equal({
              allowDismiss: false,
              classes: 'app-message--instruction govuk-!-padding-right-0',
              title: {
                text: `messages::assessment.${mockArgs.assessment.status}.heading`,
              },
              content: {
                html: '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n      </div>\n    </div>\n  \n      <p class="govuk-!-font-size-16 govuk-!-margin-top-1">\n        amended_at\n      </p>\n    ',
              },
            })
          })

          it('should translate with correct context', function () {
            expect(i18n.t).to.be.calledWithExactly('amended_at', {
              date: '2020-10-12T16:30:00Z',
            })
          })
        })
      })
    })
  })
})
