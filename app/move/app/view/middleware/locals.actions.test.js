const proxyquire = require('proxyquire')

const getCanCancelMoveStub = sinon.stub()
const middleware = proxyquire('./locals.actions', {
  '../../../../../common/helpers/move/get-can-cancel-move':
    getCanCancelMoveStub,
})

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsActions()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {}
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        getCanCancelMoveStub.resetHistory()

        middleware(req, res, nextSpy)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
