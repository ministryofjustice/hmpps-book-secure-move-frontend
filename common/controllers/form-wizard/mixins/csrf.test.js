const proxyquire = require('proxyquire')

class Controller {
  constructor(options) {
    this.options = options || {}
    // run sinon stub with options of this controller
    Controller.constructor.call(this, options)
  }
}

Controller.constructor = sinon.stub()
Controller.prototype.use = sinon.stub()
Controller.prototype.middlewareSetup = sinon.stub()

describe('Form wizard', function () {
  describe('mixins/csrf', function () {
    let BaseController, StubController
    let req, res, next, controller, csrfStub, csrfMixin

    beforeEach(function () {
      const options = {}

      csrfStub = sinon.stub().returns({})
      csrfMixin = proxyquire('./csrf', {
        csurf: () => csrfStub,
      })

      BaseController = Controller
      StubController = csrfMixin(BaseController)
      controller = new StubController(options)

      req = {
        form: { options },
        method: 'GET',
      }
      res = {
        locals: {},
      }
      next = sinon.stub()
    })

    it('should export a function', function () {
      expect(csrfMixin).to.be.a('function')
      expect(csrfMixin).to.have.length(1)
    })

    it('should extend a passed controller', function () {
      expect(controller).to.be.an.instanceOf(BaseController)
    })

    describe('middlewareSetup override', function () {
      it('calls the super method', function () {
        controller.middlewareSetup()
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('uses the csrfGenerateSecret middleware', function () {
        controller.middlewareSetup()
        expect(BaseController.prototype.use).to.have.been.calledWithExactly(
          csrfStub
        )
      })
    })

    describe('csrfGenerateSecret middleware', function () {
      it('calls callback immediately', function () {
        controller.csrfGenerateSecret(req, res, next)
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    describe('csrfCheckToken middleware', function () {
      it('calls callback immediately', function () {
        controller.csrfCheckToken(req, res, next)
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })

    describe('csrfSetToken middleware', function () {
      it('generates a token on GET requests', function () {
        req.method = 'GET'
        req.csrfToken = sinon.stub().returns('A New Token')

        controller.csrfSetToken(req, res, next)

        expect(res.locals['csrf-token']).to.equal('A New Token')
        expect(next).to.have.been.calledOnceWithExactly()
      })

      it('should not call csrf.create on POST requests', function () {
        req.method = 'POST'

        controller.csrfSetToken(req, res, next)

        expect(res.locals['csrf-token']).to.be.undefined
        expect(next).to.have.been.calledOnceWithExactly()
      })
    })
  })
})
