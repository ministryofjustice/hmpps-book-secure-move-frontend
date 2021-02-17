const middleware = require('./set-from-location')

describe('Moves middleware', function () {
  describe('#setFromLocation()', function () {
    let req, res, nextSpy
    const locationId = '7ebc8717-ff5b-4be0-8515-3e308e92700f'

    beforeEach(function () {
      res = { locals: {} }
      req = {}
      nextSpy = sinon.spy()
    })

    context('when location exists in req', function () {
      beforeEach(function () {
        req.location = {
          id: locationId,
        }

        middleware(req, res, nextSpy, locationId)
      })

      it('should set from location to locals', function () {
        expect(res.locals).to.have.property('fromLocationId')
        expect(res.locals.fromLocationId).to.equal(req.location.id)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when location does not exist in req', function () {
      beforeEach(function () {
        middleware(req, res, nextSpy)
      })

      it('should not set from location to locals', function () {
        expect(res.locals).not.to.have.property('fromLocationId')
      })

      it('should call next with 404 error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
