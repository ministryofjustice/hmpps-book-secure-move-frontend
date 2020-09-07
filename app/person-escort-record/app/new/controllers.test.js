const FormWizardController = require('../../../../common/controllers/form-wizard')
const personEscortRecordService = require('../../../../common/services/person-escort-record')

const { NewPersonEscortRecordController } = require('./controllers')

const controller = new NewPersonEscortRecordController({ route: '/' })

describe('Person Escort Record controllers', function () {
  describe('NewPersonEscortRecordController', function () {
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

    describe('#saveValues', function () {
      const mockProfileId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, nextSpy

      beforeEach(function () {
        sinon.stub(personEscortRecordService, 'create')
        nextSpy = sinon.spy()
        req = {
          move: {
            profile: {
              id: mockProfileId,
            },
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          personEscortRecordService.create.resolves({})
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should create person escort record', function () {
          expect(personEscortRecordService.create).to.be.calledOnceWithExactly(
            mockProfileId
          )
        })

        it('should set record to request', function () {
          expect(req).to.contain.property('record')
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when save fails', function () {
        context('with existing record error', function () {
          const errorMock = new Error('Existing record')

          beforeEach(async function () {
            errorMock.statusCode = 422
            errorMock.errors = [
              {
                code: 'taken',
              },
            ]

            sinon.stub(controller, 'successHandler')

            personEscortRecordService.create.throws(errorMock)
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })

          it('should call success handler', function () {
            expect(controller.successHandler).to.be.calledOnceWithExactly(
              req,
              {}
            )
          })
        })

        context('with any other error', function () {
          const errorMock = new Error('Problem')

          beforeEach(async function () {
            personEscortRecordService.create.throws(errorMock)
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should call next with the error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })
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
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }

        controller.successHandler(req, res)
      })

      it('should reset the journey', function () {
        expect(req.journeyModel.reset).to.have.been.calledOnceWithExactly()
      })

      it('should reset the session', function () {
        expect(req.sessionModel.reset).to.have.been.calledOnceWithExactly()
      })

      it('should redirect correctly', function () {
        expect(res.redirect).to.have.been.calledOnceWithExactly(
          `/move/${mockMoveId}`
        )
      })
    })
  })
})
