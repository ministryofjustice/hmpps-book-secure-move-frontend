const middleware = require('./set-from-location')

describe('Moves middleware', function() {
  describe('#setFromLocation()', function() {
    let req, res, nextSpy
    const locationId = '7ebc8717-ff5b-4be0-8515-3e308e92700f'

    beforeEach(function() {
      res = { locals: {} }
      req = {
        query: {},
        session: {},
      }
      nextSpy = sinon.spy()
    })

    context('when location exists in users locations', function() {
      beforeEach(function() {
        req.session.user = {
          locations: [
            {
              id: locationId,
            },
          ],
        }

        middleware(req, res, nextSpy, locationId)
      })

      it('should set from location to locals', function() {
        expect(res.locals).to.have.property('fromLocationId')
        expect(res.locals.fromLocationId).to.equal(locationId)
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when location does not exist in users locations', function() {
      beforeEach(function() {
        middleware(req, res, nextSpy, locationId)
      })

      it('should not set from location to locals', function() {
        expect(res.locals).not.to.have.property('fromLocationId')
      })

      it('should call next with 404 error', function() {
        const error = nextSpy.args[0][0]

        expect(nextSpy).to.be.calledOnce

        expect(error).to.be.an('error')
        expect(error.message).to.equal('Location not found')
        expect(error.statusCode).to.equal(404)
      })
    })
  })
})
