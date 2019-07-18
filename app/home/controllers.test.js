const { home } = require('./controllers')

const permissions = require('../../common/middleware/permissions')

describe('Home controllers', function () {
  describe('#home()', function () {
    let req, res, nextSpy

    beforeEach(function () {
      sinon.stub(permissions, 'check')
      nextSpy = sinon.spy()
      req = {}
      res = {
        redirect: sinon.stub(),
      }
    })

    context('when user has view all moves permission', function () {
      beforeEach(function () {
        req.session = {
          user: {
            permissions: ['moves:view:all'],
          },
        }

        permissions.check
          .withArgs('moves:view:all', ['moves:view:all'])
          .returns(true)

        home(req, res, nextSpy)
      })

      it('should redirect to all moves', function () {
        expect(res.redirect).to.have.been.calledOnceWithExactly('/moves')
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.have.been.called
      })
    })

    context('when user has view by location permission', function () {
      beforeEach(function () {
        req.session = {
          user: {
            permissions: ['moves:view:by_location'],
          },
        }

        permissions.check
          .withArgs('moves:view:by_location', ['moves:view:by_location'])
          .returns(true)
      })

      context('when current location exists', function () {
        const mockLocationId = 'c249ed09-0cd5-4f52-8aee-0506e2dc7579'

        beforeEach(function () {
          req.session.currentLocation = {
            id: mockLocationId,
          }
          home(req, res, nextSpy)
        })

        it('should redirect to moves by location', function () {
          expect(res.redirect).to.have.been.calledOnceWithExactly(
            `/moves/${mockLocationId}`
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('when current location is missing', function () {
        beforeEach(function () {
          home(req, res, nextSpy)
        })

        it('should not redirect', function () {
          expect(res.redirect).not.to.have.been.called
        })

        it('should call next', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly()
        })
      })
    })

    context('when user has no matching permissions', function () {
      beforeEach(function () {
        home(req, res, nextSpy)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.have.been.called
      })

      it('should call next', function () {
        expect(nextSpy).to.have.been.calledOnceWithExactly()
      })
    })
  })
})
