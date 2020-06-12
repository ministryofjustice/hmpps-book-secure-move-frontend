const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./person')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Create Person controller', function () {
    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkManualCreation')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call setNextStep middleware', function () {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.checkManualCreation
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#checkManualCreation()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          sessionModel: {
            set: sinon.stub(),
          },
          query: {},
          form: {
            options: {},
          },
        }
        sinon.stub(FormController.prototype, 'successHandler')
      })

      context('when request query does not contain skip', function () {
        beforeEach(function () {
          controller.checkManualCreation(req, {}, nextSpy)
        })

        it('should not set skip option', function () {
          expect(req.form.options).not.to.have.property('skip')
        })

        it('should set manual creation to false', function () {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'is_manual_person_creation',
            false
          )
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when request query contains skip', function () {
        beforeEach(function () {
          req.query.skip = ''
          controller.checkManualCreation(req, {}, nextSpy)
        })

        it('should set skip option to true', function () {
          expect(req.form.options).to.have.property('skip')
          expect(req.form.options.skip).equal(true)
        })

        it('should set manual creation to true', function () {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'is_manual_person_creation',
            true
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })

        it('should call success handler', function () {
          expect(
            FormController.prototype.successHandler
          ).to.be.calledOnceWithExactly(req, {}, nextSpy)
        })
      })
    })
  })
})
