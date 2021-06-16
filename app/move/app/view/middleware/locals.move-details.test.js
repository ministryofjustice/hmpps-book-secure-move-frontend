const proxyquire = require('proxyquire')

const presenters = require('../../../../../common/presenters')

const mockEditSteps = {}
const middleware = proxyquire('./locals.move-details', {
  '../../edit/steps': mockEditSteps,
})

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsMoveDetails()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {}
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)

        middleware(req, res, nextSpy)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
