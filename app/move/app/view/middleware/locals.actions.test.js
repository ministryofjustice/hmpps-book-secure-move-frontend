const middleware = require('./locals.actions')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsActions()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          canAccess: sinon.stub(),
          move: {
            id: '12345',
          },
          session: {
            user: {
              permissions: ['foo', 'bar'],
            },
          },
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()
      })

      context('when move can be cancelled', function () {
        beforeEach(function () {
          req.move._canCancel = true

          middleware()(req, res, nextSpy)
        })

        it('should add cancel action to locals', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'actions::cancel_move',
            classes: 'app-link--destructive',
            url: '/move/12345/cancel',
          })
        })

        it('should add opt out action to locals', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'messages::preview_new_feature.actions.return',
            itemClasses:
              'app-border-top-1 govuk-!-padding-top-4 govuk-!-margin-top-4',
            classes: 'govuk-button govuk-button--secondary',
            url: '/move/opt-out?move_id=12345',
          })
        })
      })

      context('when move cannot be cancelled', function () {
        beforeEach(function () {
          req.move._canCancel = false

          middleware()(req, res, nextSpy)
        })

        it('should not add cancel actions', function () {
          expect(res.locals.actions).not.to.deep.include({
            text: 'actions::cancel_move',
            classes: 'app-link--destructive',
            url: '/move/12345/cancel',
          })
        })

        it('should add opt out action to locals', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'messages::preview_new_feature.actions.return',
            itemClasses: undefined,
            classes: 'govuk-button govuk-button--secondary',
            url: '/move/opt-out?move_id=12345',
          })
        })
      })

      context('when user can view journeys', function () {
        beforeEach(function () {
          req.canAccess.withArgs('move:view:journeys').returns(true)

          middleware()(req, res, nextSpy)
        })

        it('should add cancel action to locals', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'actions::view_journeys',
            url: '/move/12345/journeys',
          })
        })

        it('should add opt out action to locals', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'messages::preview_new_feature.actions.return',
            itemClasses:
              'app-border-top-1 govuk-!-padding-top-4 govuk-!-margin-top-4',
            classes: 'govuk-button govuk-button--secondary',
            url: '/move/opt-out?move_id=12345',
          })
        })
      })

      context('when user cannot view journeys', function () {
        beforeEach(function () {
          req.canAccess.withArgs('move:view:journeys').returns(false)

          middleware()(req, res, nextSpy)
        })

        it('should not add cancel actions', function () {
          expect(res.locals.actions).not.to.deep.include({
            text: 'actions::view_journeys',
            url: '/move/12345/journeys',
          })
        })

        it('should add opt out action to locals', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'messages::preview_new_feature.actions.return',
            itemClasses: undefined,
            classes: 'govuk-button govuk-button--secondary',
            url: '/move/opt-out?move_id=12345',
          })
        })
      })

      context('with preview prefix argument', function () {
        beforeEach(function () {
          middleware({ previewPrefix: '/preview-path' })(req, res, nextSpy)
        })

        it('should add opt out action to locals with prefix', function () {
          expect(res.locals.actions).to.deep.include({
            text: 'messages::preview_new_feature.actions.return',
            itemClasses: undefined,
            classes: 'govuk-button govuk-button--secondary',
            url: '/move/preview-path/opt-out?move_id=12345',
          })
        })
      })

      it('should call next', function () {
        middleware()(req, res, nextSpy)

        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
