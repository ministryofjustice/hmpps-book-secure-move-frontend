const proxyquire = require('proxyquire')

const FormWizardController = require('../../../common/controllers/form-wizard')

const allocationGetByIdStub = sinon.stub()
allocationGetByIdStub.resolves({ id: '__allocation__' })
const moveUpdateStub = sinon.stub()
moveUpdateStub.resolves({})

const UnassignController = proxyquire('./unassign', {
  '../../../common/services/allocation': {
    getById: allocationGetByIdStub,
  },
  '../../../common/services/move': {
    update: moveUpdateStub,
  },
})

const controller = new UnassignController({ route: '/' })

describe('Move controllers', function() {
  describe('Unassign controller', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkAllocation middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.checkAllocation
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setMoveRelationships middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setMoveRelationships
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#checkAllocation()', function() {
      let res, next

      beforeEach(function() {
        next = sinon.stub()
      })

      context('with no allocation', function() {
        beforeEach(function() {
          res = {
            locals: {
              move: {
                id: '12345',
              },
            },
            redirect: sinon.stub(),
          }
          controller.checkAllocation({}, res, next)
        })

        it('should redirect to allocation', function() {
          expect(res.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function() {
          expect(next).to.not.be.called
        })
      })

      context('with allocation but not person', function() {
        beforeEach(function() {
          res = {
            locals: {
              move: {
                id: '12345',
                allocation: { id: '6789' },
              },
            },
            redirect: sinon.stub(),
          }
          controller.checkAllocation({}, res, next)
        })

        it('should redirect to allocation', function() {
          expect(res.redirect).to.be.calledOnceWithExactly('/allocation/6789')
        })

        it('should not call next', function() {
          expect(next).to.not.be.called
        })
      })

      context('with allocation and person', async function() {
        beforeEach(function() {
          res = {
            locals: {
              move: {
                id: '12345',
                allocation: { id: '6789' },
                person: { id: '__person__' },
              },
            },
            redirect: sinon.stub(),
          }

          controller.checkAllocation({}, res, next)
        })

        it('should not redirect', function() {
          expect(res.redirect).to.not.be.called
        })

        it('should call next', function() {
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setMoveRelationships()', function() {
      let res, next

      beforeEach(function() {
        next = sinon.stub()
      })

      context('with allocation and person', async function() {
        beforeEach(function() {
          allocationGetByIdStub.resetHistory()

          res = {
            locals: {
              move: {
                id: '12345',
                allocation: { id: '6789' },
                person: { id: '__person__' },
              },
            },
            redirect: sinon.stub(),
          }

          controller.setMoveRelationships({}, res, next)
        })

        it('should fetch allocation', function() {
          expect(allocationGetByIdStub).to.be.calledOnceWithExactly('6789')
        })
      })
    })

    describe('#saveValues()', function() {
      const move = { id: '__move__' }
      const req = {}
      const res = {
        locals: {
          move,
        },
      }
      let next

      beforeEach(function() {
        moveUpdateStub.resetHistory()
        sinon.stub(FormWizardController.prototype, 'saveValues')
        next = sinon.stub()
      })

      context('when person is unassigned', function() {
        beforeEach(async function() {
          await controller.saveValues(req, res, next)
        })

        it('should remove person from move', function() {
          expect(moveUpdateStub).to.be.calledOnceWithExactly({
            id: '__move__',
            person: {
              id: null,
            },
            move_agreed: false,
            move_agreed_by: '',
          })
        })

        it('should call the super method', function() {
          expect(
            FormWizardController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, res, next)
        })

        it('should not call next', function() {
          expect(next).to.not.be.called
        })
      })

      context('when the api returns an error', function() {
        const error = new Error()
        beforeEach(async function() {
          moveUpdateStub.throws(error)
          await controller.saveValues(req, res, next)
        })

        it('should not call the super method', function() {
          expect(FormWizardController.prototype.saveValues).to.not.be.called
        })

        it('should call next with the error', function() {
          expect(next).to.be.calledOnceWithExactly(error)
        })
      })
    })

    describe('#successHandler()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          sessionModel: {
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
          locals: {
            allocation: {
              id: '__allocation__',
            },
          },
        }
      })

      context('when person unassign is successful', function() {
        beforeEach(async function() {
          await controller.successHandler(req, res, nextSpy)
        })

        it('should reset the journey', function() {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function() {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect to allocation correctly', function() {
          expect(res.redirect).to.have.been.calledOnceWithExactly(
            '/allocation/__allocation__'
          )
        })
      })
    })
  })
})
