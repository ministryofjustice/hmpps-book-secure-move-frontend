const CancelController = require('./cancel')
const moveService = require('../../../common/services/move')

const controller = new CancelController({ route: '/' })
const mockMove = {
  id: '123456789',
  person: {
    fullname: 'Full name',
  },
}
const mockValues = {
  cancellation_reason: 'error',
  cancellation_reason_comment: 'Request was made in error',
}

describe('Move controllers', function() {
  describe('Cancel controller', function() {
    describe('#successHandler()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          form: {
            options: {
              allFields: {
                cancellation_reason: {},
                cancellation_reason_comment: {},
              },
            },
          },
          sessionModel: {
            reset: sinon.stub(),
            toJSON: () => mockValues,
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
          locals: {
            move: mockMove,
          },
        }
      })

      context('when move save is successful', function() {
        beforeEach(async function() {
          sinon.stub(moveService, 'cancel').resolves({})
          await controller.successHandler(req, res, nextSpy)
        })

        it('should cancel move', function() {
          expect(moveService.cancel).to.be.calledWith(mockMove.id, {
            reason: mockValues.cancellation_reason,
            comment: mockValues.cancellation_reason_comment,
          })
        })

        it('should reset the journey', function() {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function() {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect correctly', function() {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWith('/move/123456789')
        })
      })

      context('when save fails', function() {
        const errorMock = new Error('Problem')

        beforeEach(async function() {
          sinon.stub(moveService, 'cancel').throws(errorMock)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should call next with the error', function() {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function() {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.have.been.called
        })
      })
    })
  })
})
