const FormWizardController = require('../../../common/controllers/form-wizard')
const responseService = require('../../../common/services/framework-response')

const Controller = require('./frameworks')

const controller = new Controller({ route: '/' })

describe('Person Escort Record controllers', function () {
  describe('FrameworksController', function () {
    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareSetup).to.have.been
          .calledOnce
      })

      it('should call set models method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setButtonText
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
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

    describe('#successHandler', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        mockReq = {
          body: {},
          baseUrl: '/base-url',
        }
        mockRes = {
          redirect: sinon.stub(),
        }
        nextSpy = sinon.stub()

        sinon.stub(FormWizardController.prototype, 'successHandler')
      })

      context('with save and return submission', function () {
        beforeEach(function () {
          mockReq.body = {
            save_and_return_to_overview: '1',
          }
          controller.successHandler(mockReq, mockRes, nextSpy)
        })

        it('should redirect to base URL', function () {
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
    })

    describe('#getResponses', function () {
      const mockFormValues = {
        'question-2': 'Yes',
      }
      const mockResponses = [
        {
          id: '1',
          question: {
            key: 'question-1',
          },
        },
        {
          id: '2',
          question: {
            key: 'question-2',
          },
        },
        {
          id: '3',
          question: {
            key: 'question-3',
          },
        },
      ]
      let responses

      context('with no form values', function () {
        beforeEach(function () {
          responses = controller.getResponses({}, mockResponses)
        })

        it('should not return any responses', function () {
          expect(responses).to.deep.equal([])
        })
      })

      context('with form values', function () {
        beforeEach(function () {
          responses = controller.getResponses(mockFormValues, mockResponses)
        })

        it('should return responses that have value', function () {
          expect(responses).to.deep.equal([
            {
              id: '2',
              value: 'Yes',
            },
          ])
        })
      })
    })

    describe('#saveValues', function () {
      const mockReq = {
        form: {
          values: {
            foo: 'bar',
            fizz: 'buzz',
          },
        },
        personEscortRecord: {
          responses: [{ id: '1' }, { id: '2' }],
        },
      }
      const mockResponses = [
        { id: '1', value: 'Yes' },
        { id: '2', value: 'No' },
        { id: '3', value: 'Yes' },
        { id: '4', value: 'No' },
      ]
      let nextSpy

      beforeEach(function () {
        sinon.stub(responseService, 'update')
        sinon.stub(Controller.prototype, 'getResponses').returns(mockResponses)
        sinon.stub(FormWizardController.prototype, 'saveValues')
        nextSpy = sinon.spy()
      })

      context('when promises resolve', function () {
        beforeEach(async function () {
          responseService.update.resolves({})

          await controller.saveValues(mockReq, {}, nextSpy)
        })

        it('should get responses', function () {
          expect(Controller.prototype.getResponses).to.be.calledOnceWithExactly(
            mockReq.form.values,
            mockReq.personEscortRecord.responses
          )
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
    })
  })
})
