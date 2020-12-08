const proxyquire = require('proxyquire').noCallThru()

const getViewLocals = sinon.stub()

const controller = proxyquire('./view', {
  './view/view.locals': getViewLocals,
})

describe('Move controllers', function () {
  describe('#view()', function () {
    let req, res, params, moveService

    beforeEach(function () {
      moveService = {
        getByIdWithEvents: sinon.stub(),
      }
      getViewLocals.resetHistory()
      getViewLocals.returns({
        locals: 'view.locals',
      })

      req = {
        foo: 'bar',
        move: {},
        services: {
          move: moveService,
        },
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(async function () {
        await controller(req, res)
        params = res.render.args[0][1]
      })

      it('should render a template', function () {
        expect(res.render.calledOnce).to.be.true
      })

      it('should pass correct number of locals to template', function () {
        expect(params).to.deep.equal({
          locals: 'view.locals',
        })
      })

      it('should call moveToMetaListComponent presenter with correct args', function () {
        expect(getViewLocals).to.be.calledOnceWithExactly(req)
      })
    })

    context('when move is rejected single request', function () {
      beforeEach(async function () {
        req.services.move.getByIdWithEvents.resetHistory()
        req.services.move.getByIdWithEvents.resolves({
          timeline_events: [
            {
              event_type: 'MoveReject',
              details: {
                rebook: true,
              },
            },
          ],
        })
        req.move = {
          status: 'cancelled',
          cancellation_reason: 'rejected',
        }
        await controller(req, res)
      })

      it('should copy rebook property from MoveReject event to move', function () {
        expect(req.move.rebook).to.be.true
      })
    })
  })
})
