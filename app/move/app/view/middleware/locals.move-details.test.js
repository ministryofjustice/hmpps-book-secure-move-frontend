const presenters = require('../../../../../common/presenters')

const middleware = require('./locals.move-details')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsMoveDetails()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          canAccess: sinon.stub(),
          move: {
            id: '12345',
            foo: 'bar',
          },
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)

        middleware(req, res, nextSpy)
      })

      it('should call presenter', function () {
        expect(presenters.moveToMetaListComponent).to.be.calledOnceWithExactly(
          req.move
        )
      })

      it('should set move details on locals', function () {
        expect(res.locals).to.be.deep.equal({
          moveDetails: {
            id: '12345',
            foo: 'bar',
          },
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
