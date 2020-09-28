const FormWizardController = require('../../../common/controllers/form-wizard')
const fieldHelpers = require('../../../common/helpers/field')
const frameworksHelpers = require('../../../common/helpers/frameworks')
const permissionsMiddleware = require('../../../common/middleware/permissions')
const responseService = require('../../../common/services/framework-response')

const Controller = require('./framework-step')

const controller = new Controller({ route: '/' })

describe('Person Escort Record controllers', function () {
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
          controller.setButtonText
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(2)
      })
    })

    describe('#middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'setPageTitleLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set models method', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setPageTitleLocals
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
      })
    })

    describe('#checkEditable', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        sinon.stub(permissionsMiddleware, 'check').returns(true)
        nextSpy = sinon.spy()
        mockReq = {
          personEscortRecord: {
            id: '12345',
            isEditable: true,
          },
          baseUrl: '/base-url',
          user: {
            permissions: ['one', 'two'],
          },
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      context('when Person Escort Record is not editable', function () {
        beforeEach(function () {
          mockReq.personEscortRecord.isEditable = false

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
          permissionsMiddleware.check.returns(false)
          controller.checkEditable(mockReq, mockRes, nextSpy)
        })

        it('should check permissions correctly', function () {
          expect(permissionsMiddleware.check).to.be.calledOnceWithExactly(
            'person_escort_record:update',
            mockReq.user.permissions
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

    describe('#setButtonText', function () {
      let mockReq, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          form: {
            options: {},
          },
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

    describe('#successHandler', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        mockReq = {
          body: {},
          baseUrl: '/base-url',
          form: {
            options: {},
          },
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
          controller.successHandler(mockReq, mockRes, nextSpy)
        })

        it('should redirect to base URL with last step path', function () {
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

      context('with standard submission', function () {
        context('with last framework step', function () {
          beforeEach(function () {
            mockReq.form.options.route = '/two-continued'
            FormWizardController.prototype.getNextStep.returns(
              '/full/path/to/step/two-continued'
            )
            controller.successHandler(mockReq, mockRes, nextSpy)
          })

          it('should redirect to base URL with last step path', function () {
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

        context('with framework step that contains last step', function () {
          beforeEach(function () {
            mockReq.form.options.route = '/two'
            FormWizardController.prototype.getNextStep.returns(
              '/full/path/to/step/two-continued'
            )
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

        context(
          'with framework step that contains same end as last step',
          function () {
            beforeEach(function () {
              mockReq.form.options.route = '/continued'
              FormWizardController.prototype.getNextStep.returns(
                '/full/path/to/step/two-continued'
              )
              controller.successHandler(mockReq, mockRes, nextSpy)
            })

            it('should not redirect to base URL', function () {
              expect(mockRes.redirect).not.to.have.been.called
            })

            it('should call parent success handler', function () {
              expect(FormWizardController.prototype.successHandler).to.have.been
                .calledOnce
            })
          }
        )

        context('with all other steps', function () {
          beforeEach(function () {
            FormWizardController.prototype.getNextStep.returns('/two')
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
      })
    })

    describe('#saveValues', function () {
      const mockResponses = [
        { id: '1', value: 'Yes' },
        { id: '2', value: 'No' },
        { id: '3', value: 'Yes' },
        { id: '4', value: 'No' },
      ]
      const mockReq = {
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
        personEscortRecord: {
          responses: mockResponses,
        },
      }
      let nextSpy

      beforeEach(function () {
        sinon.stub(responseService, 'update')
        sinon.stub(fieldHelpers, 'isAllowedDependent').returns(true)
        sinon
          .stub(frameworksHelpers, 'responsesToSaveReducer')
          .returns((acc, value) => {
            acc.push(value)
            return acc
          })
        sinon.stub(FormWizardController.prototype, 'saveValues')
        nextSpy = sinon.spy()
      })

      context('when promises resolve', function () {
        beforeEach(async function () {
          responseService.update.resolves({})

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should call reducer correctly', function () {
          expect(
            frameworksHelpers.responsesToSaveReducer
          ).to.be.calledOnceWithExactly(mockReq.form.values)
        })

        it('should call correct number of updates', function () {
          expect(responseService.update.callCount).to.equal(
            mockResponses.length
          )
        })

        it('should update each response correct', function () {
          mockResponses.forEach((response, i) => {
            expect(responseService.update.getCall(i)).to.be.calledWithExactly(
              mockResponses[i]
            )
          })
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
          responseService.update.rejects(error)

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should not call the super method', function () {
          expect(FormWizardController.prototype.saveValues).to.not.be.called
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(error)
        })
      })

      context(
        'when service rejects with error but is a js items call',
        function () {
          const error = new Error()
          const mockReqWithJsItems = {
            ...mockReq,
            body: {
              'js-items-length': '2',
            },
            originalUrl: '/original/url',
          }
          const mockRes = {}

          beforeEach(async function () {
            responseService.update.rejects(error)
            mockRes.redirect = sinon.stub()

            await controller.saveValues(mockReqWithJsItems, mockRes, nextSpy)
          })

          it('should not call the super method', function () {
            expect(FormWizardController.prototype.saveValues).to.not.be.called
          })

          it('should not call next with the error', function () {
            expect(nextSpy).to.not.be.called
          })

          it('should redirect to self', function () {
            expect(mockRes.redirect).to.be.calledOnceWithExactly(
              mockReqWithJsItems.originalUrl
            )
          })
        }
      )

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
          mockReq.personEscortRecord.responses = mockResponsesWithDependents
          responseService.update.resolves({})

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

        it('should save correct number of responses', function () {
          expect(responseService.update.callCount).to.equal(2)
        })

        it('should filter out dependent fields', function () {
          expect(responseService.update).to.be.calledWithExactly(
            mockResponsesWithDependents[0]
          )
          expect(responseService.update).to.be.calledWithExactly(
            mockResponsesWithDependents[2]
          )
        })
      })
    })
  })
})
