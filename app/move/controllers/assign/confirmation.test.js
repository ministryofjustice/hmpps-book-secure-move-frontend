const proxyquire = require('proxyquire')

const AssignBaseController = require('./base')

const allocationGetByIdStub = sinon.stub().resolves({ moves: [] })

const ConfirmationController = proxyquire('./confirmation', {
  '../../../../common/services/allocation': {
    getById: allocationGetByIdStub,
  },
})

const controller = new ConfirmationController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)
const BaseProto = AssignBaseController.prototype

describe('Assign controllers', function() {
  describe('Assign confirmation status controller', function() {
    it('should extend AssignBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(BaseProto)
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(BaseProto, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(BaseProto.middlewareLocals).to.have.been.calledOnce
      })

      it('should call set assign next method', function() {
        expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
          controller.setUnassignedMove
        )
      })

      it('should call correct number of additional middleware', function() {
        expect(controller.use).to.be.callCount(1)
      })
    })

    describe('#setUnassignedMove()', function() {
      const move = { id: '__move__', allocation: { id: '__allocation__' } }
      const req = {}
      const res = {
        locals: {
          move,
        },
      }
      let next
      beforeEach(function() {
        next = sinon.stub()
        allocationGetByIdStub.resetHistory()
      })

      describe('When setting the next move to assign', function() {
        beforeEach(async function() {
          await controller.setUnassignedMove(req, res, next)
        })

        it('should fetch the allocation the move is in', function() {
          expect(allocationGetByIdStub).to.be.calledOnceWithExactly(
            '__allocation__'
          )
        })

        it('should call next', function() {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      describe('When no unfilled moves remain', function() {
        beforeEach(async function() {
          await controller.setUnassignedMove(req, res, next)
        })

        it('should not set a move to assign next', function() {
          expect(res.locals.unassignedMoveId).to.be.undefined
        })
      })

      describe('When unfilled moves remain', function() {
        beforeEach(async function() {
          allocationGetByIdStub.resolves({
            moves: [
              {
                id: '1234',
                person: {
                  id: '__person__',
                },
              },
              {
                id: '5678',
                person: null,
              },
            ],
          })
          await controller.setUnassignedMove(req, res, next)
        })

        it('should set a move to assign next', function() {
          expect(res.locals.unassignedMoveId).to.equal('5678')
        })
      })

      describe('When allocation service returns an error', function() {
        const error = new Error()
        beforeEach(async function() {
          allocationGetByIdStub.throws(error)
          await controller.setUnassignedMove(req, res, next)
        })

        it('should call next with the error', function() {
          expect(next).to.be.calledOnceWithExactly(error)
        })
      })
    })
  })
})
