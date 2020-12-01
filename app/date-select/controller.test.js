const proxyquire = require('proxyquire')

const FormWizardController = require('../../common/controllers/form-wizard')

const DateSelectController = proxyquire('./controller', {
  '../../common/helpers/url': {
    dateRegex: '\\d{2}-[A-Z][a-z]{2}-\\d{4}',
  },
})

const controller = new DateSelectController({ route: '/' })

describe('Date select view controllers', function () {
  let req
  let res
  let next

  beforeEach(function () {
    sinon.stub(FormWizardController.prototype, 'middlewareChecks')
    sinon.stub(FormWizardController.prototype, 'get')
    sinon.stub(controller, 'use')
    req = {
      query: {},
      sessionModel: {
        reset: sinon.stub(),
        set: sinon.stub(),
        get: sinon.stub(),
        toJSON: sinon.stub().returns({}),
      },
      form: {
        options: {
          fullPath: '/bar',
        },
      },
    }
    res = {
      redirect: sinon.stub(),
      locals: {},
    }
    next = sinon.stub()
  })

  describe('#middlewareChecks', function () {
    beforeEach(function () {
      controller.middlewareChecks(req, res, next)
    })
    it('should call parent method', function () {
      expect(FormWizardController.prototype.middlewareChecks).to.have.been
        .calledOnce
    })

    it('should call checkReferrer middleware', function () {
      expect(controller.use.firstCall).to.have.been.calledWith(
        controller.checkReferrer
      )
    })
  })

  describe('#checkReferrer', function () {
    context('when called with a referrer', function () {
      beforeEach(function () {
        req.query.referrer = '/foo'
        controller.checkReferrer(req, res, next)
      })

      it('should reset session model', function () {
        expect(req.sessionModel.reset).to.be.calledOnceWithExactly()
      })

      it('should save the referrer to the session model', function () {
        expect(req.sessionModel.set).to.be.calledOnceWithExactly(
          'referrer',
          req.query.referrer
        )
      })

      it('should redirect back to self', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(
          req.form.options.fullPath
        )
      })
    })

    context('when called without a referrer', function () {
      context('and a referrer has not been stored', function () {
        beforeEach(function () {
          controller.checkReferrer(req, res, next)
        })

        it('should not reset session model', function () {
          expect(req.sessionModel.reset).to.not.be.called
          expect(req.sessionModel.set).to.not.be.called
        })

        it('should get stored referrer', function () {
          expect(req.sessionModel.get).to.be.calledOnceWithExactly('referrer')
        })

        it('should redirect back to home page', function () {
          expect(res.redirect).to.be.calledOnceWithExactly('/')
        })

        it('should not call next', function () {
          expect(next).to.not.be.called
        })
      })

      context('and a referrer has been stored', function () {
        beforeEach(function () {
          req.sessionModel.get.returns('/referrer')
          controller.checkReferrer(req, res, next)
        })

        it('should not reset session model', function () {
          expect(req.sessionModel.reset).to.not.be.called
          expect(req.sessionModel.set).to.not.be.called
        })

        it('should get stored referrer', function () {
          expect(req.sessionModel.get).to.be.calledOnceWithExactly('referrer')
        })

        it('should call the super method', function () {
          expect(next).to.be.calledOnceWithExactly()
        })

        it('should not redirect', function () {
          expect(res.redirect).to.not.be.called
        })
      })
    })
  })

  describe('#get', function () {
    context('when called', function () {
      beforeEach(function () {
        req.sessionModel.get.returns('/referrer')
        controller.get(req, res, next)
      })

      it('should get stored referrer', function () {
        expect(req.sessionModel.get).to.be.calledOnceWithExactly('referrer')
      })

      it('should set the cancel and back links', function () {
        expect(res.locals.cancelUrl).to.equal('/referrer')
        expect(res.locals.backLink).to.equal('/referrer')
      })

      it('should call the super method', function () {
        expect(FormWizardController.prototype.get).to.be.calledOnceWithExactly(
          req,
          res,
          next
        )
      })
    })
  })

  describe('#successHandler', function () {
    context('when called', function () {
      beforeEach(function () {
        req.sessionModel.toJSON.returns({
          referrer: '/bar/12-Aug-2020/outgoing',
          date_select: '25-Dec-2020',
        })
        controller.successHandler(req, res, next)
      })

      it('should reset session model', function () {
        expect(req.sessionModel.reset).to.be.calledOnceWithExactly()
      })

      it('should redirect to the new date', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(
          '/bar/25-Dec-2020/outgoing'
        )
      })
    })
  })
})
