const presenters = require('../../../../../common/presenters')
const personService = {
  getTimetableByDate: sinon.stub(),
}

const BaseController = require('./base')
const Controller = require('./timetable')

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Timetable controller', function () {
    let mockReq, mockRes, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      personService.getTimetableByDate.resetHistory()
    })

    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'getTimetable')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('should call setNextStep middleware', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.getTimetable
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkTimetable')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call setNextStep middleware', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.checkTimetable
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setTimetable')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setTimetable middleware', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setTimetable
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#getTimetable()', function () {
      const mockProfile = {
        id: '12345',
        person: {
          id: '67890',
        },
      }
      const mockTimetable = [
        {
          id: '12345',
        },
        {
          id: '67890',
        },
        {
          id: '09876',
        },
        {
          id: '54321',
        },
      ]
      const mockMoveDate = '2020-10-15'

      beforeEach(function () {
        mockReq = {
          sessionModel: {
            get: sinon.stub(),
          },
          services: {
            person: personService,
          },
        }
      })

      context('without profile', function () {
        beforeEach(async function () {
          await controller.getTimetable(mockReq, {}, nextSpy)
        })

        it('should not call person service', function () {
          expect(personService.getTimetableByDate).not.to.be.called
        })

        it('should not set timetable', function () {
          expect(mockReq).not.to.contain.property('timetable')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with profile', function () {
        beforeEach(function () {
          mockReq.sessionModel.get.withArgs('profile').returns(mockProfile)
          mockReq.sessionModel.get.withArgs('date').returns(mockMoveDate)
        })

        context('when getTimetableByDate rejects', function () {
          const mockError = new Error('Mock error')

          beforeEach(async function () {
            personService.getTimetableByDate.rejects(mockError)
            await controller.getTimetable(mockReq, {}, nextSpy)
          })

          it('should call person service', function () {
            expect(
              personService.getTimetableByDate
            ).to.be.calledOnceWithExactly(mockProfile.person.id, mockMoveDate)
          })

          it('should not set timetable', function () {
            expect(mockReq).not.to.contain.property('timetable')
          })

          it('should call next with error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly(mockError)
          })
        })

        context('when getTimetableByDate resolves', function () {
          beforeEach(async function () {
            personService.getTimetableByDate.resolves(mockTimetable)
            await controller.getTimetable(mockReq, {}, nextSpy)
          })

          it('should call person service', function () {
            expect(
              personService.getTimetableByDate
            ).to.be.calledOnceWithExactly(mockProfile.person.id, mockMoveDate)
          })

          it('should set timetable', function () {
            expect(mockReq).to.contain.property('timetable')
            expect(mockReq.timetable).to.deep.equal(mockTimetable)
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('#checkTimetable()', function () {
      beforeEach(function () {
        mockReq = {
          form: {
            options: {},
          },
        }
        mockRes = {
          locals: {},
        }

        sinon.stub(BaseController.prototype, 'successHandler')
      })

      context('when request query does not contain timetable', function () {
        beforeEach(function () {
          controller.checkTimetable(mockReq, {}, nextSpy)
        })

        it('should set skip option to true', function () {
          expect(mockReq.form.options).to.have.property('skip')
          expect(mockReq.form.options.skip).equal(true)
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })

        it('should call success handler', function () {
          expect(
            BaseController.prototype.successHandler
          ).to.be.calledOnceWithExactly(mockReq, {}, nextSpy)
        })
      })

      context('when request query contains timetable', function () {
        context('when timetable is empty', function () {
          beforeEach(function () {
            mockReq.timetable = []
            controller.checkTimetable(mockReq, {}, nextSpy)
          })

          it('should set skip option to true', function () {
            expect(mockReq.form.options).to.have.property('skip')
            expect(mockReq.form.options.skip).equal(true)
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })

          it('should call success handler', function () {
            expect(
              BaseController.prototype.successHandler
            ).to.be.calledOnceWithExactly(mockReq, {}, nextSpy)
          })
        })

        context('when timetable has items', function () {
          beforeEach(function () {
            mockReq.timetable = ['1', '2', '3']
            controller.checkTimetable(mockReq, {}, nextSpy)
          })

          it('should not set skip option', function () {
            expect(mockReq.form.options).not.to.have.property('skip')
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })

          it('should not call success handler', function () {
            expect(BaseController.prototype.successHandler).not.to.be.called
          })
        })
      })
    })

    describe('#setTimetable()', function () {
      beforeEach(function () {
        mockReq = {
          timetable: ['1', '2', '3'],
        }
        mockRes = {
          locals: {},
        }

        sinon.stub(presenters, 'timetableToTableComponent').returnsArg(0)
        controller.setTimetable(mockReq, mockRes, nextSpy)
      })

      it('should call presenter', function () {
        expect(
          presenters.timetableToTableComponent
        ).to.be.calledOnceWithExactly(mockReq.timetable)
      })

      it('should set local variable', function () {
        expect(mockRes.locals).to.contain.property('timetable')
        expect(mockRes.locals.timetable).to.deep.equal(mockReq.timetable)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
