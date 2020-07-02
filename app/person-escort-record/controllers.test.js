const FormWizardController = require('../../common/controllers/form-wizard')
const presenters = require('../../common/presenters')

const controllers = require('./controllers')

describe('Person Escort Record controllers', function () {
  describe('FrameworksController', function () {
    const controller = new controllers.FrameworksController({ route: '/' })

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
  })

  describe('#FrameworkSectionController', function () {
    const controller = new controllers.FrameworkSectionController({
      route: '/',
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(
          controllers.FrameworksController.prototype,
          'middlewareLocals'
        )
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(controllers.FrameworksController.prototype.middlewareLocals).to
          .have.been.calledOnce
      })

      it('should call set models method', function () {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setSectionSummary
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(1)
      })
    })

    describe('#setSectionSummary', function () {
      let mockReq, mockRes, nextSpy, mapStub

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          originalUrl: '/original-url',
          form: {
            options: {
              allFields: {
                fieldOne: { name: 'field-one' },
                fieldTwo: { name: 'field-two' },
              },
            },
          },
          frameworkSection: {
            name: 'Foo',
            steps: {
              '/step-1': {},
              '/step-2': {},
              '/step-3': {},
            },
          },
        }
        mockRes = {
          locals: {},
        }
        mapStub = sinon
          .stub()
          .onCall(0)
          .returns(['/step-1', { url: '/step-one' }])
          .onCall(1)
          .returns(undefined)
          .onCall(2)
          .returns(['/step-3', { url: '/step-three' }])
        sinon.stub(presenters, 'frameworkStepToSummary').returns(mapStub)

        controller.setSectionSummary(mockReq, mockRes, nextSpy)
      })

      it('should set section title', function () {
        expect(mockRes.locals.sectionTitle).to.equal('Foo')
      })

      it('should call presenter', function () {
        expect(presenters.frameworkStepToSummary).to.be.calledOnceWithExactly(
          mockReq.form.options.allFields,
          mockReq.originalUrl
        )
      })

      it('should map each item', function () {
        expect(mapStub.callCount).to.equal(3)
      })

      it('should set summary steps filtering any falsy values', function () {
        expect(mockRes.locals.summarySteps).to.deep.equal([
          [
            '/step-1',
            {
              url: '/step-one',
            },
          ],
          [
            '/step-3',
            {
              url: '/step-three',
            },
          ],
        ])
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
