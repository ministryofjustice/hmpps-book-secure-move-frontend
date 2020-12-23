const proxyquire = require('proxyquire')

const i18n = require('../../../config/i18n')
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
        frameworkToTaskListComponentStub.resetHistory()
      })

      context('without args', function () {
        it('should return undefined', function () {
          output = presenter()
          expect(output).to.be.undefined
        })
      })

      context('with args', function () {
        const mockArgs = {
          assessment: {
            status: 'in_progress',
            _framework: {
              sections: [],
            },
            meta: {
              section_progress: [],
            },
          },
          baseUrl: '/base-url',
          context: 'person_escort_record',
        }

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
                html:
                  '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n  \n      </div>\n    </div>\n  ',
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
                deepLinkToFirstStep: true,
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
                  html:
                    '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n  \n      </div>\n    </div>\n  ',
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

            context('with uneditable assessment', function () {
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
                    text: `messages::assessment.${mockArgs.assessment.status}.heading`,
                  },
                  content: {
                    html:
                      '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n  \n      <p>\n        messages::assessment.completed.content\n      </p>\n\n      govukButton\n    \n        govukWarningText\n      \n      </div>\n    </div>\n  ',
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
                  `messages::assessment.${mockArgs.assessment.status}.content`,
                  {
                    context: 'person_escort_record',
                  }
                )
                expect(i18n.t).to.be.calledWithExactly(
                  `messages::assessment.${mockArgs.assessment.status}.uneditable`,
                  {
                    context: 'person_escort_record',
                  }
                )
                expect(i18n.t).to.be.calledWithExactly(
                  'actions::provide_confirmation'
                )
              })

              it('should call button component', function () {
                expect(componentService.getComponent).to.be.calledWithExactly(
                  'govukButton',
                  {
                    href: '/base-url/confirm',
                    text: 'actions::provide_confirmation',
                    disabled: true,
                  }
                )
              })

              it('should check permissions', function () {
                expect(canAccessStub).to.be.calledWithExactly(
                  'person_escort_record:confirm'
                )
              })
            })

            context('with editable assessment', function () {
              beforeEach(function () {
                mockArgs.assessment.editable = true
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
                    html:
                      '\n    <div class="govuk-grid-row">\n      <div class="govuk-grid-column-two-thirds">\n        appTaskList\n  \n      <p>\n        messages::assessment.completed.content\n      </p>\n\n      govukButton\n    \n      </div>\n    </div>\n  ',
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
                  `messages::assessment.${mockArgs.assessment.status}.content`,
                  {
                    context: 'person_escort_record',
                  }
                )
                expect(i18n.t).to.be.calledWithExactly(
                  'actions::provide_confirmation'
                )
              })

              it('should call button component', function () {
                expect(componentService.getComponent).to.be.calledWithExactly(
                  'govukButton',
                  {
                    href: '/base-url/confirm',
                    text: 'actions::provide_confirmation',
                    disabled: false,
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
        })
      })
    })
  })
})
