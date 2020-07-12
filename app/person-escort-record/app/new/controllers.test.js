const FormWizardController = require('../../../../common/controllers/form-wizard')
const personEscortRecordService = require('../../../../common/services/person-escort-record')
const i18n = require('../../../../config/i18n')

const { NewPersonEscortRecordController } = require('./controllers')

const controller = new NewPersonEscortRecordController({ route: '/' })

describe('Person Escort Record controllers', function () {
  describe('NewPersonEscortRecordController', function () {
    describe('#middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setMoveId')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setMoveId middleware', function () {
        expect(controller.use).to.have.been.calledWith(controller.setMoveId)
      })

      it('should call setBeforeFieldsContent middleware', function () {
        expect(controller.use).to.have.been.calledWith(
          controller.setBeforeFieldsContent
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#setMoveId', function () {
      let req, res, next

      beforeEach(function () {
        next = sinon.stub()
        req = {
          move: {
            id: '12345',
          },
        }
        res = {
          locals: {},
        }

        controller.setMoveId(req, res, next)
      })

      it('should set moveId on locals', function () {
        expect(res.locals.moveId).to.equal('12345')
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })

    describe('#setBeforeFieldsContent', function () {
      let req, next

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        next = sinon.stub()
        req = {
          form: {
            options: {},
          },
        }
      })

      context('with location type', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
            from_location: {
              location_type: 'police',
            },
          }
          controller.setBeforeFieldsContent(req, {}, next)
        })

        it('should call translation with correct context', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'person-escort-record::create.steps.before_you_start.content',
            {
              context: 'police',
            }
          )
        })

        it('should set beforeFieldsContent option', function () {
          expect(req.form.options.beforeFieldsContent).to.equal(
            'person-escort-record::create.steps.before_you_start.content'
          )
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('without location type', function () {
        beforeEach(function () {
          controller.setBeforeFieldsContent(req, {}, next)
        })

        it('should call translation without correct', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'person-escort-record::create.steps.before_you_start.content',
            {
              context: undefined,
            }
          )
        })

        it('should set beforeFieldsContent option', function () {
          expect(req.form.options.beforeFieldsContent).to.equal(
            'person-escort-record::create.steps.before_you_start.content'
          )
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
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

    describe('#successHandler', function () {
      const mockRecordId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, res

      beforeEach(function () {
        req = {
          record: {
            id: mockRecordId,
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
          `/person-escort-record/${mockRecordId}`
        )
      })
    })
  })
})
