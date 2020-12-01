const proxyquire = require('proxyquire')

const FormWizardController = require('../../common/controllers/form-wizard')

const DateSelectController = proxyquire('./controller', {
  '../../common/helpers/url': {
    dateRegex: '\\w{3}-\\d{4}',
  },
})

const controller = new DateSelectController({ route: '/' })

describe('Date select view controllers', function () {
  let req
  let res
  let next

  beforeEach(function () {
    sinon.stub(FormWizardController.prototype, 'get')
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

  describe('#get', function () {
    context('when called with a referrer', function () {
      beforeEach(function () {
        req.query.referrer = '/foo'
        controller.get(req, res, next)
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
          controller.get(req, res, next)
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

        it('should not call the super method', function () {
          expect(FormWizardController.prototype.get).to.not.be.called
        })
      })

      context('and a referrer has been stored', function () {
        beforeEach(function () {
          req.sessionModel.get.returns('/referrer')
          controller.get(req, res, next)
        })

        it('should not reset session model', function () {
          expect(req.sessionModel.reset).to.not.be.called
          expect(req.sessionModel.set).to.not.be.called
        })

        it('should get stored referrer', function () {
          expect(req.sessionModel.get).to.be.calledOnceWithExactly('referrer')
        })

        it('should set the cancel and back links', function () {
          expect(res.locals.cancelUrl).to.equal('/referrer')
          expect(res.locals.backLink).to.equal('/referrer')
        })

        it('should call the super method', function () {
          expect(
            FormWizardController.prototype.get
          ).to.be.calledOnceWithExactly(req, res, next)
        })

        it('should not redirect', function () {
          expect(res.redirect).to.not.be.called
        })
      })
    })
  })

  describe('#successHandler', function () {
    context('and a referrer exists', function () {
      beforeEach(function () {
        req.sessionModel.toJSON.returns({
          referrer: '/bar/foo-1234/outgoing',
          date_select: 'stored-date',
        })
        controller.successHandler(req, res, next)
      })

      it('should reset session model', function () {
        expect(req.sessionModel.reset).to.be.calledOnceWithExactly()
      })

      it('should redirect to the new date', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(
          '/bar/stored-date/outgoing'
        )
      })
    })

    context('and a referrer does not exist', function () {
      beforeEach(function () {
        controller.successHandler(req, res, next)
      })

      it('should redirect to the home page', function () {
        expect(res.redirect).to.be.calledOnceWithExactly('/')
      })
    })
  })
})
