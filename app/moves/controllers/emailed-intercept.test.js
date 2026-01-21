const controller = require('./emailed-intercept')

describe('Emailed intercept controller', function () {
  describe('#intercept()', function () {
    let res, nextSpy
    beforeEach(function () {
      nextSpy = sinon.spy()
      res = {
        locals: {
          MOVES_URL: '/moves/url',
        },
        render: sinon.spy(),
      }
    })

    describe('Email fallback is true', function () {
      beforeEach(function () {
        const req = {
          emailFallback: true,
        }
        controller(req, res, nextSpy)
      })

      it('should render emailed page', function () {
        expect(res.render).to.have.been.calledOnceWithExactly(
          'document-emailed',
          {
            backLink: '/moves/url',
            pageTitle: 'Requested document emailed to you',
          }
        )
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })
    })

    describe('Email fallback is false', function () {
      beforeEach(function () {
        const req = {
          emailFallback: false,
        }
        controller(req, res, nextSpy)
      })

      it('should not render emailed page', function () {
        expect(res.render).not.to.be.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.called
      })
    })
  })
})
