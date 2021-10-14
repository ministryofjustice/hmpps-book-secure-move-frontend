const proxyquire = require('proxyquire')

const FormWizardController = require('../../../common/controllers/form-wizard')
const fieldHelpers = require('../../../common/helpers/field')
const frameworksHelpers = require('../../../common/helpers/frameworks')

const setMoveSummary = sinon.stub()

const Controller = proxyquire('./framework-step', {
  '../../middleware/set-move-summary': setMoveSummary,
})

const controller = new Controller({ route: '/' })

describe('Framework controllers', function () {
  describe('FrameworkStepController', function () {
    describe('#middlewareChecks', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkEditable')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call use with protect route middleware', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.checkEditable
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
      })
    })

    describe('#middlewareSetup', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'setupConditionalFields')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setButtonText')
        sinon.stub(controller, 'setValidationRules')
        sinon.stub(controller, 'setHasNextSteps')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call set models method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setupConditionalFields
        )
      })

      it('should call set button text method', function () {
        expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
          controller.setValidationRules
        )
      })

      it('should call set button text method', function () {
        expect(controller.use.getCall(2)).to.have.been.calledWithExactly(
          controller.setHasNextSteps
        )
      })

      it('should call set button text method', function () {
        expect(controller.use.getCall(3)).to.have.been.calledWithExactly(
          controller.setButtonText
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(4)
      })
    })

    describe('#middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'setPageTitleLocals')
        sinon.stub(controller, 'setSyncStatusBanner')
        sinon.stub(controller, 'setPrefillBanner')
        sinon.stub(controller, 'seti18nContext')
        sinon.stub(controller, 'setBreadcrumb')
        sinon.stub(controller, 'setShowReturnToOverviewButton')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call page titles method', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setPageTitleLocals
        )
      })

      it('should call set sync banner method', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setSyncStatusBanner
        )
      })

      it('should call set sync banner method', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setPrefillBanner
        )
      })

      it('should call set i18n context', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.seti18nContext
        )
      })

      it('should call set breadcrumbs', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setBreadcrumb
        )
      })

      it('should call set breadcrumbs', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setShowReturnToOverviewButton
        )
      })

      it('should call set move summary', function () {
        expect(controller.use).to.have.been.calledWithExactly(setMoveSummary)
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(7)
      })
    })

    describe('#seti18nContext', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {}
        mockRes = {
          locals: {},
        }
      })

      context('without an assessment', function () {
        beforeEach(function () {
          controller.seti18nContext(mockReq, mockRes, nextSpy)
        })

        it('should not set move ID', function () {
          expect(mockRes.locals.i18nContext).to.equal('')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with an assessment', function () {
        beforeEach(function () {
          mockReq.assessment = {
            framework: {
              name: 'person-escort-record',
            },
          }

          controller.seti18nContext(mockReq, mockRes, nextSpy)
        })

        it('should set move ID', function () {
          expect(mockRes.locals.i18nContext).to.equal('person_escort_record')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setBreadcrumb', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          form: {
            options: {
              pageTitle: 'Step title',
            },
          },
        }
        mockRes = {
          breadcrumb: sinon.stub().returnsThis(),
        }
        controller.setBreadcrumb(mockReq, mockRes, nextSpy)
      })

      it('should set breadcrumb item', function () {
        expect(mockRes.breadcrumb).to.have.been.calledOnceWithExactly({
          text: 'Step title',
        })
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#checkEditable', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          assessment: {
            id: '12345',
            editable: true,
            framework: {
              name: 'person-escort-record',
            },
          },
          baseUrl: '/base-url',
          canAccess: sinon.stub().returns(true),
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      context('when Person Escort Record is not editable', function () {
        beforeEach(function () {
          mockReq.assessment.editable = false

          controller.checkEditable(mockReq, mockRes, nextSpy)
        })

        it('should redirect', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(mockReq.baseUrl)
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('when Person Escort Record is editable', function () {
        beforeEach(function () {
          controller.checkEditable(mockReq, mockRes, nextSpy)
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context("when user doesn't have permission", function () {
        beforeEach(function () {
          mockReq.canAccess.returns(false)
          controller.checkEditable(mockReq, mockRes, nextSpy)
        })

        it('should check permissions correctly', function () {
          expect(mockReq.canAccess).to.be.calledOnceWithExactly(
            'person_escort_record:update'
          )
        })

        it('should redirect', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(mockReq.baseUrl)
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    describe('#setHasNextSteps', function () {
      let mockReq, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = { form: { options: {} } }
      })

      context('with step that has undefined next steps', function () {
        beforeEach(function () {
          controller.setHasNextSteps(mockReq, {}, nextSpy)
        })

        it('should not have next steps', function () {
          expect(mockReq.hasNextSteps).to.be.false
        })
      })

      context('with step that has no next steps', function () {
        beforeEach(function () {
          mockReq.form.options.next = []
          controller.setHasNextSteps(mockReq, {}, nextSpy)
        })

        it('should not have next steps', function () {
          expect(mockReq.hasNextSteps).to.be.false
        })
      })

      context('with step that has next steps', function () {
        beforeEach(function () {
          mockReq.form.options.next = ['next']
          controller.setHasNextSteps(mockReq, {}, nextSpy)
        })

        it('should not be the last step', function () {
          expect(mockReq.hasNextSteps).to.be.true
        })
      })
    })

    describe('#setButtonText', function () {
      let mockReq, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          form: { options: {} },
          hasNextSteps: true,
        }
      })

      context('by default', function () {
        beforeEach(function () {
          controller.setButtonText(mockReq, {}, nextSpy)
        })

        it('should use save and continue button text', function () {
          expect(mockReq.form.options.buttonText).to.equal(
            'actions::save_and_continue'
          )
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with interruption card step type', function () {
        beforeEach(function () {
          mockReq.form.options.stepType = 'interruption-card'
          controller.setButtonText(mockReq, {}, nextSpy)
        })

        it('should use continue button text', function () {
          expect(mockReq.form.options.buttonText).to.equal('actions::continue')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when last step and no next section', function () {
        beforeEach(function () {
          mockReq.hasNextSteps = false
          mockReq.nextFrameworkSection = null
          controller.setButtonText(mockReq, {}, nextSpy)
        })

        it('should use save and return to overview button text', function () {
          expect(mockReq.form.options.buttonText).to.equal(
            'actions::save_and_return_to_overview'
          )
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setPageTitleLocals', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          frameworkSection: {
            name: 'Section one',
          },
        }
        mockRes = {
          locals: {},
        }
        controller.setPageTitleLocals(mockReq, mockRes, nextSpy)
      })

      it('should use save and continue button text', function () {
        expect(mockRes.locals.frameworkSection).to.equal('Section one')
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#setSyncStatusBanner', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          assessment: {
            nomis_sync_status: [
              {
                resource_type: 'alerts',
                status: 'success',
              },
              {
                resource_type: 'assessments',
                status: 'success',
              },
              {
                resource_type: 'contacts',
                status: 'success',
              },
              {
                resource_type: 'personal_care_needs',
                status: 'success',
              },
              {
                resource_type: 'reasonable_adjustments',
                status: 'success',
              },
            ],
          },
        }
        mockRes = {
          locals: {},
        }
      })

      context('without nomis_sync_status', function () {
        beforeEach(function () {
          mockReq.assessment = {}
          controller.setSyncStatusBanner(mockReq, mockRes, nextSpy)
        })

        it('should not set local', function () {
          expect(mockRes.locals.syncFailures).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('without failures', function () {
        beforeEach(function () {
          controller.setSyncStatusBanner(mockReq, mockRes, nextSpy)
        })

        it('should set an empty array', function () {
          expect(mockRes.locals.syncFailures).to.be.an('array').that.is.empty
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with failures', function () {
        beforeEach(function () {
          mockReq.assessment.nomis_sync_status = [
            {
              resource_type: 'alerts',
              status: 'failed',
            },
            {
              resource_type: 'assessments',
              status: 'success',
            },
            {
              resource_type: 'contacts',
              status: 'success',
            },
            {
              resource_type: 'personal_care_needs',
              status: 'success',
            },
            {
              resource_type: 'reasonable_adjustments',
              status: 'failed',
            },
          ]
          controller.setSyncStatusBanner(mockReq, mockRes, nextSpy)
        })

        it('should set array of failures', function () {
          expect(mockRes.locals.syncFailures).to.deep.equal([
            'alerts',
            'reasonable_adjustments',
          ])
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setPrefillBanner', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          assessment: {
            responses: [],
            prefill_source: {
              id: '12345',
              confirmed_at: '2020-10-10T14:00:00',
            },
          },
          form: {
            options: {
              fields: {
                'field-one': {},
                'field-two': {},
                'field-three': {},
                'field-four': {},
                'field-five': {},
                'field-six': {},
              },
            },
          },
        }
        mockRes = {
          locals: {},
        }
      })

      context('without prefilled responses', function () {
        beforeEach(function () {
          mockReq.assessment.responses = []
          controller.setPrefillBanner(mockReq, mockRes, nextSpy)
        })

        it('should set source date', function () {
          expect(mockRes.locals.prefilledSourceDate).to.equal(
            '2020-10-10T14:00:00'
          )
        })

        it('should set banner status to false', function () {
          expect(mockRes.locals.hasPrefilledResponses).to.be.false
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with prefilled responses', function () {
        const truthyTests = [
          {
            value: {
              option: 'Yes',
              details: 'Some extra details',
            },
            responded: false,
            prefilled: true,
            question: {
              key: 'field-two',
            },
          },
        ]
        const falseyTests = [
          {
            value: '',
            responded: false,
            prefilled: true,
            question: {
              key: 'field-one',
            },
          },
          {
            value: {
              option: 'Yes',
              details: 'Some extra details',
            },
            responded: true,
            prefilled: true,
            question: {
              key: 'field-two',
            },
          },
          {
            value: {
              option: 'Yes',
              details: 'Some extra details',
            },
            responded: true,
            prefilled: true,
            question: {
              key: 'field-three',
            },
          },
        ]

        truthyTests.forEach(test => {
          describe(test.question.key, function () {
            beforeEach(function () {
              mockReq.assessment.responses = [test]
              controller.setPrefillBanner(mockReq, mockRes, nextSpy)
            })

            it('should set source date', function () {
              expect(mockRes.locals.prefilledSourceDate).to.equal(
                '2020-10-10T14:00:00'
              )
            })

            it('should set banner status to true', function () {
              expect(mockRes.locals.hasPrefilledResponses).to.be.true
            })

            it('should call next without error', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })
        })

        falseyTests.forEach(test => {
          describe(test.question.key, function () {
            beforeEach(function () {
              mockReq.assessment.responses = [test]
              controller.setPrefillBanner(mockReq, mockRes, nextSpy)
            })

            it('should set source date', function () {
              expect(mockRes.locals.prefilledSourceDate).to.equal(
                '2020-10-10T14:00:00'
              )
            })

            it('should set banner status to true', function () {
              expect(mockRes.locals.hasPrefilledResponses).to.be.false
            })

            it('should call next without error', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })
        })
      })
    })

    describe('#setShowReturnToOverviewButton', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        mockReq = { hasNextSteps: true, nextFrameworkSection: null }
        mockRes = { locals: {} }
        nextSpy = sinon.stub()
      })

      context('when not last step', function () {
        beforeEach(function () {
          controller.setShowReturnToOverviewButton(mockReq, mockRes, nextSpy)
        })

        it('should show the return to overview button', function () {
          expect(mockRes.locals.showReturnToOverviewButton).to.be.true
        })

        it('should call next without an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when last step', function () {
        beforeEach(function () {
          mockReq.hasNextSteps = false
        })

        context('and no next section', function () {
          beforeEach(function () {
            controller.setShowReturnToOverviewButton(mockReq, mockRes, nextSpy)
          })

          it('should not show the return to overview button', function () {
            expect(mockRes.locals.showReturnToOverviewButton).to.be.false
          })

          it('should call next without an error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#successHandler', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        mockReq = {
          body: {},
          baseUrl: '/base-url/framework/section',
          assessment: {
            framework: { name: 'framework' },
          },
          frameworkSection: {
            key: 'section',
          },
          form: { options: {} },
        }
        mockRes = {
          redirect: sinon.stub(),
        }
        nextSpy = sinon.stub()

        sinon.stub(FormWizardController.prototype, 'successHandler')
        sinon.stub(FormWizardController.prototype, 'getNextStep').returns('/')
      })

      context('with save and return submission', function () {
        beforeEach(function () {
          mockReq.body = {
            save_and_return_to_overview: '1',
          }
        })

        context('with old move design', function () {
          beforeEach(function () {
            controller.successHandler(mockReq, mockRes, nextSpy)
          })

          it('should redirect to base URL without the framework and section', function () {
            expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
              '/base-url'
            )
          })

          it('should not call parent success handler', function () {
            expect(
              FormWizardController.prototype.successHandler
            ).not.to.have.been.called
          })
        })

        context('with new move design preview', function () {
          beforeEach(function () {
            mockReq.moveDesignPreview = true
            controller.successHandler(mockReq, mockRes, nextSpy)
          })

          it('should redirect to base URL without the section', function () {
            expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
              '/base-url/framework'
            )
          })

          it('should not call parent success handler', function () {
            expect(
              FormWizardController.prototype.successHandler
            ).not.to.have.been.called
          })
        })
      })

      context('with standard submission', function () {
        context('with middle framework step', function () {
          beforeEach(function () {
            controller.successHandler(mockReq, mockRes, nextSpy)
          })

          it('should not redirect to base URL', function () {
            expect(mockRes.redirect).not.to.have.been.called
          })

          it('should call parent success handler', function () {
            expect(
              FormWizardController.prototype.successHandler
            ).to.have.been.calledOnce
          })
        })

        context('with last framework step', function () {
          beforeEach(function () {
            mockReq.form.options.route = '/two'
            FormWizardController.prototype.getNextStep.returns('/two')
          })

          context('with old move design', function () {
            beforeEach(function () {
              controller.successHandler(mockReq, mockRes, nextSpy)
            })

            it('should redirect to base URL without the framework and section', function () {
              expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
                '/base-url'
              )
            })

            it('should not call parent success handler', function () {
              expect(
                FormWizardController.prototype.successHandler
              ).not.to.have.been.called
            })
          })

          context('with new move design preview', function () {
            beforeEach(function () {
              mockReq.moveDesignPreview = true
              controller.successHandler(mockReq, mockRes, nextSpy)
            })

            it('should redirect to base URL without the section', function () {
              expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
                '/base-url/framework'
              )
            })

            it('should not call parent success handler', function () {
              expect(
                FormWizardController.prototype.successHandler
              ).not.to.have.been.called
            })
          })
        })
      })
    })

    describe('#saveValues', function () {
      const mockResponses = [
        { id: '1', value: 'Yes' },
        { id: '2', value: 'No' },
        { id: '3', value: 'Yes' },
        { id: '4', value: 'No' },
      ]
      let mockReq
      let nextSpy

      beforeEach(function () {
        sinon.stub(fieldHelpers, 'isAllowedDependent').returns(true)
        sinon
          .stub(frameworksHelpers, 'responsesToSaveReducer')
          .returns((acc, value) => {
            acc.push(value)
            return acc
          })
        sinon.stub(FormWizardController.prototype, 'saveValues')
        nextSpy = sinon.spy()

        mockReq = {
          body: {},
          form: {
            options: {
              fields: {
                one: { name: 'one' },
                two: { name: 'two' },
                three: { name: 'three' },
              },
            },
            values: {
              foo: 'bar',
              fizz: 'buzz',
            },
          },
          assessment: {
            id: '12345',
            responses: mockResponses,
            framework: {
              name: 'person-escort-record',
            },
          },
          services: {
            personEscortRecord: {
              respond: sinon.stub().resolves({}),
            },
            youthRiskAssessment: {
              respond: sinon.stub().resolves({}),
            },
          },
        }
      })

      context('without responses', function () {
        beforeEach(async function () {
          mockReq.assessment.responses = []

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call reducer correctly', function () {
          expect(
            frameworksHelpers.responsesToSaveReducer
          ).to.be.calledOnceWithExactly(mockReq.form.values)
        })

        it('should not call service', function () {
          expect(mockReq.services.personEscortRecord.respond).not.to.be.called
        })

        it('should call the super method', function () {
          expect(
            FormWizardController.prototype.saveValues
          ).to.be.calledOnceWithExactly(mockReq, {}, nextSpy)
        })

        it('should not call next', function () {
          expect(nextSpy).to.not.be.called
        })
      })

      context('when promises resolve', function () {
        beforeEach(async function () {
          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call reducer correctly', function () {
          expect(
            frameworksHelpers.responsesToSaveReducer
          ).to.be.calledOnceWithExactly(mockReq.form.values)
        })

        it('should call service method', function () {
          expect(
            mockReq.services.personEscortRecord.respond
          ).to.be.calledOnceWithExactly(mockReq.assessment.id, mockResponses)
        })

        it('should call the super method', function () {
          expect(
            FormWizardController.prototype.saveValues
          ).to.be.calledOnceWithExactly(mockReq, {}, nextSpy)
        })

        it('should not call next', function () {
          expect(nextSpy).to.not.be.called
        })
      })

      context('when service rejects with error', function () {
        const error = new Error()

        beforeEach(async function () {
          mockReq.services.personEscortRecord.respond = sinon
            .stub()
            .rejects(error)

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should not call the super method', function () {
          expect(FormWizardController.prototype.saveValues).to.not.be.called
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(error)
        })
      })

      context('with youth risk assessment', function () {
        beforeEach(async function () {
          mockReq.assessment.framework.name = 'youth-risk-assessment'

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call the correct service method', function () {
          expect(
            mockReq.services.youthRiskAssessment.respond
          ).to.be.calledOnceWithExactly(mockReq.assessment.id, mockResponses)
        })
      })

      describe('dependent field filtering', function () {
        const mockResponsesWithDependents = [
          {
            id: '1',
            value: 'Yes',
            question: {
              key: 'question-1',
            },
          },
          {
            id: '2',
            value: 'No',
            question: {
              key: 'question-2',
            },
          },
          {
            id: '3',
            value: 'Yes',
            question: {
              key: 'question-3',
            },
          },
          {
            id: '4',
            value: 'No',
            question: {
              key: 'question-4',
            },
          },
        ]

        beforeEach(async function () {
          mockReq.assessment.responses = mockResponsesWithDependents

          fieldHelpers.isAllowedDependent
            .withArgs(
              mockReq.form.options.fields,
              'question-2',
              mockReq.form.values
            )
            .returns(false)
            .withArgs(
              mockReq.form.options.fields,
              'question-4',
              mockReq.form.values
            )
            .returns(false)

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call isAllowedDependent filter on responses', function () {
          expect(fieldHelpers.isAllowedDependent.callCount).to.equal(
            mockResponsesWithDependents.length
          )
        })

        it('should call isAllowedDependent filter correctly', function () {
          mockResponsesWithDependents.forEach(response => {
            expect(fieldHelpers.isAllowedDependent).to.be.calledWithExactly(
              mockReq.form.options.fields,
              response?.question?.key,
              mockReq.form.values
            )
          })
        })

        it('should filter out dependent fields', function () {
          expect(
            mockReq.services.personEscortRecord.respond
          ).to.be.calledOnceWithExactly(mockReq.assessment.id, [
            mockResponsesWithDependents[0],
            mockResponsesWithDependents[2],
          ])
        })
      })
    })

    describe('#render', function () {
      let reqMock, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        sinon.stub(FormWizardController.prototype, 'render')
        sinon
          .stub(frameworksHelpers, 'renderNomisMappingsToField')
          .callsFake(() => ([key, field]) => {
            return [key, { ...field, renderNOMISInfo: true }]
          })
        sinon
          .stub(frameworksHelpers, 'renderPreviousAnswerToField')
          .callsFake(() => ([key, field]) => {
            return [key, { ...field, renderPrevAnswer: true }]
          })

        reqMock = {
          assessment: {
            responses: [
              {
                id: '1',
                value: 'one',
              },
              {
                id: '2',
                value: 'two',
              },
              {
                id: '3',
                value: 'three',
              },
            ],
          },
          form: {
            options: {
              fields: {
                field_1: {
                  name: 'Field 1',
                },
                field_2: {
                  name: 'Field 2',
                },
                field_3: {
                  name: 'Field 3',
                },
              },
            },
          },
        }

        controller.render(reqMock, {}, nextSpy)
      })

      it('should call renderNomisMappingsToField on each field', function () {
        expect(
          frameworksHelpers.renderNomisMappingsToField
        ).to.be.calledOnceWithExactly(reqMock.assessment.responses)
      })

      it('should call renderPreviousAnswerToField on each field', function () {
        expect(
          frameworksHelpers.renderPreviousAnswerToField
        ).to.be.calledOnceWithExactly({
          responses: reqMock.assessment.responses,
        })
      })

      it('should mutate fields object', function () {
        expect(reqMock.form.options.fields).to.deep.equal({
          field_1: {
            renderNOMISInfo: true,
            renderPrevAnswer: true,
            name: 'Field 1',
          },
          field_2: {
            renderNOMISInfo: true,
            renderPrevAnswer: true,
            name: 'Field 2',
          },
          field_3: {
            renderNOMISInfo: true,
            renderPrevAnswer: true,
            name: 'Field 3',
          },
        })
      })

      it('should call parent render method', function () {
        expect(
          FormWizardController.prototype.render
        ).to.be.calledOnceWithExactly(reqMock, {}, nextSpy)
      })
    })
  })
})
