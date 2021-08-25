const FormWizardController = require('../form-wizard')

const NewAssessmentController = require('./new-assessment')

const controller = new NewAssessmentController({ route: '/' })

describe('Framework controllers', function () {
  describe('NewAssessmentController', function () {
    describe('#middlewareChecks', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkProfileExists')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkProfileExists middleware', function () {
        expect(controller.use).to.have.been.calledWith(
          controller.checkProfileExists
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#checkProfileExists', function () {
      let req, res, next

      beforeEach(function () {
        next = sinon.stub()
        req = {}
        res = {}
      })

      context('with profile', function () {
        beforeEach(function () {
          req = {
            move: {
              profile: {
                id: '12345',
              },
            },
          }

          controller.checkProfileExists(req, res, next)
        })

        it('should call next without error', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('without profile', function () {
        beforeEach(function () {
          controller.checkProfileExists(req, res, next)
        })

        it('should call next with 404 error', function () {
          const error = next.args[0][0]

          expect(next).to.be.calledOnce

          expect(error).to.be.an('error')
          expect(error.message).to.equal('Move profile not found')
          expect(error.statusCode).to.equal(404)
        })
      })
    })

    describe('#successHandler', function () {
      const mockMoveId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, res

      beforeEach(function () {
        req = {
          move: {
            id: mockMoveId,
          },
          sessionModel: {
            get: sinon.stub(),
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      describe('basis functions', function () {
        beforeEach(function () {
          controller.successHandler(req, res)
        })

        it('should reset the journey', function () {
          expect(req.journeyModel.reset).to.have.been.calledOnceWithExactly()
        })

        it('should reset the session', function () {
          expect(req.sessionModel.reset).to.have.been.calledOnceWithExactly()
        })
      })

      context('with return URL', function () {
        beforeEach(function () {
          req.sessionModel.get
            .withArgs('returnUrl')
            .returns('/return-url-from-session')

          controller.successHandler(req, res)
        })

        it('should redirect to return URL', function () {
          expect(res.redirect).to.have.been.calledOnceWithExactly(
            '/return-url-from-session'
          )
        })
      })

      context('without return URL', function () {
        beforeEach(function () {
          req.sessionModel.get.withArgs('returnUrl').returns(undefined)

          controller.successHandler(req, res)
        })

        it('should redirect to move', function () {
          expect(res.redirect).to.have.been.calledOnceWithExactly(
            `/move/${req.move.id}`
          )
        })
      })
    })
  })
})
