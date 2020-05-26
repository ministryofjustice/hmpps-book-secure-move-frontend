const AssessmentController = require('./agreement-status')
const AssignBaseController = require('./base')

const controller = new AssessmentController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Assign controllers', function() {
  describe('Assign agreement status controller', function() {
    it('should extend AssignBaseController', function() {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        AssignBaseController.prototype
      )
    })

    describe('#saveValues()', function() {
      const values = { foo: 'bar' }
      const move = { id: '__move__' }
      const res = {}
      let req
      let next
      beforeEach(function() {
        req = {
          form: {
            values,
          },
          sessionModel: {
            set: sinon.stub(),
            get: sinon.stub().returns(move),
          },
        }
        next = sinon.stub()
        sinon.stub(AssignBaseController.prototype, 'saveValues')
      })
      describe('When saving the agreement status values', function() {
        beforeEach(async function() {
          await controller.saveValues(req, res, next)
        })

        it('should get the move from the session model', function() {
          expect(req.sessionModel.get).to.be.calledOnceWithExactly('move')
        })

        it('should call set move on session model', function() {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly('move', {
            ...move,
            ...values,
          })
        })

        it('should not call next', function() {
          expect(next).to.not.be.called
        })

        it('should call super', function() {
          expect(
            AssignBaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, res, next)
        })
      })
    })
  })
})
