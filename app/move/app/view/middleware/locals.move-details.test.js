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
            is_lockout: false,
            important_events: [{ event_type: 'MoveLodgingEnd' }],
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
          moveLodgingStarted: false,
          moveLodgingEnded: true,
          moveDetails: {
            id: '12345',
            foo: 'bar',
            is_lockout: false,
            important_events: [{ event_type: 'MoveLodgingEnd' }],
          },
          moveId: '12345',
          moveIsLockout: false,
        })
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
