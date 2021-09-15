const Sentry = require('@sentry/node')
const proxyquire = require('proxyquire').noCallThru()

const analytics = {
  sendEvent: sinon.stub(),
}
const config = {
  COOKIES: {
    MOVE_DESIGN_PREVIEW: {
      name: userId => `cookie__${userId}`,
      maxAge: 3600,
    },
  },
}
const viewConstants = {
  PREVIEW_PREFIX: '/preview-prefix',
}

const controller = proxyquire('./preview-opt-in', {
  '../../../common/lib/analytics': analytics,
  '../app/view/constants': viewConstants,
  '../../../config': config,
})

describe('Move controllers', function () {
  describe('#previewOptIn()', function () {
    let req, res

    beforeEach(function () {
      req = {
        query: {},
        user: {
          userId: 'user_1',
        },
        currentLocation: {
          location_type: 'police',
        },
        headers: { 'user-agent': 'user-agent' },
      }
      res = {
        cookie: sinon.spy(),
        redirect: sinon.spy(),
      }
    })

    context('without move ID', function () {
      beforeEach(async function () {
        await controller(req, res)
      })

      it('should set a cookie with value of `1`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          1,
          { maxAge: config.COOKIES.MOVE_DESIGN_PREVIEW.maxAge }
        )
      })

      it('should record an event in Google Analytics', function () {
        expect(analytics.sendEvent).to.have.been.calledWithExactly({
          category: 'Move Design Preview',
          action: 'Opt in',
          label: 'police',
          userAgent: 'user-agent',
        })
      })

      it('should redirect to the homepage', function () {
        expect(res.redirect).to.have.been.calledOnceWith('/')
      })
    })

    context('with move ID', function () {
      beforeEach(async function () {
        req.query.move_id = 'AAA-BBB-CCC-111'
        await controller(req, res)
      })

      it('should set a cookie with value of `1`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          1,
          { maxAge: config.COOKIES.MOVE_DESIGN_PREVIEW.maxAge }
        )
      })

      it('should record an event in Google Analytics', function () {
        expect(analytics.sendEvent).to.have.been.calledWithExactly({
          category: 'Move Design Preview',
          action: 'Opt in',
          label: 'police',
          userAgent: 'user-agent',
        })
      })

      it('should redirect to the move', function () {
        expect(res.redirect).to.have.been.calledOnceWith(
          `/move${viewConstants.PREVIEW_PREFIX}/${req.query.move_id}`
        )
      })
    })

    context("when analytics aren't available", function () {
      beforeEach(async function () {
        sinon.stub(Sentry, 'captureException')
        analytics.sendEvent.throws()
        await controller(req, res)
      })

      it('should set a cookie with value of `1`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          1,
          { maxAge: config.COOKIES.MOVE_DESIGN_PREVIEW.maxAge }
        )
      })

      it('should record an issue in Sentry', function () {
        expect(Sentry.captureException).to.have.been.called
      })

      it('should redirect to the homepage', function () {
        expect(res.redirect).to.have.been.calledOnceWith('/')
      })
    })
  })
})
