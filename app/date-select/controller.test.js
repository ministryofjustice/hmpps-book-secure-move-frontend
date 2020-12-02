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
    sinon.stub(FormWizardController.prototype, 'render')
    sinon.stub(controller, 'use')
    sinon.stub(controller, 'getErrors')
    sinon.stub(controller, 'setErrors')
    req = {
      query: {},
      sessionModel: {
        reset: sinon.stub(),
        set: sinon.stub(),
        get: sinon.stub(),
        toJSON: sinon.stub().returns({}),
      },
      form: {
        values: {},
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

      it('should save the referrer to the session model', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })

    context('when called without a referrer', function () {
      beforeEach(function () {
        controller.checkReferrer(req, res, next)
      })

      it('should redirect back to home page', function () {
        expect(res.redirect).to.be.calledOnceWithExactly('/')
      })

      it('should not call next', function () {
        expect(next).to.not.be.called
      })
    })
  })

  describe('#get', function () {
    beforeEach(function () {
      req.query.referrer = '/foo'
    })

    context('when called without errors', function () {
      beforeEach(function () {
        controller.getErrors.returns({ errorList: [] })
        controller.get(req, res, next)
      })

      it('should clear any values for date', function () {
        expect(req.sessionModel.reset).to.be.calledOnceWithExactly()
      })

      it('should set the cancel and back links', function () {
        expect(res.locals.cancelUrl).to.equal('/foo')
        expect(res.locals.backLink).to.equal('/foo')
      })

      it('should call the super method', function () {
        expect(FormWizardController.prototype.get).to.be.calledOnceWithExactly(
          req,
          res,
          next
        )
      })
    })

    context('when called with errors', function () {
      beforeEach(function () {
        controller.getErrors.returns({ errorList: [{ boom: true }] })
        controller.get(req, res, next)
      })

      it('should not clear any values for date', function () {
        expect(req.sessionModel.reset).to.not.be.called
      })

      it('should set the cancel and back links', function () {
        expect(res.locals.cancelUrl).to.equal('/foo')
        expect(res.locals.backLink).to.equal('/foo')
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

  describe('#render', function () {
    context('when called', function () {
      beforeEach(function () {
        controller.render(req, res, next)
      })

      it('should clear any errors', function () {
        expect(controller.setErrors).to.be.calledOnceWithExactly(null, req, res)
      })

      it('should call the super method', function () {
        expect(
          FormWizardController.prototype.render
        ).to.be.calledOnceWithExactly(req, res, next)
      })
    })
  })

  describe('#successHandler', function () {
    context('when called', function () {
      beforeEach(function () {
        req.query.referrer = '/bar/12-Aug-2020/outgoing'
        req.form.values.date_select = '25-Dec-2020'
        controller.successHandler(req, res, next)
      })

      it('should redirect to the new date', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(
          '/bar/25-Dec-2020/outgoing'
        )
      })
    })
  })
})
