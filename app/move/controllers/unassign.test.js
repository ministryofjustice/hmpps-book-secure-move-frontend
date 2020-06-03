const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

const UnassignController = require('./unassign')

const controller = new UnassignController({ route: '/' })

describe('Move controllers', function () {
  describe('Unassign controller', function () {
    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkAllocation middleware', function () {
        expect(controller.use).to.have.been.calledOnceWithExactly(
          controller.checkAllocation
        )
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setMoveRelationships middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setMoveRelationships
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#checkAllocation()', function () {
      let req, res, next

      beforeEach(function () {
        next = sinon.stub()
        req = {
          move: {},
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      context('with no allocation', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
          }
          controller.checkAllocation(req, res, next)
        })

        it('should redirect to allocation', function () {
          expect(res.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function () {
          expect(next).to.not.be.called
        })
      })

      context('with allocation but not person', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
            allocation: { id: '6789' },
          }
          controller.checkAllocation(req, res, next)
        })

        it('should redirect to allocation', function () {
          expect(res.redirect).to.be.calledOnceWithExactly('/allocation/6789')
        })

        it('should not call next', function () {
          expect(next).to.not.be.called
        })
      })

      context('with allocation and person', function () {
        beforeEach(function () {
          req.move = {
            id: '12345',
            allocation: { id: '6789' },
            profile: { person: { id: '__person__' } },
          }

          controller.checkAllocation(req, res, next)
        })

        it('should not redirect', function () {
          expect(res.redirect).to.not.be.called
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setMoveRelationships()', function () {
      let req, res, next

      beforeEach(function () {
        next = sinon.stub()
        req = {
          move: {
            id: '12345',
            allocation: { id: '__allocation__' },
            profile: { person: { id: '__person__' } },
          },
        }
        res = {
          locals: {},
          redirect: sinon.stub(),
        }
        controller.setMoveRelationships(req, res, next)
      })

      it('should set move on locals', function () {
        expect(res.locals.move).to.deep.equal({
          id: '12345',
          allocation: { id: '__allocation__' },
          profile: { person: { id: '__person__' } },
        })
      })

      it('should set allocation on locals', function () {
        expect(res.locals.allocation).to.deep.equal({ id: '__allocation__' })
      })

      it('should set person on locals', function () {
        expect(res.locals.person).to.deep.equal({ id: '__person__' })
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })

    describe('#saveValues()', function () {
      const move = { id: '__move__' }
      const req = {
        move,
      }
      const res = {}
      let next

      beforeEach(function () {
        sinon.stub(moveService, 'unassign')
        moveService.unassign.resolves({})
        sinon.stub(FormWizardController.prototype, 'saveValues')
        next = sinon.stub()
      })

      context('when person is unassigned', function () {
        beforeEach(async function () {
          await controller.saveValues(req, res, next)
        })

        it('should remove person from move', function () {
          expect(moveService.unassign).to.be.calledOnceWithExactly('__move__')
        })

        it('should call the super method', function () {
          expect(
            FormWizardController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, res, next)
        })

        it('should not call next', function () {
          expect(next).to.not.be.called
        })
      })

      context('when the api returns an error', function () {
        const error = new Error()
        beforeEach(async function () {
          moveService.unassign.throws(error)
          await controller.saveValues(req, res, next)
        })

        it('should not call the super method', function () {
          expect(FormWizardController.prototype.saveValues).to.not.be.called
        })

        it('should call next with the error', function () {
          expect(next).to.be.calledOnceWithExactly(error)
        })
      })
    })

    describe('#successHandler()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          sessionModel: {
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
          move: {
            allocation: {
              id: '__allocation__',
            },
          },
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      context('when person unassign is successful', function () {
        beforeEach(async function () {
          await controller.successHandler(req, res, nextSpy)
        })

        it('should reset the journey', function () {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function () {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect to allocation correctly', function () {
          expect(res.redirect).to.have.been.calledOnceWithExactly(
            '/allocation/__allocation__'
          )
        })
      })
    })
  })
})
