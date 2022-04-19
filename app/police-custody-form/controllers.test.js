const controller = require('./controllers')

describe('Police Custody Form controllers', function () {
  describe('#addEvents', function () {
    const moveService = {
      getById: sinon.stub(),
    }

    const eventService = {
      postEvents: sinon.stub(),
    }

    let mockReq, mockRes
    const moveId = '12232552242'
    const lockoutEvents = []

    beforeEach(function () {
      mockReq = {
        body: {
          moveId: moveId,
          lockoutEvents,
        },
        user: {},
      }
      mockReq.services = { move: moveService, event: eventService }
      mockRes = {
        redirect: sinon.stub(),
      }
    })

    context('when save is successful', function () {
      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
      })

      it('should redirect to the timeline/events page for that move', function () {
        expect(mockRes.redirect).to.be.calledOnceWithExactly(
          'move/12232552242/timeline'
        )
      })
    })
  })
})
