const presenters = require('../../../../../common/presenters')

const controller = require('./render-timeline')

describe('Move view app', function () {
  describe('Controllers', function () {
    describe('#renderTimeline()', function () {
      let req, res

      beforeEach(function () {
        sinon.stub(presenters, 'moveToTimelineComponent').returnsArg(0)

        req = {
          move: {
            id: '12345',
          },
          t: sinon.stub().returnsArg(0),
        }
        res = {
          breadcrumb: sinon.stub().returnsThis(),
          render: sinon.stub(),
        }
      })

      context('by default', function () {
        beforeEach(function () {
          controller(req, res)
        })

        it('should transform the data for presentation', function () {
          expect(
            presenters.moveToTimelineComponent
          ).to.be.calledOnceWithExactly(req.move)
        })

        it('should pass correct locals', function () {
          expect(res.render.args[0][1]).to.deep.equal({
            timeline: req.move,
          })
        })

        it('should render a template', function () {
          expect(res.render.args[0][0]).to.equal('move/app/view/views/timeline')
        })
      })

      context('with rejected single request', function () {
        beforeEach(function () {
          req.move = {
            status: 'cancelled',
            cancellation_reason: 'rejected',
            timeline_events: [
              {
                event_type: 'MoveReject',
                details: {
                  rebook: true,
                },
              },
            ],
          }
          controller(req, res)
        })

        it('should transform the data for presentation', function () {
          expect(
            presenters.moveToTimelineComponent
          ).to.be.calledOnceWithExactly(req.move)
        })

        it('should pass correct locals', function () {
          expect(res.render.args[0][1]).to.deep.equal({
            timeline: req.move,
          })
        })

        it('should copy rebook property from MoveReject event to move', function () {
          expect(req.move.rebook).to.be.true
        })

        it('should render a template', function () {
          expect(res.render.args[0][0]).to.equal('move/app/view/views/timeline')
        })
      })
    })
  })
})
