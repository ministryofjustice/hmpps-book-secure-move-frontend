const controller = require('./controllers')

describe('Police Custody Form controllers', function () {
  describe('#addEvents', function () {
    let mockReq, mockRes
    const moveId = '12232552242'

    beforeEach(function () {
      mockReq = {
        body: {
          moveId: moveId,
        },
      }
      mockRes = {
        redirect: sinon.stub(),
      }
    })

    context('when save is successful', function () {
      beforeEach(function () {
        controller.addEvents(mockReq, mockRes)
      })

      it('should redirect to the timeline/events page for that move', function () {
        expect(mockRes.redirect).to.be.calledOnceWithExactly(
          'move/12232552242/timeline'
        )
      })
    })
  })
})
