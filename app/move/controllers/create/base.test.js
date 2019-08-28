const FormController = require('hmpo-form-wizard').Controller

const CreateBaseController = require('./base')

const controller = new CreateBaseController({ route: '/' })

describe('Move controllers', function() {
  describe('Create base controller', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call check current location method', function() {
        expect(controller.use).to.have.been.calledWith(
          controller.checkCurrentLocation
        )
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set cancel url method', function() {
        expect(controller.use).to.have.been.calledWith(controller.setCancelUrl)
      })
    })

    describe('#setCancelUrl()', function() {
      let res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        res = {
          locals: {},
        }
      })

      context('with no moves url local', function() {
        beforeEach(function() {
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url correctly', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.be.undefined
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with moves url local', function() {
        beforeEach(function() {
          res.locals.MOVES_URL = '/moves?move-date=2019-10-10'
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url moves url', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.equal('/moves?move-date=2019-10-10')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#checkCurrentLocation()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          session: {},
        }
      })

      context('when current location exists', function() {
        beforeEach(function() {
          req.session = {
            currentLocation: {},
          }
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when no current location exists', function() {
        beforeEach(function() {
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next with error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0]).to.be.an('error')
          expect(nextSpy.args[0][0].message).to.equal(
            'Current location is not set in session.'
          )
        })
      })
    })
  })
})
